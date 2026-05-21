
import React from 'react';
import './StudentGuidelines.css'; 

const StudentGuidelines = () => (
    <div className="flex-1">
        <h2>
            <i className="fas fa-book-open text-blue-500 mr-2"></i>
            Student Guidelines
        </h2>
        <hr style={{ border: 'none', borderTop: '1px solid', marginRight: '18px' }} />
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-pencil-alt text-blue-400 mr-2"></i>
                Abstract Submission
            </h3>
            <ul className="list-none space-y-2">
                <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Review your abstract for content, grammar, and formatting.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Ensure clarity, coherence, and accuracy in your writing.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Adhere to the specified guidelines and requirements.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                    Check for word count, formatting, and content guidelines.
                </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-sync text-orange-400 mr-2"></i>
                Revisions & Resubmission
            </h3>
            <ul className="list-none space-y-2">
                <li className="flex items-start">
                    <i className="fas fa-edit text-yellow-500 mr-2 mt-1"></i>
                    Make necessary revisions as per feedback.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-paper-plane text-blue-400 mr-2 mt-1"></i>
                    Resubmit through the designated platform or channel.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-hourglass-half text-red-400 mr-2 mt-1"></i>
                    Ensure timely resubmission to avoid delays in the review process.
                </li>
            </ul>
        </div>
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <i className="fas fa-comments text-purple-400 mr-2"></i>
                Communication
            </h3>
            <ul className="list-none space-y-2">
                <li className="flex items-start">
                    <i className="fas fa-envelope-open-text text-green-400 mr-2 mt-1"></i>
                    Regularly check your email and account notifications for updates.
                </li>
                <li className="flex items-start">
                    <i className="fas fa-reply text-blue-400 mr-2 mt-1"></i>
                    Respond promptly to requests or queries from the review committee.
                </li>
            </ul>
        </div>
    </div>
);

export default StudentGuidelines;
