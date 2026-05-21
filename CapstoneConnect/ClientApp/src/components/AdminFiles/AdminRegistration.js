import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Axios from '../../axios';
import { ErrorToaster, SuccessToaster } from '../Utils/Toaster';

function AdminRegistration() {
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [btnLoading, setBtnLoading] = useState({});
    const [loading, setLoading] = useState(false)

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await Axios.get('Admin/FetchProjects');
            if (response.status === 200 || response.status === 204) {
                if (response.data) {
                    setProjects(response.data)
                } else {
                    setProjects([])
                }
            }

        } catch (error) {
            console.log(error)
            ErrorToaster("No submissions found")
        } finally { setLoading(false) }
    };

    useEffect(() => {
        fetchProjects()
    }, []);

    const handleApprove = async (projectId) => {
        setBtnLoading(prevState => ({ ...prevState, [projectId]: { ...prevState[projectId], approve: true } }));
        try {
            const response = await Axios.post('Admin/AcceptProposal/' + projectId);
            if (response.status === 200) {
                SuccessToaster("Accepted Successfully");
                fetchProjects()
            }
        }
        catch (error) {
            ErrorToaster(error?.response?.data)
        } finally {
            setBtnLoading(prevState => ({ ...prevState, [projectId]: { ...prevState[projectId], approve: false } }));
        }
    };

    const handleReject = async (projectId) => {
        setBtnLoading(prevState => ({ ...prevState, [projectId]: { ...prevState[projectId], reject: true } }));
        try {
            const response = await Axios.post('Admin/RejectProposal/' + projectId);
            console.log("reject",response)
            if (response.status === 200) {
                SuccessToaster("Rejected");
                fetchProjects()
            }
        }
        catch (error) {
            ErrorToaster(error?.response?.data)
        } finally {
            setBtnLoading(prevState => ({ ...prevState, [projectId]: { ...prevState[projectId], reject: false } }));
        }
    };

    const filteredProjects = projects?.filter(project => {
        const values = Object?.values(project)?.map(value => String(value)?.toLowerCase());
        return values?.some(value => value?.includes(searchQuery?.toLowerCase()));
    });

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        <h2>Pending Registrations</h2>
                    </div>
                    {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop: "18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div>: 
                    <div>
                        <div className="adminRegis">
                            <div style={{width: "25%"} }>
                            <input type="text" className="form-control" placeholder="Search By Project Name..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <br />
                            </div>
                            <div className="table-responsive">
                            <table className="minimalist-table">
                                <thead>
                                    <tr>
                                        <th>Project  No</th>
                                        <th>Project Name</th>
                                        <th>Team Lead</th>
                                        <th>Member 1</th>
                                        <th>Member 2</th> <th>Member 3</th>
                                            <th ></th><th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects?.map((project, index) => (
                                        <tr key={index} id={project.id}>
                                            <td>{project.fypId}</td>
                                            <td>{project.title}</td>
                                            <td>{project.teamLead_Id ?? '-'}</td>
                                            <td>{project.member1_Id ?? '-'}</td>
                                            <td>{project.member2_Id ?? '-'}</td>
                                            <td>{project.member3_Id ?? '-'}</td>
                                            <td>
                                                <button onClick={() => handleApprove(project.fypId)}
                                                    className={`addSupervisorButton ${btnLoading[project.fypId]?.approve ? 'disabled' : ''}`}
                                                    disabled={btnLoading[project.fypId]?.approve}
                                                >
                                                    {btnLoading[project.fypId]?.approve ? 'Approving...' : 'Approve'}
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => handleReject(project.fypId)}
                                                    className={`statusRej ${btnLoading[project.fypId]?.reject ? 'disabled' : ''}`}
                                                    disabled={btnLoading[project.fypId]?.reject}
                                                >
                                                    {btnLoading[project.fypId]?.reject ? 'Rejecting...' : 'Reject'}
                                                </button>
                                            </td>
                                            {/*<td>
                                                <Link className='regview Adminbtn' to='/RegData'>
                                                    <button>View</button>
                                                </Link>
                                            </td>*/}
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </div>
                        </div>}
                </div>
            </div>
        </Layout>
    );
}

export default AdminRegistration;
