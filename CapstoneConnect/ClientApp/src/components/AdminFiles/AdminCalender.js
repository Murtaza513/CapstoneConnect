import React, { useState, useEffect } from 'react';
import useAuth from '../../context/useAuth';
import Layout from '../Layout/Layout';
import Axios from '../../axios'
import { SuccessToaster } from '../Utils/Toast';
import { ErrorToaster } from '../Utils/Toaster';
function AdminCalender() {
    const [events, setEvents] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '' });
    const [error, setError] = useState(null);
    const { role } = useAuth()

    const fetchCalender = async () => {
        Axios.get('UserManagement/Calendar')
            .then(response => {
                const data = response.data;
                const transformedData = Object.keys(data).map(section => ({
                    id: section,
                    title: section + " Semester",
                    dates: data[section].map(calendar => ({
                        id: calendar.id,
                        title: calendar.title,
                        date: calendar.deadline.toString().split('T')[0],
                        isEditing: false
                    }))
                }));
                setEvents(transformedData);
            })
            .catch(error => {
                console.error('Error fetching calendar data:', error);
            });
    }
    useEffect(() => {
        fetchCalender()
    }, []);

    const handleAddEvent = (groupId) => {
        setNewEvent({
            title: '',
            date: '',
            section: groupId
        });
        setIsAdding(true); 
    };

    const handleEditEvent = (groupId, eventId) => {
        setEvents(prevEvents => {
            return prevEvents.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        dates: group.dates.map(date => {
                            if (date.id === eventId) {
                                return {
                                    ...date,
                                    isEditing: true
                                };
                            }
                            return date;
                        })
                    };
                }
                return group;
            });
        });
    };

    const handleUpdateEvent = async (groupId, eventId, Title, Deadline) => {
        
        try {
            const response = await Axios.put(`Admin/UpdateCalendar/${eventId}`, {
                Id: eventId,
                Title: Title,
                Deadline: Deadline
            });
            if (response.status === 200) {
                setEvents(prevEvents => {
                    return prevEvents.map(group => {
                        if (group.id === groupId) {
                            return {
                                ...group,
                                dates: group.dates.map(date => {
                                    if (date.id === eventId) {
                                        return {
                                            ...date,
                                            title: Title,
                                            date: Deadline,
                                            isEditing: false
                                        };
                                    }
                                    return date;
                                })
                            };
                        }
                        return group;
                    });
                });
                SuccessToaster("Event updated successfully")
                console.log("Event updated successfully");
                fetchCalender()
            }
        } catch (error) {
            console.error(error);
            ErrorToaster(error.response.data.title)
        }
    };

    const handleCancelEdit = (groupId, eventId) => {
        setEvents(prevEvents => {
            return prevEvents.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        dates: group.dates.map(date => {
                            if (date.id === eventId) {
                                return {
                                    ...date,
                                    isEditing: false
                                };
                            }
                            return date;
                        })
                    };
                }
                return group;
            });
        });
    };

    const handleDeleteEvent = async (id) => {
        try {
            const response = await Axios.delete(`Admin/DeleteCalendar/${id}`);
            if (response.status === 200) {
                setEvents(prevEvents => {
                    return prevEvents.map(group => {
                        return {
                            ...group,
                            dates: group.dates.filter(date => date.id !== id)
                        };
                    });
                });
                SuccessToaster("Deadline deleted successfully")
                console.log("Deadline deleted successfully");
                fetchCalender()
            } else {
                console.log("Failed to delete deadline");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) {
            setError('Please fill all fields');
            return;
        }
        try {
            setBtnLoading(true)
            const response = await Axios.post('Admin/AddCalendar', {
                title: newEvent.title,
                description: "",
                section: newEvent.section,
                deadline: newEvent.date
            });
            if (response.status === 201) {
                const newEventDetails = {
                    id: response.data.id,
                    title: newEvent.title,
                    date: newEvent.date,
                    isEditing: false
                };
                setEvents(prevEvents => {
                    return prevEvents.map(group => {
                        if (group.id === newEvent.section) {
                            return {
                                ...group,
                                dates: [...group.dates, newEventDetails]
                            };
                        }
                        return group;
                    });
                });
                console.log("Event added successfully");
                SuccessToaster("Event added successfully");
                setIsAdding(false);
                fetchCalender()
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error(error);
        }
        finally {
            setBtnLoading(true)
        }
    };

    const handleChange = (e, groupId, eventId) => {
        const { name, value } = e.target;

        setEvents(prevEvents => {
            return prevEvents.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        dates: group.dates.map(date => {
                            if (date.id === eventId) {
                                return {
                                    ...date,
                                    [name]: value
                                };
                            }
                            return date;
                        })
                    };
                }
                return group;
            });
        });
    };


    return (
        <Layout>
        
            {/*<NavBar />
            <MainSideBar/>*/}
            <div className="calenderMain AdmCal">
                <div className="container">
                    <h2>FYP Calendar</h2>
                    <div className="innersection">
                        {events.map(group => (
                            <div key={group.id} className="sec1">
                                {role === "Admin" && 
                                <button className='addmore' onClick={() => handleAddEvent(group.id)}>Add New</button>
                                }
                                <h3>{group.title}</h3>
                                <ul>
                                    {group.dates.map(date => (
                                        <li key={date.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '15px 30px' }}>
                                            <div>
                                                <h5>Date:</h5>
                                                {date.isEditing ? (
                                                    <input name="date" type="date" value={date.date} onChange={(e) => handleChange(e, group.id, date.id)} />
                                                ) : (
                                                    <span>{date.date}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h5>Name:</h5>
                                                {date.isEditing ? (
                                                    <input name="title" type="text" value={date.title} onChange={(e) => handleChange(e, group.id, date.id)} />
                                                ) : (
                                                    <span>{date.title}</span>
                                                )}
                                            </div>
                                            {role === "Admin" && 
                                            <div>
                                                {date.isEditing ? (
                                                    <>
                                                        <button onClick={() => handleUpdateEvent(group.id, date.id, date.title, date.date)}>Save</button>
                                                        <button onClick={() => handleCancelEdit(group.id, date.id)}>Cancel</button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => handleEditEvent(group.id, date.id)}>Edit</button>
                                                )}
                                                <button onClick={() => handleDeleteEvent(date.id)}>Delete</button>
                                                </div>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Add Event Modal */}
            {isAdding && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { setIsAdding(false); setError(null) }}>&times;</span>
                        <h2>Add New Event</h2>
                        <form onSubmit={handleSaveEvent}>
                            <label>Title:</label>
                            <input type="text" name="title" value={newEvent.title} onChange={(e) => { setNewEvent({ ...newEvent, title: e.target.value }); setError(null) }} />
                            <label>Date:</label>
                            <input type="date" name="date" value={newEvent.date} onChange={(e) => { setNewEvent({ ...newEvent, date: e.target.value }); setError(null) }}/>
                            {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                            {/*<button type="submit">Add Event</button>*/}
                            <button type="submit"
                                className={`addSupervisorButton ${btnLoading ? 'disabled' : ''}`}
                                disabled={btnLoading}
                            >
                                {btnLoading ? 'Event Adding...' : 'Add Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
        </Layout>
    );
}

export default AdminCalender;
