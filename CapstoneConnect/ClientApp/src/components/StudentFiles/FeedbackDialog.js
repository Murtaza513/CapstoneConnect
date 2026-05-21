import React, { useEffect, useState } from 'react';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';
import Axios from '../../axios';

const FeedBackDialog = ({ feedBackId, setShowFeedBack }) => {
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedBack] = useState("")
    const fetchProposals = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`usermanagement/fetchfeedback/${feedBackId}`);
            setFeedBack(response?.data?.value?.feedback);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => { fetchProposals() }, [])
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => { setShowFeedBack(false) }}>&times;</span>
                <h5>FeedBack</h5>
                {loading ? < div style={{ padding: "22px" }}><p>loading...</p></div> :
                    <div className="row">
                        <textarea
                            value={feedback ? feedback: "No feedback uploaded"}
                            disabled
                            rows="4"
                            cols="50"
                        />
                        <button onClick={() => { setShowFeedBack(false) }}>Done</button>
                    </div>}
            </div>
        </div>
    );
};

export default FeedBackDialog;
