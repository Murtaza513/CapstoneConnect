import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout'
import Axios from '../../axios';
import Pagination from '../Utils/Pagination';
import useAuth from '../../context/useAuth';
import { SuccessToaster } from '../Utils/Toast';
import { ErrorToaster } from '../Utils/Toaster';

function StudentQueries() {
    const { userId, role } = useAuth()
    const [queries, setQueries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [viewResponse, setViewResponse] = useState(false);
    const [queryResponse, setQueryResponse] = useState([]);
    const [queryErr, setQueryErr] = useState(null)
    const [queryData, setQueryData] = useState({
        Title: '',
        Description: '',
    });
    const handleQueryChange = (e) => {
        setQueryErr(null)
        setQueryData({
            ...queryData,
            [e.target.name]: e.target.value
        });
    };

    const submitQuery = async (e) => {
        e.preventDefault()
        const data = {
            FypId: userId,
            Title: queryData.Title,
            Description: queryData.Description,
        }
        if (!queryData.Title || !queryData.Description) {
            setQueryErr("Select and fill feedback status")
            return
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("studentmanagement/addquery", data)
            if (response.status === 200) {
                SuccessToaster("Query Send")
                console.log(response)
                setQueryData({
                    Title:'',
                    Description: '',
                })
                setIsAdding(false)
            }
        }
        catch (err) {
            ErrorToaster("Something Went Wrong")
        }
        finally {
            fetchProjects()
            setBtnLoading(false)
        }
    }

    const responseById = async (id) => {
        try {
            const response = await Axios.get(`usermanagement/viewquerybyid/${id}`);
            console.log("resp-> ", response)
            setQueryResponse(response.data)
            setViewResponse(true)
        } catch (error) {
            ErrorToaster(error.response.data)
        }

    }

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`studentmanagement/viewqueries/${userId}`);
            console.log(response.data);
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = queries?.filter(project => {
        const values = Object?.values(project)?.map(value => String(value)?.toLowerCase());
        return values?.some(value => value?.includes(searchQuery?.toLowerCase()));
    });

    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        <h2>List Of Queries</h2>
                    </div>
                    <div>
                        <div className="prevProjectMain Adminquery">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ width: "25%" }}>
                                <input type="text" placeholder="Search by query..."
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <br />
                            </div>
                            <div>
                                <button style={{ marginRight: "10px" }} onClick={() => setIsAdding(true)}>Add Query</button>
                            </div>
                            </div>
                            {
                                loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></div>) :(
                            <div className="table-responsive">
                                <table className="minimalist-table">
                                    <thead>
                                        <tr>
                                        <th>Query Number</th> 
                                            <th>Query Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { currentProjects?.map(project => (
                                            <tr key={project.count}>
                                                <td>{project.count}</td>
                                                <td>{project.title}</td>
                                                <td>{project.description}</td>
                                                <td>{project.status}</td>
                                                <td>
                                                    <button onClick={() => responseById(project.id)}>View Response</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ width: "50%", display: "flex", justifyContent: "flex-end", paddingTop: "16px" }}>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>)}
                        </div>
                    </div>
                </div>
                {isAdding && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => { setIsAdding(false); }}>&times;</span>
                            <h6>Add Query</h6>
                            <input type="text" placeholder="Title" name="Title" value={queryData.Title} onChange={(e) => handleQueryChange(e)} />
                            <textarea type="text" className="form-control" name="Description" value={queryData.Description} onChange={(e) => handleQueryChange(e)} placeholder="Enter query description" rows="4" cols="50" />
                            {queryErr && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{queryErr}</div>}
                            {/*<button onClick={submitQuery}>Submit Query</button>*/}
                            <button onClick={submitQuery}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Query Submitting...' : 'Submit Query'}
                            </button>
                        </div>
                    </div>
                )}
                {viewResponse && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => { setViewResponse(false); }}>&times;</span>
                            <h5 style={{ fontWeight: 'bold' }}>Query Details</h5>
                            <label style={{ fontWeight: 'bold' }}>Title</label>
                            <p style={{ textAlign: 'left' }}>{queryResponse[0].title}</p>
                            <label style={{ fontWeight: 'bold' }}>Description</label>
                            <p style={{ textAlign: 'left' }}>{queryResponse[0].description}</p>
                            {queryResponse[0]?.status === "Responsed" ?
                                <Fragment>
                            <label style={{ fontWeight: 'bold' }}>Admin Response</label>
                            <p style={{ textAlign: 'left' }}>{queryResponse[0]?.response}</p>  
                                </Fragment> :
                                <Fragment>
                                    <label style={{ fontWeight: 'bold' }}>Status</label>
                                    <p style={{ textAlign: 'left' }}>{queryResponse[0]?.status}</p>
                                </Fragment>
                        }
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default StudentQueries;
