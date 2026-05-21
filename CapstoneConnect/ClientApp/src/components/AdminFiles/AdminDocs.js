import React from 'react'
import AdminSideBar from './AdminSideBar'
import NavBar from '../Layout/NavBar'
import DocumentList from '../DocumentList'
import MainSideBar from '../Layout/MainSideBar'



function AdminDocs() {
    return (
        <div>
            <NavBar />
            <MainSideBar />
            <div className='mainmargins'>
                <div className="AdminDocsMain">
                    <DocumentList />
                </div>
            </div>
        </div>
    )
}

export default AdminDocs
