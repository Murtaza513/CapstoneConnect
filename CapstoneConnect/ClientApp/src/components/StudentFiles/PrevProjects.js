import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../Layout/Layout';
import Pagination from '../Utils/Pagination';
import Axios from '../../axios';
// import { useEffect } from "react";
function PrevProjects() {

    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const response = await Axios.get('usermanagement/projectrepositry');
                
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects?.filter(project => {
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
                        <h2>Project Repository</h2>
                    </div>
                    <div>
                        <div className="prevProjectMain">
                            <div style={{ width: "25%", paddingTop:"12px" }}>
                                <input type="text" className="form-control" placeholder="Search By Name..." value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                <br />
                            </div>
                            {
                                loading ? (<div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></div>) : (
                                <div className="table-responsive">
                                    <table class="minimalist-table">
                                        <thead>
                                            <tr>
                                                <th>Project Number</th>
                                                <th>Project Name</th>
                                                <th>Team Lead</th>
                                                <th>Supervisor</th>
                                                <th>Co Supervisor</th>
                                                {/*<th>Description</th>*/}
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProjects?.map(project => (
                                                <tr key={project.id}>
                                                    <td>{project.id}</td>
                                                    <td>{project.title}</td>
                                                    <td>{project.teamlead}</td>
                                                    <td>{project.supervisor}</td>
                                                    <td>{project.coSupervisor ?? "--"}</td>
                                                    {/*<td>{project.description}</td>*/}
                                                    <td>
                                                        <Link to={`/ProjectPage/${project.id}`} state={{ project }} className="view-link">
                                                            <button class="action-button">View</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{width:"50%", display:"flex", justifyContent:"flex-end", paddingTop:"16px"}}>
                                    <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    />
                                    </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PrevProjects
