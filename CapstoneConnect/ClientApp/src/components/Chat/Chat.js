import React, { useEffect, useState } from 'react';
import ChannelList from './ChannelList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './chatStyles.css';
import Layout from '../Layout/Layout';
import useAuth from '../../context/useAuth';
import { useConnection } from '../../context/ConnectionContext';
import { CONNECT_URL } from '../Utils/Config';
import axios from '../../../../../node_modules/axios/index';

const Chat = () => {
    const { userId } = useAuth();
    const { connection } = useConnection();
    
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    const currentUser = userId;

    const handleSendMessage = async (text) => {
        if (selectedChannel) {
            const messagePayload = {
                conversationId: selectedChannel.chatId,
                senderId: currentUser,
                recieverId: selectedChannel.participant.userId.trim(),
                messageContent: text
            };
            try {
                await axios.post(`${CONNECT_URL}/Chat/SendMessage`, messagePayload);
                /*setChatMessages(prevMessages => [...prevMessages, messagePayload]);*/
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const fetchChats = async () => {
        try {
            const response = await axios.get(`${CONNECT_URL}/Chat/FetchAllChats/${userId}`);
            const transformedChannels = response.data.map(channel => ({
                ...channel,
                participant: channel.participants[0]
            }));
            setChannels(transformedChannels);
            if (transformedChannels.length) {
                setSelectedChannel(transformedChannels[0]);
                fetchMessages(transformedChannels[0].chatId);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`${CONNECT_URL}/Chat/FetchChatMessages/${chatId}/${userId}`);
            setChatMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChannel) {
            fetchMessages(selectedChannel.chatId);
        }
    }, [selectedChannel]);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (message) => {
                setChatMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                connection.off("ReceiveMessage");
            };
        }
    }, [connection]);

    return (
        <Layout>
            <div className='mainmargins'>
                <div className="headingContainer">
                    <div className="row">
                        <h2>Messages</h2>
                    </div>
                    <div style={{ display:"flex" }}>
                        <ChannelList
                            channels={channels}
                            onSelectChannel={setSelectedChannel}
                            selectedChannel={selectedChannel}
                        />
                        <div className="chat-container">
                            <div className="chat-header">
                                {/*<img src={selectedChannel.avatar} alt="" className="avatar-large" />*/}
                                <span className="avatar-large">
                                    <i className="fa-solid fa-user" style={{ fontSize: "34px" }}></i>
                                </span>
                                <h2>{selectedChannel?.participant?.userName}</h2>
                            </div>
                            <ChatWindow currentUser={currentUser} chatMessages={chatMessages} />
                            <MessageInput onSendMessage={handleSendMessage} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Chat;
