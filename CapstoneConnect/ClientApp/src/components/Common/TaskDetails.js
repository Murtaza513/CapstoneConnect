import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Layout from "../Layout/Layout";
import { ErrorToaster, SuccessToaster } from "../Utils/Toast";
import useAuth from "../../context/useAuth";
import Axios from "../../axios";


const TaskDetails = () => {
    const { role } = useAuth()
    const { taskId } = useParams();
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const navigate = useNavigate();
    const [newTask, setNewTask] = useState({ title: '', description: '', date: '', feedback: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [students, setStudents] = useState([]);
    const [taskErr, setTaskErr] = useState(null);
    const [selectStudent, setSelectStudent] = useState("")
    const handleStudentChange = (e) => {
        setSelectStudent(e.target.value)
    }

    const handleSaveTask = async (e) => {
        if (!newTask.title || !newTask.description || !newTask.date || !selectStudent) {
            setTaskErr("Please fill all fields")
            return;
        }
        e.preventDefault();
        const data = {
            Id: taskId,
            FypId: task[0]?.fypId,
            Title: newTask.title,
            Description: newTask.description,
            Deadline: newTask.date,
            Feedback: newTask.feedback,
            AssignedTo: selectStudent,
            Status: task[0]?.status
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("fypdashboard/updateworkitem", data)
            
            if (response.status === 200) {
                SuccessToaster(response.data.message);
                fetchTaskDetails();
                setIsAdding(false);
            }
        }
        catch (error) {
            ErrorToaster(error.response.data.message)
            console.log("Err", error)
        }
        finally { setBtnLoading(false) }
    };

    const fetchStudents = async (fypId) => {
        try {
            const response = await Axios.get(`fypdashboard/getnamesmembers/${fypId}`)
            setStudents(response.data)
        }
        catch (err) {
            console.log("err=> ", err)
        }

    }

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const response = await Axios.get(`fypdashboard/getworkitembyid/${taskId}`);
            setTask(response.data);
            fetchStudents(response.data[0]?.fypId);
            setNewTask({
                title: response.data[0]?.title, description: response.data[0]?.description,
                date: response.data[0]?.deadline.toString().split('T')[0], feedback: response.data[0]?.feeddback
            })
            setSelectStudent(response.data[0]?.assignedTo)
        } catch (error) {
            console.error('Error fetching task details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    return (
        <Layout>
            <div className='mainmargins'>
                <div className="project-page">
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div><button onClick={() => setIsAdding(true)}>Edit Task</button></div>
                    </div>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div> :
                        <div className="project-info">
                            <h2>Task Details</h2>
                            {task.map((task, index) => (
                                <div key={index}>
                                    <p>
                                        <strong>Project ID:</strong> {task.fypId}
                                    </p>
                                    <p>
                                        <strong>Title:</strong> {task.title}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {task.description}
                                    </p>
                                    <p>
                                        <strong>Feedback:</strong> {task.feedback ?? "No Feedback Provided"}
                                    </p>
                                    <p>
                                        <strong>Assigned To:</strong> {task.assignedTo}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {task.status}
                                    </p>
                                    <p>
                                        <strong>Assigned On:</strong> {new Date(task.assignedOn).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                            )) }
                            
                        </div>}
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAdding(false)}>&times;</span>
                        <h2>Edit FeedBack</h2>
                        <form onSubmit={handleSaveTask}>
                            <label>Title:</label>
                            <input type="text" name="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}/>
                            <label>Description:</label>
                            <textarea name="description" cols="40" rows="5" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
                            {role === "Supervisor" && 
                            <Fragment>
                            <label>Feedback:</label>
                            <textarea name="feedback" cols="40" rows="5" value={newTask.feedback} onChange={(e) => setNewTask({ ...newTask, feedback: e.target.value })} />
                            </Fragment>}
                            <label>Deadline:</label>
                            <input style={{
                                width: "100%", padding: "8px", marginBottom: "10px",
                                border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box"
                            }} type="date" name="date" value={newTask.date} onChange={(e) => setNewTask({ ...newTask, date: e.target.value })} />
                            <div style={{ paddingBottom: "8px" }}>
                                <label>Assigned To</label>
                                <select className="form-control custom-select" value={selectStudent} onChange={handleStudentChange} style={{ marginRight: '8px' }}>
                                    <option value="" disabled>Select Student</option>
                                    {students.map((student, index) => (
                                        <option key={index} value={student}>{student}</option>
                                    ))}
                                </select>
                            </div>
                            {taskErr && <div style={{ color: 'red', fontStyle: 'italic', fontSize: "14px", marginTop: '8px' }}>{taskErr}</div>}
                            <button
                                type="submit"
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Updating...' : 'Update Task'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default TaskDetails;