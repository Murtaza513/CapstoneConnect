import React from 'react'
//import MainSideBar from './MainSideBar'
import NavBar from '../Layout/NavBar'
import { Link } from 'react-router-dom'
import SupSideBar from './SupSideBar'
import MainSideBar from '../Layout/MainSideBar'
// import { useEffect } from "react";



function SupPrevProj() {

    // useEffect(() => {
    //     const handleSearch = () => {
    //         var value = document.getElementById('search').value.toLowerCase();
    //         var table = document.getElementById('table');

    //         if (table) {
    //             var rows = table.getElementsByTagName('tr');

    //             for (var i = 0; i < rows.length; i++) {
    //                 var textValue = rows[i].textContent || rows[i].innerText;
    //                 var shouldShow = textValue.toLowerCase().indexOf(value) > -1;
    //                 rows[i].style.display = shouldShow ? '' : 'none';
    //             }
    //         }
    //     };

    //     // Check if the elements are present before adding the event listener
    //     const searchInput = document.getElementById('search');
    //     if (searchInput) {
    //         searchInput.addEventListener('keyup', handleSearch);
    //     }

    //     // Clean up the event listener when the component unmounts
    //     return () => {
    //         if (searchInput) {
    //             searchInput.removeEventListener('keyup', handleSearch);
    //         }
    //     };
    // }, []);

    return (
        <div >
            <NavBar />
            <MainSideBar />
            <div className='mainmargins'>
                <div className="container">
                    <div className="row">
                        <div className="prevProjectMain">
                            <input id="search" type="text" class="form-control" placeholder="Search By Project or Member Name ,......" />
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>PROJECT  NUMBER</th>
                                        <th>PROJECT NAME</th>
                                        <th>TEAM LEAD</th>
                                        <th>SUPERVISIOR</th>
                                        <th>DESCRIPTION</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>001</td>
                                        <td>Project Alpha</td>
                                        <td>John Doe</td>
                                        <td>Jane Supervisor</td>
                                        <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
                                        <td><Link to='/ProjectPage'><button>View</button></Link></td> 
                                    </tr>
                                    <tr>
                                        <td>002</td>
                                        <td>Project Beta</td>
                                        <td>Alice Smith</td>
                                        <td>Bob Manager</td>
                                        <td>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>003</td>
                                        <td>Project Gamma</td>
                                        <td>Charlie Brown</td>
                                        <td>Eve Director</td>
                                        <td>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</td>
                                        <td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>004</td>
                                        <td>Project Delta</td>
                                        <td>Emily Johnson</td>
                                        <td>David Head</td>
                                        <td>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>005</td>
                                        <td>Project Epsilon</td>
                                        <td>Michael Green</td>
                                        <td>Susan Manager</td>
                                        <td>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>006</td>
                                        <td>Project Zeta</td>
                                        <td>Olivia White</td>
                                        <td>Chris Supervisor</td>
                                        <td>Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>007</td>
                                        <td>Project Eta</td>
                                        <td>James Black</td>
                                        <td>Emma Director</td>
                                        <td>Enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>008</td>
                                        <td>Project Theta</td>
                                        <td>Sophia Brown</td>
                                        <td>Liam Manager</td>
                                        <td>Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>009</td>
                                        <td>Project Iota</td>
                                        <td>Logan Grey</td>
                                        <td>Abigail Head</td>
                                        <td>Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                    <tr>
                                        <td>010</td>
                                        <td>Project Kappa</td>
                                        <td>Ava Johnson</td>
                                        <td>Noah Supervisor</td>
                                        <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</td><td><Link to='/ProjectPage'><button>View</button></Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SupPrevProj
