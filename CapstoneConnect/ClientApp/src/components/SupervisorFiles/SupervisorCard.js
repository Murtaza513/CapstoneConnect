//import React, { useState } from 'react';

//function SupervisorCard({ supervisor, calIcon, clockIcon, onDelete, onEdit }) {
//    const [isEditing, setIsEditing] = useState(false);
//    const [editedSupervisor, setEditedSupervisor] = useState({ ...supervisor });

//    const handleEditChange = (e) => {
//        const { name, value } = e.target;
//        setEditedSupervisor({
//            ...editedSupervisor,
//            [name]: value
//        });
//    };

//    const handleEdit = () => {
//        setIsEditing(true);
//    };

//    const handleSave = () => {
//        setIsEditing(false);
//        onEdit(supervisor.id, editedSupervisor); // Pass back the edited supervisor data
//    };

//    return (
//        <div className="supervisor_card">
//            <div className="imgSec">
//                <img src={supervisor.img} alt="" />
//                <h4 className="superviorTitle">
//                    {isEditing ?
//                        <input
//                            type="text"
//                            name="name"
//                            placeholder="Name"
//                            value={editedSupervisor.name}
//                            onChange={handleEditChange}
//                        />
//                        : supervisor.name
//                    }
//                </h4>
//            </div>
//            {isEditing ?
//                <React.Fragment>
//                    <input
//                        type="text"
//                        name="description"
//                        placeholder="Description"
//                        value={editedSupervisor.description}
//                        onChange={handleEditChange}
//                    />
//                    <input
//                        type="text"
//                        name="subject"
//                        placeholder="Subject"
//                        value={editedSupervisor.subject}
//                        onChange={handleEditChange}
//                    />
//                    <input
//                        type="text"
//                        name="date"
//                        placeholder="Date"
//                        value={editedSupervisor.date}
//                        onChange={handleEditChange}
//                    />
//                    <input
//                        type="text"
//                        name="time"
//                        placeholder="Time"
//                        value={editedSupervisor.time}
//                        onChange={handleEditChange}
//                    />
//                </React.Fragment>
//                :
//                <React.Fragment>
//                    <p>{supervisor.description}</p>
//                    <p>{supervisor.subject}</p>
//                    <p>{supervisor.date}</p>
//                    <p>{supervisor.time}</p>
//                </React.Fragment>
//            }
//            {isEditing ?
//                <button onClick={handleSave}>Save</button>
//                :
//                <React.Fragment>
//                    <button onClick={handleEdit}>Edit</button>
//                    <button onClick={() => onDelete(supervisor.id)}>Delete</button>
//                </React.Fragment>
//            }
//        </div>
//    );
//}

//export default SupervisorCard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function SupervisorCard({ supervisor, calIcon, clockIcon, onDelete, onEdit }) {
    return (
        <div className="supervisor_card">
            <div className="imgSec">
                <img src={supervisor.img} alt="" />
                <h4 className="superviorTitle">{supervisor.name}</h4>
            </div>
            <p>{supervisor.description}</p>
            <p>Preferences: {supervisor.fyppreferences}</p>
            <p>Available slots: {supervisor.availableSlots}</p>
            <Link to={`/SupervisorDetails`} className="view_button">
                View
            </Link>
            <button onClick={() => onDelete(supervisor.id)}>Delete</button>
        </div>
    );
}

export default SupervisorCard;
