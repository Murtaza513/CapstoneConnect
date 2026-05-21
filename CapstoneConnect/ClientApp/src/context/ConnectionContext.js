import React, { createContext, useContext, useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from '../../../../node_modules/axios/index';
import { CONNECT_URL } from '../components/Utils/Config';

const ConnectionContext = createContext();

export const useConnection = () => useContext(ConnectionContext);

export const ConnectionProvider = ({ userId, role, children }) => {

    const [connection, setConnection] = useState(null);

    /*for notification logic*/

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${CONNECT_URL}/capstoneconnectnotifications?userId=${userId}${role ? `&group=${role}` : ''}`)
            .withAutomaticReconnect()
            .build();
        console.log("-------------------------> connection call-----------------------------> ", userId, role)
        connection.on("ReceiveNotification", (notification) => {
            setNotifications(notifications => [notification, ...notifications]);
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

        const fetchChats = async () => {
            try {
                const response = await axios.get(`${CONNECT_URL}/Chat/FetchAllChats/${userId}`);
                const userConversationId = response.data?.map(chat => chat.chatId);
                const groupQuery = userConversationId.join(',');
                const msgConnection = new HubConnectionBuilder()
                    .withUrl(`${CONNECT_URL}/capstoneconnectchat?userId=${userId}&groups=${groupQuery}`)
                    .withAutomaticReconnect()
                    .build();
                setConnection(msgConnection)
                console.log("------------------------->Message connection call-----------------------------> ", userId, groupQuery)
                
                msgConnection.start()
                    .then(() => {
                        console.log("SignalR Message connection established.");
                    })
                    .catch(err => {
                        console.error("Failed to start SignalR connection:", err.toString());
                    });

            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats()

        return () => {
            if (connection) {
                connection.stop();
                console.log("-------------------------> connection stopl-----------------------------> ")
            }
        };
    }, [userId, role]);
    return (
        <ConnectionContext.Provider value={{ notifications, unreadCount, hasNewNotification, setNotifications, setUnreadCount, setHasNewNotification, connection }}>
            {children}
        </ConnectionContext.Provider>
    );
};
