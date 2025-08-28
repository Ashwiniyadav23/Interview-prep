import React, { useState, useEffect } from 'react';

const UploadSection = ({ apiKey, setApiKey, onNext, errorMessage, t }) => {
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [fileName, setFileName] = useState(t.fileNameDefault);
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    useEffect(() => {
        const fileSelected = file !== null;
        const textPasted = textInput.trim() !== '';
        const apiKeyEntered = apiKey.trim() !== '';
        setIsNextEnabled((fileSelected || textPasted) && apiKeyEntered);
    }, [file, textInput, apiKey]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? `Selected: ${selectedFile.name}` : t.fileNameDefault);
        if (selectedFile) {
            setTextInput(''); // Clear text input if file is selected
        }
    };

    const handleTextInputChange = (e) => {
        setTextInput(e.target.value);
        if (e.target.value.trim() !== '') {
            setFile(null); // Clear file if text is entered
            setFileName(t.fileNameDefault);
            document.getElementById('fileInput').value = null; // Clear file input element
        }
    };

    return (
        <div className="app-section active">
            <h1 data-translate-key="mainTitle">{t.mainTitle}</h1>
            <p data-translate-key="mainSubtitle">{t.mainSubtitle}</p>

            <div className="api-key-input">
                <label htmlFor="apiKeyInput" data-translate-key="apiKeyLabel">{t.apiKeyLabel}</label>
                <input
                    type="password"
                    id="apiKeyInput"
                    placeholder="Enter your Google Gemini API key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <p style={{ fontSize: '0.85rem', color: 'var(--light-text-color)', marginTop: '0.5rem', textAlign: 'left' }} data-translate-key="apiKeyHelp" dangerouslySetInnerHTML={{ __html: t.apiKeyHelp }}></p>
            </div>

            <div className="upload-box" onClick={() => document.getElementById('fileInput').click()}>
                <input type="file" id="fileInput" accept=".pdf,.txt" onChange={handleFileChange} />
                <label htmlFor="fileInput" data-translate-key="uploadBoxLabel">{t.uploadBoxLabel}</label>
                <div id="fileName" data-translate-key="fileNameDefault">{fileName}</div>
            </div>

            <div className="divider-text" data-translate-key="dividerText">{t.dividerText}</div>

            <div>
                <label htmlFor="textInput" style={{ fontWeight: 500, color: 'var(--text-color)' }} data-translate-key="pasteContentLabel">{t.pasteContentLabel}</label>
                <textarea
                    id="textInput"
                    rows="6"
                    placeholder={t.pasteContentPlaceholder}
                    value={textInput}
                    onChange={handleTextInputChange}
                ></textarea>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <button id="nextToCountBtn" onClick={() => onNext(file, textInput)} disabled={!isNextEnabled} data-translate-key="nextButton">{t.nextButton}</button>
        </div>
    );
};

export default UploadSection;