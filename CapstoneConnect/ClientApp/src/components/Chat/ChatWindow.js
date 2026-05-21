import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './chatStyles.css';

const ChatWindow = ({ currentUser, chatMessages }) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="chat-window">
            {chatMessages.map((message, index) => (
                <Message key={index} message={message} currentUser={currentUser} />
            ))}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatWindow;
