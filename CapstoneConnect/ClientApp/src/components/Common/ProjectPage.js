import Axios from '../../axios';
import Layout from '../Layout/Layout';
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ErrorToaster } from '../Utils/Toast';

const ProjectPage = () => {
    const navigate = useNavigate();
    /*const { project } = location.state;*/
    const { projectId } = useParams();
    const [loading, setLoading] = useState([])
    const [project, setProject] = useState([])
    const [btnLoading, setBtnLoading] = useState(false)

    /*console.log(project);*/

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true)
                const response = await Axios.get(`usermanagement/projectrepositrybyid/${projectId}`);
                
                setProject(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchProjects();
    }, []);

    /*const handleDownloadProposal = () => {
        console.log('Downloading project proposal...');
    };*/

    const downloadFile = async (SubmissionId) => {
        try {
            setBtnLoading(true);
            const response = await Axios.post(`usermanagement/downloadfinalreport/${SubmissionId}`, {}, {
                responseType: 'arraybuffer'
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'downloaded_file';

                if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
                    const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (fileNameMatch != null && fileNameMatch[1]) {
                        fileName = fileNameMatch[1].replace(/['"]/g, '');
                    }
                }

                const contentType = response.headers['content-type'];
                let fileExtension = '';

                switch (contentType) {
                    case 'application/pdf':
                        fileExtension = '.pdf';
                        break;
                    case 'application/msword':
                        fileExtension = '.doc';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        fileExtension = '.docx';
                        break;
                    case 'application/vnd.ms-powerpoint':
                        fileExtension = '.ppt';
                        break;
                    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        fileExtension = '.pptx';
                        break;
                    default:
                        fileExtension = '';
                }

                if (!fileName.endsWith(fileExtension)) {
                    fileName += fileExtension;
                }

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                ErrorToaster("Download failed");
                console.error('File download failed:', response?.message);
            }
        } catch (error) {
            ErrorToaster(error?.response?.data);
            console.error('An error occurred', error);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <Layout>
            {/*<NavBar />
            <MainSideBar />*/}
            <div className='mainmargins'>
                <div className="project-page">
                    
                    {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%", paddingTop:"18px" }}>
                        <div className="spinner-border text-secondary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div></div> :
                        <div className="project-info">
                            <h2>Project Details</h2>
                            <p>
                                <strong>Project ID:</strong> {project.id}
                            </p>
                            <p>
                                <strong>Project Name:</strong> {project.title}
                            </p>
                            <p>
                                <strong>Description:</strong> {project.description ?? " --"}
                            </p>
                            <p>
                                <strong>Team Lead:</strong> {project.teamlead}
                            </p>
                            <p>
                                <strong>Team Members:</strong> {project?.members &&
                                    Object.entries(project.members).map(([member, grade]) => (
                                        member !== project.teamlead && (
                                        <span >
                                            {member+ ", "}
                                            </span>)
                                    ))
                                }
                            </p>
                            <p>
                                <strong>Supervisor:</strong> {project.supervisor}
                            </p>
                            <p>
                                <strong>Co-Supervisor:</strong> {project.coSupervisor}
                            </p>
                            <p>
                                <strong>Grade:</strong> {project?.members &&
                                    Object.entries(project.members).map(([member, grade]) => (
                                        <span >
                                            {member + "(" +grade+ ")" + "," }
                                        </span>
                                    ))
                                }
                            </p>
                        </div>
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button onClick={() => downloadFile(project.finalReportId)}
                            className={`statusDwn ${btnLoading ? 'disabled' : ''}`}
                            disabled={btnLoading}
                        >
                            {btnLoading ? 'Downloading...' : 'Download'}
                        </button>
                        <button onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </div>
        </Layout>

    );
};

export default ProjectPage;
