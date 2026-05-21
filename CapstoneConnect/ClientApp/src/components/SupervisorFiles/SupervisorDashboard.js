import React, { useEffect, useState } from 'react'
//import MainSideBar from './MainSideBar'
import NavBar from '../Layout/NavBar'
import BannerImg from '../assets/review_placeholder.png'
import ProjectCard from '../SupervisorFiles/ProjectCard';
import SupSideBar from './SupSideBar';
import MainSideBar from '../Layout/MainSideBar';
import useAuth from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import Axios from '../../axios';
import Layout from '../Layout/Layout';


function SupervisorDashboard() {
    const { title, userId } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [projects, setProjects] = useState([])
    console.log("projects-> ", projects)
    const getProjects = async () => {
        try {
            setLoading(true)
            const response = await Axios.get(`supervisor/supervisorprojects/${userId}`)
            if (response.status === 200) {
                setProjects(response.data)
            }
        }
        catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])
    return (
        <Layout>
            {/*<NavBar />*/}
            {/*<SupSideBar />*/}
            {/*<MainSideBar/>*/}
            <div className='mainmargins'>
                <div className="supDashMain">
                    <div className="headingContainer">
                        {loading ? <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <div className="spinner-border text-secondary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div></div> :
                            <div className="row">
                                <div className="banner">
                                    <div className="bannertxt">
                                        <h2>Welcome back, {title?.replace(/([A-Z])/g, ' $1').trim()}</h2>
                                        <h5>Always stay updated in your portal</h5>
                                    </div>
                                    {/*<div className="bannerimg">
                                    <img src={BannerImg} alt="BannerHeroImg" />
                                </div>*/}

                                </div>
                            </div>}
                        <div style={{ paddingTop: "30px", paddingBottom: "20px" }}>
                            <h2>Projects Overview</h2>
                        </div>
                        <div className="row">
                            {projects.map((project, index) => (
                                <div className="col-md-6" style={{ paddingBottom: "8px" }}>
                                    <ProjectCard
                                        index={index}
                                        fypId={project.fypId}
                                        projectName={project.title}
                                        projectLead={project.teamLead}
                                        memeberName={project.memberNames}
                                        description={project.projectDescription}
                                        progress={project.progress}
                                        status={project.status}
                                        getProjects={() => getProjects()}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>                
            </div>
        </Layout>

    )
}

export default SupervisorDashboard
