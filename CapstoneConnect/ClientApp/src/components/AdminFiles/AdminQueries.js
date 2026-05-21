import React, { Fragment, useEffect, useState } from 'react';
import Layout from '../Layout/Layout'
import useAuth from '../../context/useAuth';
import Axios from '../../axios';
import Pagination from '../Utils/Pagination';
import { SuccessToaster } from '../Utils/Toast';
import { ErrorToaster } from '../Utils/Toaster';

function AdminQueries() {

    const { userId } = useAuth();
    const [btnLoading, setBtnLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [queries, setQueries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [queryErr, setQueryErr] = useState(null);
    const [queryResponse, setQueryResponse] = useState([]);
    const [viewQuery, setViewQuery] = useState({ queryId: '' });

    const [queryData, setQueryData] = useState({
        Status: 'Responsed',
        Response: '',
    });

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`admin/getallqueries`);
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        finally {
            setLoading(false)
        }
    };

    const responseById = async (id) => {
        try {
            const response = await Axios.get(`usermanagement/viewquerybyid/${id}`);
            if (response.status === 200) {
                setQueryResponse(response.data[0])
                setIsAdding(true)
                setViewQuery({
                    queryId: response.data[0].id,
                })
            }
        } catch (error) {
            ErrorToaster(error.response.data)
        }

    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const submitQuery = async (e) => {
        e.preventDefault()
        const data = {
            Id: viewQuery.queryId,
            Status: queryData.Status,
            Response: queryData.Response,
        }
        if (!queryData.Response) {
            setQueryErr("Add Response First")
            return
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post("usermanagement/updatequery", data)
            if (response.status === 200) {
                SuccessToaster(response.data.message)
                setQueryData({
                    Status: 'Responsed',
                    Response: '',
                })
                setViewQuery({queryId: ''})
                setIsAdding(false)
            }
        }
        catch (err) {
            ErrorToaster(err.response.data)
        }
        finally {
            fetchProjects()
            setBtnLoading(false)
        }
    }

    const handleQueryChange = (e) => {
        setQueryErr(null)
        setQueryData({
            ...queryData,
            [e.target.name]: e.target.value
        });
    };
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
                        <h2>Queries</h2>
                    </div>
                    <div>
                        <div className="prevProjectMain Adminquery">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ width: "18em" }}>
                                    <input type="text" placeholder="Search by query..."
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <br />
                                </div>
                            </div>
                            {
                                loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></div>) : (
                                    <div className="table-responsive">
                                        <table className="minimalist-table">
                                            <thead>
                                                <tr>
                                                    <th>Query Id</th>
                                                    <th>Query Name</th>
                                                    <th>Description</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProjects?.map(project => (
                                                    <tr key={project.id}>
                                                        <td>{project.id}</td>
                                                        <td>{project.title}</td>
                                                        <td>{project.description}</td>
                                                        <td>{project.status}</td>
                                                        <td style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                                                            <div style={{ paddingRight: "4px" }}>
                                                                <button style={{ backgroundColor: project.status === "Pending" ? "red" : "default" }}
                                                                    onClick={() => responseById(project.id)}>Response</button>
                                                            </div>
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
                            <h5 style={{ fontWeight: 'bold' }}>Query Details</h5>
                            <label style={{ fontWeight: 'bold' }}>Title</label>
                            <p style={{ textAlign: 'left' }}>{queryResponse.title}</p>
                            <label style={{ fontWeight: 'bold' }}>Description</label>
                            <p style={{ textAlign: 'left' }}>{queryResponse.description}</p>
                            {queryResponse?.status === "Responsed" &&
                                <Fragment>
                                    <label style={{ fontWeight: 'bold' }}>Response</label>
                                    <p style={{ textAlign: 'left' }}>{queryResponse?.response}</p>
                                </Fragment>}
                            <h5>Add Query Response</h5>
                            <textarea type="text" className="form-control" name="Response" value={queryData.Response} onChange={(e) => handleQueryChange(e)} placeholder="Enter query response" rows="4" cols="50" />
                                
                            {queryErr && <div className="error-message" style={{ color: 'red', marginBottom: '8px', fontSize: "13px" }}>{queryErr}</div>}
                            <button
                                type="button"
                                onClick={submitQuery}
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Submitting...' : 'Submit Response'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default AdminQueries
