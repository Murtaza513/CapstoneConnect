import React, { Fragment, useEffect, useRef, useState } from 'react'
import dots from '../assets/icons8-dots-30.png'
import Layout from '../Layout/Layout';
import Axios from '../../axios';
import { useLocation, useNavigate } from 'react-router-dom'
import { ErrorToaster, SuccessToaster } from '../Utils/Toaster';

function ProjectInner() {
    const { state } = useLocation()
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const location = useLocation();
    const { fypId, projectName, description } = location.state || {};
    console.log("prkName-> ", projectName)
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [selectStudent, setSelectStudent] = useState("")
    const [todoTasks, setTodoTasks] = useState([])
    const [inProgTasks, setInProgTasks] = useState([])
    const [completeTasks, setCompleteTasks ] = useState([])
    const [newTask, setNewTask] = useState({ title: '', description: '', date: '', feedback: '' });
    const [taskErr, setTaskErr] = useState(null);
    const [isConfirm, setIsConfirm] = useState(false);
    const [isprogress, setIsProgress] = useState(false);
    const [taskID, setTaskID] = useState("")
    

    /*Menu Section Logic*/
    const handleMenuToggle = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleView = (taskId) => {
        navigate(`/view-task-details/${taskId}`);
    };

    const handleDelete = async() => {
        // Add your delete logic here
        console.log(`Deleting task with ID: ${taskID}`);
        try {
            const response = await Axios.post(`fypdashboard/deleteworkitem/${taskID}`,)
            if (response.status === 200) {
                SuccessToaster("Task Deleted")
                fetchTasks();
                setOpenMenuIndex(null);
                setIsConfirm(false)
            }
        }
        catch (error) {
            ErrorToaster(error?.response?.data?.message)
            console.log("Err", error)
        }
    };

    const handleMoveToInProgress = async (taskId, status) => {
        const data = {
            Id: taskId,
            Status: status
        }
        try {
            setLoading(true)
            const response = await Axios.post("fypdashboard/updateworkitem", data)
            console.log("inprog->", response)
            if (response.status === 200) {
                SuccessToaster("Task Status Updated")
                fetchTasks();
                setOpenMenuIndex(null);
            }
        }
        catch (error) {
            console.log("Err", error)
        } finally { setLoading(false) }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuIndex(null); 
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);
    //
    const handleStudentChange = (e) => {
        setTaskErr(null)
        setSelectStudent(e.target.value)
    }

    const handleSaveTask = async (e) => {
        e.preventDefault();
        console.log("add event")
        if (!newTask.title || !newTask.description || !newTask.date || !selectStudent) {
            setTaskErr("Please fill all fields")
            return;
        }
        const data = {
            FypId: state?.data,
            Title: newTask.title,
            Description: newTask.description,
            Deadline: newTask.date,
            Feedback: newTask.feedback,
            AssignedTo: selectStudent,
            Status: "Todo"
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("fypdashboard/addworkitem", data)
            console.log(response)
            if (response.status === 200) {
                SuccessToaster(response?.data?.message)
                setIsAdding(false);
                fetchTasks()
            }
        }
        catch (err) {
            console.log("err=> ", err)
            ErrorToaster(err?.response?.data)
        }
        finally {
            setBtnLoading(false)
        }

    }

    const handleUpdateTask = async (e) => {
        if (!newTask.feedback) {
            setTaskErr("Please fill all fields")
            return;
        }
        e.preventDefault();
        const data = {
            Id: taskID,
            Status: "InProgress",
            Feedback: newTask.feedback,
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("fypdashboard/updateworkitem", data)

            if (response.status === 200) {
                SuccessToaster(response.data.message);
                fetchTasks();
                setIsProgress(false);
                setNewTask({})
            }
        }
        catch (error) {
            ErrorToaster(error.response.data.message)
            console.log("Err", error)
        }
        finally { setBtnLoading(false) }
    };

    const handleAddTask = () => {
        setIsAdding(true);
        setNewTask({
            title: '',
            description: '',
            date: '',
        });
    };

    const fetchStudents = async () => {
        try {
            const response = await Axios.get(`fypdashboard/getnamesmembers/${state?.data}`)
            setStudents(response.data)
        }
        catch (err) {
            console.log("err=> ", err)
        }

    }

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`fypdashboard/getworkitembyfypid/${state?.data}`)
            const filterTodo = response?.data?.filter((item) => item.status === "Todo")
            setTodoTasks(filterTodo)
            const filterInprogress = response?.data?.filter((item) => item.status === "InProgress")
            setInProgTasks(filterInprogress)
            const filterComplete = response?.data?.filter((item) => item.status === "Completed")
            setCompleteTasks(filterComplete)
        }
        catch (err) {
            console.log("err=> ", err)
        } finally { setLoading(false) }

    }

    useEffect(() => {
        fetchStudents();
        fetchTasks();
    }, [])

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="projInerMain">
                    <div className="container">
                        <div className="row pi1">
                            <div className="row">
                                <h2>{projectName}</h2>
                                <p>{description}</p>
                                <h3 style={{ paddingBottom: "16px" }}><strong>Task Board</strong> </h3>
                                <hr/>
                            </div>
                        </div>
                        {/*<div className="row pi2">*/}
                        {/*    <div className="col-4">*/}
                        {/*        <GanttChart2 />*/}

                        {/*    </div>*/}
                        {/*    <div className="col-4">*/}
                        {/*        <GanttChart />*/}
                        {/*    </div>*/}
                        {/*    <div className="col-4">*/}
                        {/*        <GanttChart3 />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div></div> :
                            <div className="row pi3">
                                <div className="stdDashSec2">
                                    <div className="col-4">
                                        <div className="todo">
                                            <div className="head">
                                                <h5>to do</h5>
                                                <button onClick={() => handleAddTask()}>+</button>
                                            </div>
                                            {!todoTasks?.length ?
                                                <div className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                    <div style={{ paddingTop: "15%", }}>
                                                        <h4>No Tasks In Todo</h4>
                                                    </div>
                                                </div> :
                                                <Fragment>
                                                    {todoTasks?.map((task, index) => (
                                                        <div key={index} className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                            <div className="uppersec">
                                                                <p className="task"> Task {index + 1} </p>
                                                                <button onClick={() => handleMenuToggle(task.id)}><img src={dots} alt="" /></button>
                                                            </div>
                                                            <div style={{ paddingTop: "12px" }}>
                                                                <h4>{task.title}</h4>
                                                                <p className="dscrpt">Task Assigned to: <strong>{task.assignedTo}</strong></p>
                                                            </div>
                                                            {openMenuIndex === task.id && (
                                                                <div className="menu" ref={menuRef}>
                                                                    <ul>
                                                                        <li onClick={() => handleView(task.id)}>View</li>
                                                                        <li onClick={() => handleMoveToInProgress(task.id, "InProgress")}>Move to In Progress</li>
                                                                        <li onClick={() => { setIsConfirm(true); setTaskID(task.id); setOpenMenuIndex(null) }}>Delete</li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </Fragment>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="todo pending">
                                            <div className="head">
                                                <h5>In progress</h5>
                                                <p style={{ backgroundColor: "#ffc107", padding: "6px 18px" }} className="task"> Total: {inProgTasks?.length} </p>
                                            </div>
                                            {!inProgTasks?.length ?
                                                <div className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                    <div style={{ paddingTop: "15%", }}>
                                                        <h4>No Tasks In Progress</h4>
                                                    </div>
                                                </div> :
                                                <Fragment>
                                                    {inProgTasks?.map((task, index) => (
                                                        <div key={index} className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                            <div className="uppersec">
                                                                <p className="task"> Task {index + 1} </p>
                                                                <button onClick={() => handleMenuToggle(task.id)}><img src={dots} alt="" /></button>
                                                            </div>
                                                            <div style={{ paddingTop: "12px" }}>
                                                                <h4>{task.title}</h4>
                                                                <p className="dscrpt">Task Assigned to: <strong>{task.assignedTo}</strong></p>
                                                            </div>
                                                            {openMenuIndex === task.id && (
                                                                <div className="menu" ref={menuRef}>
                                                                    <ul>
                                                                        <li onClick={() => handleView(task.id)}>View</li>
                                                                        <li onClick={() => handleMoveToInProgress(task.id, "Completed")}>Move to Completed</li>
                                                                        <li onClick={() => handleMoveToInProgress(task.id, "Todo")}>Move to Todo</li>
                                                                        <li onClick={() => { setIsConfirm(true); setTaskID(task.id); setOpenMenuIndex(null) }}>Delete</li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </Fragment>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="todo cmpleted">
                                            <div className="head">
                                                <h5>Completed</h5>
                                                <p style={{ backgroundColor: "#198754", padding: "6px 18px" }} className="task"> Total: {completeTasks?.length} </p>
                                            </div>
                                            {!completeTasks?.length ?
                                                <div className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                    <div style={{ paddingTop: "15%", }}>
                                                        <h4>No Tasks In Completed</h4>
                                                    </div>
                                                </div> :
                                                <Fragment>
                                                    {completeTasks?.map((task, index) => (
                                                        <div key={index} className="card" style={{ maxHeight: "200px", minHeight: "200px" }}>
                                                            <div className="uppersec">
                                                                <p className="task"> Task {index + 1} </p>
                                                                <button onClick={() => handleMenuToggle(task.id)}><img src={dots} alt="" /></button>
                                                            </div>
                                                            <div style={{ paddingTop: "12px" }}>
                                                                <h4>{task.title}</h4>
                                                                <p className="dscrpt">Task Assigned to: <strong>{task.assignedTo}</strong></p>
                                                            </div>
                                                            {openMenuIndex === task.id && (
                                                                <div style={{ left: "160px" }} className="menu" ref={menuRef}>
                                                                    <ul>
                                                                        <li onClick={() => handleView(task.id)}>View</li>
                                                                        <li onClick={() => { setIsProgress(true); setTaskID(task.id); setOpenMenuIndex(null) }}>Move to In Progress</li>
                                                                        <li onClick={() => { setIsConfirm(true); setTaskID(task.id); setOpenMenuIndex(null) }}>Delete</li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </Fragment>
                                            }

                                        </div>
                                    </div>

                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
            {/* Add Event Modal */}
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsAdding(false); setTaskErr(null) }}>&times;</span>
                        <h2>Add New Task</h2>
                        <form onSubmit={handleSaveTask}>
                            <label>Title:</label>
                            <input type="text" name="title" value={newTask.title} onChange={(e) => { setNewTask({ ...newTask, title: e.target.value }); setTaskErr(null) }} />
                            <label>Description:</label>
                            <textarea name="description" cols="40" rows="5" value={newTask.description} onChange={(e) => { setNewTask({ ...newTask, description: e.target.value }); setTaskErr(null) }} />
                            <label>Feedback:</label>
                            <textarea name="feedback" cols="40" rows="5" value={newTask.feedback} onChange={(e) => { setNewTask({ ...newTask, feedback: e.target.value }); setTaskErr(null) }} />

                            <label>Deadline:</label>
                            <input style={{
                                width: "100%", padding: "8px", marginBottom: "10px",
                                border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box"
                            }} type="date" name="date" value={newTask.date} onChange={(e) => { setNewTask({ ...newTask, date: e.target.value }); setTaskErr(null) }} />
                            <div style={{ paddingBottom: "8px" }}>
                                <label>Assigned To</label>
                                <select className="form-control custom-select" value={selectStudent} onChange={handleStudentChange} style={{ marginRight: '8px' }}>
                                    <option value="" disabled>Select Student</option>
                                    {students.map((student, index) => (
                                        <option key={index} value={student}>{student }</option>
                                    ))}
                                </select>
                            </div>
                            {taskErr && <div style={{ color: 'red', fontStyle: 'italic', fontSize: "14px", marginTop: '8px' }}>{taskErr}</div>}
                            <button
                                type="submit"
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Adding Task...' : 'Add Task'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isConfirm &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsConfirm(false)}>&times;</span>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                            <h5>Are you sure?</h5>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "8px" }}>
                            <h6>you won't be able to revert this</h6>
                        </div>
                        <button style={{ background: "#e3050c" }} onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            }
            {isprogress &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsProgress(false); setNewTask({}) }}>&times;</span>
                        <h3>Add FeedBack</h3>
                        <form onSubmit={handleUpdateTask}>
                            <label>Feedback:</label>
                            <textarea name="feedback" cols="40" rows="5" value={newTask.feedback} onChange={(e) => setNewTask({ ...newTask, feedback: e.target.value })} />
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
            }
        </Layout>
    )
}

export default ProjectInner
