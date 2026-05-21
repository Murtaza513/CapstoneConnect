import React, { Fragment } from 'react';
import './chatStyles.css';

const ChannelList = ({ channels, onSelectChannel, selectedChannel }) => {
    return (
        <div className="channel-list">
            <div style={{ padding: "12px", backgroundColor:"grey" }}>
                <p className="channel-name">Your Chats</p>
            </div>
            {channels.length > 0 && (
                <Fragment>
                    {channels.map((channel, index) => (
                        <div
                            key={index}
                            className={`channel-item ${selectedChannel?.chatId === channel.chatId ? 'selected' : ''}`}
                            onClick={() => onSelectChannel(channel)}
                        >
                            <div className="channel-info">
                                <p className="channel-name">{channel.participant?.userName}</p>
                                <p className="channel-last-message">{channel.participant?.userId}</p>
                            </div>
                        </div>
                    ))}
                </Fragment>
            )}
            {/*<div className="dummy-message-input">
            </div>*/}
        </div>
    );
};

export default ChannelList;
