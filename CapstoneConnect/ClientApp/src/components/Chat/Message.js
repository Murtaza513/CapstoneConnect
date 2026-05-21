import React from 'react';
import './chatStyles.css';

const Message = ({ message, currentUser }) => {
    
    const senderId = message.senderId.trim(); 
    const newCurrentUser = currentUser.trim();

    const formattedTime = message?.messageTime?.split('.')[0];

    return (
        <div className={`message-container ${senderId === newCurrentUser ? 'sent' : 'received'}`}>
            <div className={`message ${senderId === newCurrentUser ? 'sent' : 'received'}`}>
                <p>{message.messageContent}</p>
            </div>
                <span className="message-time">{formattedTime}</span>
        </div>
    );
};

export default Message;
