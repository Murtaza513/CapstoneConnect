import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Notificaton from '../assets/Group 39889.png';
import axios from 'axios';
import userIcon from '../assets/user profile.png';
function NavBar() {

    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [error, setError] = useState(null);

    const toggleNotificationDropdown = async () => {
        setIsNotificationDropdownOpen(!isNotificationDropdownOpen);

        if (!isNotificationDropdownOpen) {
            const unreadNotifications = notifications.filter(notification => !notification.isRead);
            const unreadIds = unreadNotifications.map(notification => notification.id);

            console.log("Unread"+unreadIds);

            if (unreadIds.length > 0) {
                try {
                    await axios.post('https://localhost:7025/notifications/MarkAsRead', unreadIds);

                    // Mark the notifications as read in the local state
                    setNotifications(prevNotifications =>
                        prevNotifications.map(notification =>
                            unreadIds.includes(notification.id)
                                ? { ...notification, isRead: true }
                                : notification
                        )
                    );

                    markAllAsRead();
                } catch (error) {
                    console.error('Error marking notifications as read:', error);
                }
            }
        }
        markAllAsRead()
    };

    const handleClickOutside = (event) => {
        if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setIsNotificationDropdownOpen(false);
        }
    };

   

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userRole = localStorage.getItem("role");

        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`https://localhost:7025/notifications/FetchNotifications/${userId}`);
                setNotifications(response.data);
                console.log(response.data);
                setUnreadCount(response.data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const connection = new HubConnectionBuilder()
            .withUrl(`https://localhost:7025/capstoneconnectnotifications?userId=${userId}${userRole ? `&group=${userRole}` : ''}`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveNotification", (notification) => {
            
            setNotifications(notifications => [...notifications, notification]);
            
            setUnreadCount(count => count + 1);
            setHasNewNotification(true);
        });

        connection.start()
            .then(() => {
                
                console.log("SignalR connection established.");
            })
            .catch(err => {
                console.error("Failed to start SignalR connection:", err.toString());
            });

        return () => {
            connection.stop();
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const markAllAsRead = () => {
        setUnreadCount(0);
        setHasNewNotification(false);
    };

    return (
        <div className="header">
            <nav className="navbar">
                <a href="#" className="logo"><img src={logo} alt="Logo" /></a>
                <ul className="nav-items">
                    <li className="nav-item notification-dropdown" ref={notificationRef}>
                        <img
                            src={Notificaton}
                            alt="Notification"
                            className="notification-icon"
                            data-dropdown
                            onClick={toggleNotificationDropdown}
                        />
                        <span className="notification-count">{unreadCount > 0 ? unreadCount : 0}</span>
                        {isNotificationDropdownOpen && (
                            <ul className="dropdown-menu">
                                {notifications.map((notification) => (
                                    <li key={notification.id} id={`notification-${notification.id}`}>
                                        <div>
                                            <strong>{notification.title}</strong>
                                            <p>{notification.details}</p>
                                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                    <li className="nav-item dropdown">
                        <img src={userIcon} alt="User" className="user-icon" data-dropdown />
                        <ul className="dropdown-menu">
                            <li><a href="#">Profile</a></li>
                            <li><a href="#">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default NavBar;
