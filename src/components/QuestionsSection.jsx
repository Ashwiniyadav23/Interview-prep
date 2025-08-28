import React, { useState, useEffect } from 'react';

const QuestionsSection = ({ question, isCodingQuestion, onAnswerSubmit, currentQuestionIndex, totalQuestions, errorMessage, t }) => {
    const [answer, setAnswer] = useState('');
    const [codeOutput, setCodeOutput] = useState('');
    const [isCodeOutputError, setIsCodeOutputError] = useState(false);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

    useEffect(() => {
        setAnswer(''); // Clear answer when question changes
        setCodeOutput('');
        setIsCodeOutputError(false);
        setIsNextButtonDisabled(true);
    }, [question]);

    useEffect(() => {
        setIsNextButtonDisabled(answer.trim() === '');
    }, [answer]);

    const runCode = () => {
        setCodeOutput('');
        setIsCodeOutputError(false);
        let capturedLogs = [];

        const originalConsoleLog = console.log;
        console.log = (...args) => {
            capturedLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
        };

        try {
            // eslint-disable-next-line no-new-func
            new Function(answer)();
            if (capturedLogs.length > 0) {
                setCodeOutput(capturedLogs.join('\n'));
            } else {
                setCodeOutput(t.codeNoOutput);
            }
        } catch (error) {
            setCodeOutput(`Error: ${error.message}`);
            setIsCodeOutputError(true);
        } finally {
            console.log = originalConsoleLog;
        }
    };

    return (
        <div className="app-section active">
            <h2 data-translate-key="interviewTitle">{t.interviewTitle}</h2>
            <p id="questionProgress">{t.questionProgress(currentQuestionIndex + 1, totalQuestions)}</p>
            <div id="questionsContainer">
                <div className="question-card">
                    <p className="question-text">{question}</p>
                    {isCodingQuestion ? (
                        <>
                            <textarea
                                id="codeAnswer"
                                className="code-editor"
                                placeholder={t.codePlaceholder}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            ></textarea>
                            <div id="codeRunner">
                                <pre id="codeOutput" className={`code-output ${isCodeOutputError ? 'error' : ''}`}>
                                    {codeOutput || t.outputText}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <textarea
                            id="textAnswer"
                            rows="6"
                            placeholder={t.answerPlaceholder}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        ></textarea>
                    )}
                </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div id="questionActions">
                {isCodingQuestion && (
                    <button className="run-code-btn" onClick={runCode}>
                        {t.runCodeBtn}
                    </button>
                )}
                <button
                    id="nextQuestionBtn"
                    onClick={() => onAnswerSubmit(answer)}
                    disabled={isNextButtonDisabled}
                >
                    {currentQuestionIndex === totalQuestions - 1 ? t.submitFeedbackBtn : t.nextQuestionBtn}
                </button>
            </div>
        </div>
    );
};

export default QuestionsSection;