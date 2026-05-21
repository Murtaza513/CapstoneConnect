import os
import pandas as pd
from flask import Flask, request, jsonify
import pickle
from sentence_transformers import SentenceTransformer, util
import logging

app = Flask(__name__)

dataset_path = '../dataset/fyp_repository.xlsx'
model_dir = os.path.dirname(dataset_path)
model_name = 'all-MiniLM-L6-v2'

model = SentenceTransformer(model_name)
logging.basicConfig(level=logging.DEBUG)


def train_model():
    df = pd.read_excel(dataset_path)
    existing_proposal_texts = df['ProjectDescription'].tolist()

    embeddings = model.encode(existing_proposal_texts, convert_to_tensor=True)

    embeddings_path = os.path.join(model_dir, 'embeddings.pkl')
    with open(embeddings_path, 'wb') as f:
        pickle.dump(embeddings, f)

    return "Model trained and saved."


def check_similarity(new_proposal_text):

    embeddings_path = os.path.join(model_dir, 'embeddings.pkl')
    with open(embeddings_path, 'rb') as f:
        embeddings = pickle.load(f)

    new_embedding = model.encode(new_proposal_text, convert_to_tensor=True)

    similarities = util.pytorch_cos_sim(new_embedding, embeddings)[0]

    df = pd.read_excel(dataset_path)
    df['FYPId'] = pd.to_numeric(df['FYPId'], errors='coerce')
    df = df.dropna(subset=['FYPId'])
    df['FYPId'] = df['FYPId'].astype(int)

    similar_projects = []
    for idx, similarity in enumerate(similarities):
        try:
            if similarity > 0.6:
                fyp_id = int(df.loc[idx, 'FYPId'])
                similarity_score = similarity.item()
                similar_projects.append((fyp_id, similarity_score))
        except Exception as e:
            logging.error(f"Error processing index {idx}: {e}")
            raise

    return similar_projects


@app.route('/train_model', methods=['POST'])
def train_model_api():
    try:
        message = train_model()
        logging.debug(f"Model training message: {message}")
        return jsonify({"message": message}), 200
    except Exception as e:
        logging.error(f"Error in train_model_api: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route('/check_similarity', methods=['POST'])
def check_similarity_api():
    try:
        data = request.get_json()
        new_proposal_text = data.get('project_description', '')

        if not new_proposal_text:
            return jsonify({"error": "Project description is required"}), 400

        similar_projects = check_similarity(new_proposal_text)
        if similar_projects:
            similar_project_details = [{"fyp_id": fyp_id, "similarity": similarity} for fyp_id, similarity in similar_projects]
            return jsonify({"message": "Similar projects found", "similar_projects": similar_project_details}), 200
        else:
            return jsonify({"message": "No similar projects found"}), 200
    except Exception as e:
        logging.error(f"Error in check_similarity_api: {str(e)}")
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
