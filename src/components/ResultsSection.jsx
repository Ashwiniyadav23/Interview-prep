import React, { useState } from 'react'; // Don't forget to import useState

const ResultsSection = ({ questionsAndAnswers, feedbacksCache, isCodingQuestion, onImproveAnswer, onStartOver, overallScoreDetails, t }) => {

    const printResults = () => {
        window.print();
    };

    return (
        <div className="app-section active">
            <h2 data-translate-key="feedbackTitle">{t.feedbackTitle}</h2>
            <p data-translate-key="feedbackSubtitle">{t.feedbackSubtitle}</p>
            <div id="totalScoreDisplay">
                <h3>{overallScoreDetails.overallScoreText}</h3>
                <p>{overallScoreDetails.percentage}% - {overallScoreDetails.rating}</p>
                <p>{overallScoreDetails.reviewText}</p>
            </div>
            <div id="resultsContainer">
                {feedbacksCache.map((feedback, index) => (
                    <FeedbackCard
                        key={index}
                        index={index}
                        qa={questionsAndAnswers[index]}
                        feedback={feedback}
                        isCodingQuestion={isCodingQuestion(questionsAndAnswers[index].question)}
                        onImproveAnswer={onImproveAnswer}
                        t={t}
                    />
                ))}
            </div>
            <div className="results-actions">
                <button onClick={onStartOver} className="button-secondary" data-translate-key="startOverButton">{t.startOverButton}</button>
                <button onClick={printResults} data-translate-key="printButton">{t.printButton}</button>
            </div>
        </div>
    );
};

export default ResultsSection;

// FeedbackCard Component
const FeedbackCard = ({ index, qa, feedback, isCodingQuestion, onImproveAnswer, t }) => {
    const [improvedAnswer, setImprovedAnswer] = useState(null);
    const [isLoadingImprovement, setIsLoadingImprovement] = useState(false);
    const [improvementError, setImprovementError] = useState('');

    let scoreClass = 'low';
    if (feedback.score === 0) scoreClass = 'zero';
    else if (feedback.score >= 4) scoreClass = 'high';
    else if (feedback.score >= 3) scoreClass = 'medium';

    const handleImproveClick = async () => {
        setIsLoadingImprovement(true);
        setImprovementError(''); // Clear any previous errors
        try {
            const result = await onImproveAnswer(index);
            setImprovedAnswer(result);
        } catch (error) {
            console.error("Error improving answer:", error);
            setImprovementError(error.message);
        } finally {
            setIsLoadingImprovement(false);
        }
    };

    const answerDisplay = isCodingQuestion
        ? `<pre style="background-color:#f5f5f5; padding:10px; border-radius:4px; white-space:pre-wrap;"><code>${qa.answer || t.noCodeText}</code></pre>`
        : `<p>${qa.answer || t.noAnswerText}</p>`;

    const improvedAnswerDisplay = isCodingQuestion
        ? `<pre style="background-color:#f0fff4; padding:10px; border-radius:4px; white-space:pre-wrap;"><code>${improvedAnswer}</code></pre>`
        : `<p>${improvedAnswer}</p>`;

    const qText = t.questionProgress(index + 1, ''); // Using a modified version for just "Question X"
    const scoreText = `${t.overallScoreText('', '') .split(':')[0]}: ${feedback.score}/5`; // Extract "Score" from translation
    const yourAnswerText = `<strong>${t.pasteContentLabel.replace(':', '')}:</strong>`; // Re-using translation, removing colon
    const feedbackText = `<strong>${t.feedbackTitle.split(':')[0]}:</strong>`; // Re-using translation, taking first part

    return (
        <div className="feedback-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="feedback-header">
                <b>{qText.replace(' of', '/').replace(' / ', '/')}</b> {/* Adjusting for "Question 1/X" or similar */}
                <span className={`score ${scoreClass}`}>{scoreText}</span>
            </div>
            <p><em>{qa.question}</em></p>
            <div dangerouslySetInnerHTML={{ __html: `${yourAnswerText} ${answerDisplay}` }} />
            <p><strong dangerouslySetInnerHTML={{ __html: feedbackText }}></strong> {feedback.explanation}</p>

            {!improvedAnswer && !isLoadingImprovement && (
                <button
                    className="improve-button"
                    onClick={handleImproveClick}
                    disabled={isLoadingImprovement}
                >
                    {t.suggestionText.replace(':', '')}
                </button>
            )}

            {isLoadingImprovement && (
                <div className="mini-spinner"></div>
            )}

            {improvementError && (
                <p className="error-message" style={{ marginTop: '1rem' }}>{improvementError}</p>
            )}

            {improvedAnswer && (
                <div className="improved-answer-box">
                    <b>{t.suggestionText}</b>
                    <div dangerouslySetInnerHTML={{ __html: improvedAnswerDisplay }} />
                </div>
            )}
        </div>
    );
};