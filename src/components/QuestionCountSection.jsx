import React from 'react';

const QuestionCountSection = ({ selectedQuestionCount, setSelectedQuestionCount, onGenerate, errorMessage, t }) => {
    return (
        <div className="app-section active">
            <h2 data-translate-key="qCountTitle">{t.qCountTitle}</h2>
            <p data-translate-key="qCountSubtitle">{t.qCountSubtitle}</p>
            <div className="question-options">
                {[10, 20, 30, 40].map(count => (
                    <div className="question-option" key={count}>
                        <input
                            type="radio"
                            id={`q${count}`}
                            name="questionCount"
                            value={count}
                            checked={selectedQuestionCount === count}
                            onChange={() => setSelectedQuestionCount(count)}
                        />
                        <label htmlFor={`q${count}`} data-translate-key={`q${count}Label`}>{t[`q${count}Label`]}</label>
                    </div>
                ))}
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={onGenerate} data-translate-key="generateButton">{t.generateButton}</button>
        </div>
    );
};

export default QuestionCountSection;