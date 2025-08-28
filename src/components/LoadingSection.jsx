import React from 'react';

const LoadingSection = ({ message, t }) => {
    return (
        <div className="app-section active">
            <div className="loader">
                <div className="spinner"></div>
                <p id="loadingText" data-translate-key="loadingAnalyzing">{message || t.loadingAnalyzing}</p>
            </div>
        </div>
    );
};

export default LoadingSection;