
import React, { useEffect, useRef, useState } from 'react';
import '../Layout/Header.css';
import logo from '../assets/logo.png';
import n_logo from '../assets/Logon.png';
import Notificaton from '../assets/Group 39889.png';
import userIcon from '../assets/user profile.png';
import moment from "moment";
import {useNavigate } from "react-router-dom"
import { useConnection } from '../../context/ConnectionContext';
import { BASE_URL, CONNECT_URL } from '../Utils/Config';
import axios from '../../../../../node_modules/axios/index';

const Header = ({ toggleSidebar, sidebarOpen }) => {
    
    const navigate = useNavigate()
    const { notifications, unreadCount, setHasNewNotification, setUnreadCount, setNotifications } = useConnection();
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const notificationRef = useRef(null);
    
    const toggleNotificationDropdown = async () => {
        setIsNotificationDropdownOpen(!isNotificationDropdownOpen);

        if (!isNotificationDropdownOpen) {
            const unreadNotifications = notifications.filter(notification => !notification.isRead);
            const unreadIds = unreadNotifications.map(notification => notification.id);

            console.log("Unread" + unreadIds);

            if (unreadIds.length > 0) {
                try {
                    await axios.post(`${CONNECT_URL}/notifications/MarkAsRead`, unreadIds);

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
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${CONNECT_URL}/notifications/FetchNotifications/${userId}`);
                setNotifications(response.data);
                console.log(response.data);
                setUnreadCount(response.data.filter(n => !n.isRead).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
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
        <header className="header">
            <div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
                <span className="header__hamburger" onClick={toggleSidebar}>
                    <i class="fa-solid fa-circle-chevron-right"></i>
                </span>
                <div className="header__logo"><a href="#" className="logo"><img src={n_logo} alt="Logo" /></a></div>
            </div>
            <div className="header__right">
                <span className="header__icon"><li onClick={()=>navigate('/Chat')} className="nav-item notification-dropdown"><i className="fas fa-comments"></i></li></span>
                <span className="header__icon">
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
                                <li className="menu-header">
                                    <strong>Notifications</strong>
                                </li>
                                {notifications.map((notification) => (
                                    <li key={notification.id} id={`notification-${notification.id}`} className="menu-item">
                                        <div className="menu-item-content">
                                            <div className="menu-item-text">
                                                <strong className="item-title">{notification.title}</strong>
                                                <p className="item-content">{notification.details}</p>
                                                <div className="menu-item-datetime">
                                                    <small className="menu-item-date">
                                                        {moment(notification.createdAt).format('YYYY-MM-DD')}
                                                    </small>
                                                    <small className="menu-item-time">
                                                        {moment(notification.createdAt).format('HH:mm:ss')}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </span>
                <span className="header__iconRight">
                    <li onClick={() => navigate('/UserProfile')} className="nav-item dropdown">
                        <img src={userIcon} alt="User" className="user-icon" data-dropdown />
                    </li>   
                </span>
            </div>
        </header>
    );
};

export default Header;
