import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Pagination from '../Utils/Pagination';
import Axios from '../../axios';
// Import a custom ProgressBar component if needed

const OnGoingProjects = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState([]);
    const [projectStatus, setProjectStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [btnLoading, setBtnLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const response = await Axios.get('admin/ongoingprojects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false)
            }
        };

        fetchProjects();
    }, []);

    const modelFunction = async () => {
        console.log("ModelTrain")
        try {
            const response = await axios.post("http://127.0.0.1:5000/train_model")
            console.log(response)
        }
        catch (error) {
            console.log("error",error)
        }
    }

    const handleFilterChange = (e) => {
        setProjectStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredProjects = projects?.filter(project => {
        return (projectStatus ? project.status === projectStatus : true) &&
            Object.values(project).some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase()));
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
                        <h2>OnGoing Projects</h2>
                    </div>
                    <div>
                        <div className="prevProjectMain">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", paddingBottom: "26px" }}>
                                <div style={{ width: "18em" }}>
                                <input type="text" placeholder="Search by project name..."
                                    value={searchQuery} onChange={handleSearchChange}/>
                                </div>
                                <div />
                                <div style={{ display: "flex" }}>
                                <div style={{marginRight:"1em"}}>
                                        <button onClick={() => modelFunction()}>Train Model</button>
                                </div>
                                <div style={{ width: "10em" }}>
                                    <select className="form-control custom-select" value={projectStatus} onChange={ handleFilterChange } style={{ marginRight: '8px', marginBottom: '8px' }}>
                                    <option value="" disabled>Select Status</option>
                                    <option value="Abstract">Abstract</option>
                                    <option value="Fyp1">Fyp 1</option>
                                    <option value="Fyp2">Fyp 2</option>
                                    <option value="ReEvaluate">ReEvaluate</option>
                                    <option value="Complete">Complete</option>
                                </select>
                            </div>
                            </div>
                            </div>
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                    <div className="spinner-border text-secondary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div></div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="minimalist-table">
                                        <thead>
                                            <tr>
                                                <th>Project Number</th>
                                                <th>Title</th>
                                                <th>Supervisor</th>
                                                <th>Co-Supervisor</th>
                                                <th>Status</th>
                                                <th>Progress</th>
                                                <th>View</th>
                                            </tr>
                                        </thead>
                                            <tbody>
                                                {currentProjects?.map(project => (
                                                        <tr key={project.id}>
                                                            <td>{project.id}</td>
                                                            <td>{project.title}</td>
                                                            <td>{project.supervisor}</td>
                                                            <td>{project.coSupervisor}</td>
                                                            <td>{project.status}</td>
                                                            <td>
                                                            <div className="progress-bar-container-row">
                                                                    {/* Replace project.progress with actual progress value */}
                                                                    <div className="progress-bar" style={{ width: `${project.progress ?? 0}%` }}>{project.progress ?? 0}</div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Link to={`/OnGoingProjectDetails/${project.id}`} state={{ project }} className="view-link">
                                                                    <button class="action-button">View</button>
                                                                </Link>
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
                                </div>
                            )}
                        </div>
                

                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default OnGoingProjects;
