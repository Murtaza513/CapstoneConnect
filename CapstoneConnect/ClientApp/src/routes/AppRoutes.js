
//import LoginPage from "../components/LoginPage";
import PrevProjects from "../components/StudentFiles/PrevProjects";
import Proposals from "../components/StudentFiles/Proposals";
import StudentDashboard from "../components/StudentFiles/StudentDashboard";
import SubmitProposal from "../components/StudentFiles/SubmitProposal";
import Supervisors from "../components/SupervisorFiles/Supervisors";
import ProjectPage from "../components/Common/ProjectPage";
import SupervisorDashboard from "../components/SupervisorFiles/SupervisorDashboard";
import ProjectInner from "../components/SupervisorFiles/ProjectInner";
import AdminCalender from "../components/AdminFiles/AdminCalender";
import AdminQueries from "../components/AdminFiles/AdminQueries";
import QueryResponse from "../components/AdminFiles/QueryResponse";
import SupSideBar from "../components/SupervisorFiles/SupSideBar";
import SupPrevProj from "../components/SupervisorFiles/SupPrevProj";
import AdminSideBar from "../components/AdminFiles/AdminSideBar";
//import SignUpPage from "../components/SignUpPage";
import AdminRegistration from "../components/AdminFiles/AdminRegistration";
import RegData from "../components/AdminFiles/RegData";
import FypRegistrationForm from "../components/Auth/FypRegistrationForm";
import AdminSup from "../components/SupervisorFiles/AdminSup";
import SupervisorDetails from "../components/AdminFiles/SupervisorDetails";
import OnGoingProjects from "../components/AdminFiles/OnGoingProjects";
import OnGoingProjectDetails from "../components/AdminFiles/OnGoingProjectDetails";
import PageNotFound from "../components/Common/PageNotFound";
import { Navigate } from 'react-router-dom';
import ProposalsList from "../components/StudentFiles/ProposalsList";
import FypGuidLines from "../components/AdminFiles/FypGuidLines";
import SubmittedDocs from "../components/SupervisorFiles/SubmittedDocs";
import TaskDetails from "../components/Common/TaskDetails";
import Chat from "../components/Chat/Chat";
import UserProfile from "../components/Common/UserProfile";
import MomList from "../components/StudentFiles/MomList";
import MomDetails from "../components/StudentFiles/MomDetails";
import StudentQueries from "../components/StudentFiles/StudentQueries";


export const AdminRoutes = [
    { path: '/AdminCalender', element: <AdminCalender /> },
    { path: '/AdminSup', element: <AdminSup /> },
    { path: '/AdminQueries', element: <AdminQueries /> },
    { path: '/supervisor/:id', element: <SupervisorDetails /> },
    { path: '/QueryResponse', element: <QueryResponse /> },
    { path: '/AdminSideBar', element: <AdminSideBar /> },
    { path: '/FypGuidline', element: <FypGuidLines/> },
    { path: '/AdminRegistration', element: <AdminRegistration /> },
    { path: '/OnGoingProjects', element: <OnGoingProjects /> },
    { path: '/OnGoingProjectDetails/:projectId', element: <OnGoingProjectDetails /> },
    { path: '/PrevProjects', element: <PrevProjects /> },
    { path: '/ProjectPage/:projectId', element: <ProjectPage /> },
    { path: '/SubmitDocs', element: <SubmittedDocs /> },
    { path: '/UserProfile', element: <UserProfile /> },
    { path: '/Chat', element: <Chat /> },
    { path: "*", element: <Navigate to="/404" /> },
    {path: "/404", element: <PageNotFound />},
];

export const SupervisorRoutes = [
    { path: '/SupervisorDashboard', element: <SupervisorDashboard /> },
    { path: '/AdminSup', element: <AdminSup /> },
    /*{ path: '/supervisors',element: <Supervisors />},*/
    { path: '/supervisor/:id', element: <SupervisorDetails /> },
    { path: '/OnGoingProjects', element: <OnGoingProjects /> },
    { path: '/OnGoingProjectDetails/:projectId', element: <OnGoingProjectDetails /> },
    { path: '/SupCal', element: <AdminCalender /> },
    { path: '/ProjectInner', element: <ProjectInner /> },
    { path: '/view-task-details/:taskId', element: <TaskDetails /> },
    { path: '/Proposals', element: <Proposals /> },
    { path: '/PrevProjects', element: <PrevProjects /> },
    { path: '/ProjectPage/:projectId', element: <ProjectPage /> },
    { path: '/FypGuidline', element: <FypGuidLines /> },
    { path: '/SubmitDocs', element: <SubmittedDocs /> },
    { path: '/Chat', element: <Chat /> },
    { path: '/UserProfile', element: <UserProfile /> },
    { path: "*", element: <Navigate to="/404" /> },
    { path: "/404", element: <PageNotFound /> },
];

export const StudentRoutes = [
    { path: '/calendar', element: <AdminCalender /> },
    { path: '/StudentDashboard', element: <StudentDashboard /> },
    { path: '/view-task-details/:taskId', element: <TaskDetails /> },
    { path: '/AdminSup', element: <AdminSup /> },
    { path: '/supervisor/:id', element: <SupervisorDetails /> },
    { path: '/PrevProjects', element: <PrevProjects /> },
    { path: '/ProposalsList', element: <ProposalsList /> },
    { path: '/ProjectPage/:projectId', element: <ProjectPage /> },
    { path: '/FypGuidline', element: <FypGuidLines /> },
    { path: '/MomList', element: <MomList /> },
    { path: '/momDetail/:projectId', element: <MomDetails /> },
    { path: '/StudentQueries', element: <StudentQueries /> },
    { path: '/Chat', element: <Chat /> },
    { path: '/UserProfile', element: <UserProfile /> },
    { path: "*", element: <Navigate to="/404" /> },
    { path: "/404", element: <PageNotFound /> },
];

/*export const AppRoutes = [
  //  {
       // index: true,
        //element: <LoginPage />
    //},
    {
        path: '/calendar',
        element: <AdminCalender />
    },
    { path: '/ProposalsList', element: <ProposalsList /> },
    {
        path: '/supervisors',
        element: <Supervisors />
    },
    {
        path: '/StudentDashboard',
        element: <StudentDashboard />
    },
    {
        path: '/PrevProjects',
        element: <PrevProjects />
    },
    {
        path: '/SubmitProposal',
        element: <SubmitProposal />
    },
    {
        path: '/Proposals',
        element: <Proposals />
    },
    {
        path: '/ProjectPage/:projectId',
        element: <ProjectPage />
    },
    {
        path: '/SupervisorDashboard',
        element: <SupervisorDashboard />
    },
    {
        path: '/ProjectInner',
        element: <ProjectInner />
    },
    {
        path: '/AdminCalender',
        element: <AdminCalender />
    },
    {
        path: '/AdminQueries',
        element: <AdminQueries />
    },
    {
        path: '/QueryResponse',
        element: <QueryResponse />
    },
    {
        path: '/AdminDocs',
        element: <AdminDocs />
    }, {
        path: '/SupSideBar',
        element: <SupSideBar />
    },
    {
        path: '/SupCal',
        element: <SupCal />
    },
    {
        path: '/SupPrevProj',
        element: <SupPrevProj />
    },
    {
        path: '/AdminSideBar',
        element: <AdminSideBar />
    },
    //{
      //  path: '/SignUpPage',
       // element: <SignUpPage />
    //},
    {
        path: '/AdminRegistration',
        element: <AdminRegistration />
    },
    {
        path: '/RegData',
        element: <RegData />
    }, {
        path: '/FypRegistrationForm',
        element: <FypRegistrationForm />
    }, {
        path: '/AdminSup',
        element: <AdminSup />
    }, {
        path: '/supervisor/:id',
        element: <SupervisorDetails />
    }, {
        path: '/OnGoingProjects',
        element: <OnGoingProjects/>
    },
    {
        path: '/OnGoingProjectDetails/:projectId',
        element: <OnGoingProjectDetails />
    },
];*/

//export default AppRoutes;
