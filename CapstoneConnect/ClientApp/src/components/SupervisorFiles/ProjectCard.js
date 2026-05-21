import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Axios from './../../axios';
import { ErrorToaster, SuccessToaster } from '../Utils/Toast';

const ProjectCard = ({ projectName, projectLead, description, progress, memeberName, fypId, status, getProjects }) => {
    
    const navigate = useNavigate()
    const [isComplete, setIsComplete] = useState(false)
    const handleComplete = async () => {
        console.log("complete call")
        try {
            const response = await Axios.post(`supervisor/markprojectcomplete/${fypId}`)
            console.log(response)
            if (response.status ===200) {
                SuccessToaster("Marked Successfuly")
                setIsComplete(false)
                getProjects()
            }
        }
        catch (err) {
            ErrorToaster("Something went wrong")
        }
    }
    return (
        <div className="project-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>{projectName}</h3>
                {status === "Complete" && <p style={{ backgroundColor: "#d1e2c3", borderRadius: "26px", padding: "4px", color:"green" }}>Completed</p>}
            </div>
            <p>
                <strong>Project Lead:</strong> {projectLead}
            </p>
            <div className="Team-member">
            <p>
                <strong>Team Members:</strong> {memeberName}
            </p>
            </div>
            <div style={{minHeight: "65px", maxHeight: "65px", width: "100%", display: "-webkit-box", WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3, overflow: "hidden",textOverflow: "ellipsis",lineHeight: "1.2em"} }>
                <p>{description}</p>
            </div>
            {/*<div className="additional-details">
                <h4>Additional Details</h4>
                <p>Placeholder content related to the project...</p>
            </div>*/}
            <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style={{ width: `${progress}%` }}>{progress}% Complete</div>
            </div>
            <Link to='/ProjectInner' state={{ data: fypId, projectName, description }}><button>View Project</button></Link>
            <div className="btnCard">
                <button style={{ backgroundColor: "green" }} onClick={() => navigate('/SubmitDocs', { state: { data: fypId } })} >View Submited Docs</button>
            </div>
            {(progress == 100 && status !== "Complete") && 
                <div className="btnCard">
                    <button style={{ backgroundColor: "limegreen" }} onClick={()=>setIsComplete(true) } >Mark as complete</button>
                </div>
            }
            {isComplete && 
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsComplete(false)}>&times;</span>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                            <h5>Are you sure?</h5>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom:"8px" }}>
                            <h6>Mark Project As Complete?</h6>
                        </div>
                        <button onClick={handleComplete}>Complete</button>
                    </div>
                </div>
                }
        </div>
    );
};

ProjectCard.propTypes = {
    projectName: PropTypes.string.isRequired,
    projectLead: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
};

export default ProjectCard;
