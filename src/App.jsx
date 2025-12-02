import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf'; // Using react-pdf for PDF parsing
import './App.css'; // We'll put the CSS here

// Import your components (to be created next)
import UploadSection from './components/UploadSection';
import QuestionCountSection from './components/QuestionCountSection';
import LoadingSection from './components/LoadingSection';
import QuestionsSection from './components/QuestionsSection';
import ResultsSection from './components/ResultsSection';

// Configure pdf.js worker (important for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const translations = {
    'en': {
        mainTitle: '🤖 AI Interview Coach',
        mainSubtitle: 'Upload your Resume, a Job Description, or paste any relevant text to generate personalized interview questions.',
        apiKeyLabel: 'Your Gemini API Key:',
        apiKeyHelp: 'Obtain your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--primary-color);">Google AI Studio</a>.',
        uploadBoxLabel: 'Click to select a .PDF or .TXT file',
        fileNameDefault: 'No file selected',
        dividerText: 'OR',
        pasteContentLabel: 'Paste Content Directly:',
        pasteContentPlaceholder: 'Paste a job description or other relevant text here...',
        nextButton: 'Next',
        qCountTitle: '🔢 Choose Interview Length',
        qCountSubtitle: 'How many questions would you like to generate for your practice interview?',
        q10Label: '10 Questions',
        q20Label: '20 Questions',
        q30Label: '30 Questions',
        q40Label: '40 Questions',
        generateButton: 'Generate Questions',
        loadingAnalyzing: 'Analyzing your document...',
        interviewTitle: '📝 Your Custom Interview',
        feedbackTitle: '🏆 Your Feedback Report',
        feedbackSubtitle: "Here's a detailed analysis of your answers. Review the feedback to improve your interviewing skills.",
        startOverButton: 'Start Over',
        printButton: '🖨️ Print Report',
        evaluatingText: "Evaluating your answers...",
        noAnswerExplanation: "No answer was provided. In an interview, it's crucial to attempt every question. This misses a key opportunity to showcase your skills.",
        noCodeText: "(No code provided)",
        noAnswerText: "<em>(No answer provided)</em>",
        suggestionText: "💡 Model Answer Suggestion:",
        codeNoOutput: 'Code executed without errors, but produced no output. (Use console.log() to display results)',
        errorAPI: 'API call failed with status',
        errorSafety: 'Content was blocked due to safety concerns. Please adjust your input or prompt.',
        errorInvalidResponse: 'Invalid response structure from API. No text content found.',
        errorPDFLibrary: 'PDF processing library not available. Please ensure the CDN link for pdf.js is correct.',
        errorProcessInput: 'Failed to process the input. Error: ',
        errorGenerateQuestions: 'The AI failed to generate questions. Error: ',
        errorGetFeedback: 'An error occurred while getting feedback. Error: ',
        overallScoreText: (score, total) => `Your Overall Score: ${score} / ${total}`,
        reviewText: `Review the individual feedback to pinpoint areas for improvement and practice for your next interview!`,
        rating90: "Outstanding Performance!",
        rating75: "Excellent Work!",
        rating60: "Good Effort, Room for Improvement.",
        rating40: "Needs Significant Practice.",
        rating0: "Time to Refocus and Relearn.",
        questionProgress: (current, total) => `Question ${current} of ${total}`,
        nextQuestionBtn: 'Next Question →',
        submitFeedbackBtn: 'Submit for Feedback',
        runCodeBtn: '▶️ Run Code',
        answerPlaceholder: 'Type your detailed answer here...',
        codePlaceholder: 'Write your code here...',
        outputText: 'Output will be shown here...',
    },
    'hi': {
        mainTitle: '🤖 एआई इंटरव्यू कोच',
        mainSubtitle: 'व्यक्तिगत साक्षात्कार प्रश्न उत्पन्न करने के लिए अपना बायोडाटा, नौकरी का विवरण अपलोड करें, या कोई प्रासंगिक टेक्स्ट पेस्ट करें।',
        apiKeyLabel: 'आपकी जेमिनी एपीआई कुंजी:',
        apiKeyHelp: '<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--primary-color);">Google AI Studio</a> से अपनी कुंजी प्राप्त करें।',
        uploadBoxLabel: '.PDF या .TXT फ़ाइल चुनने के लिए क्लिक करें',
        fileNameDefault: 'कोई फ़ाइल नहीं चुनी गई',
        dividerText: 'या',
        pasteContentLabel: 'सामग्री सीधे पेस्ट करें:',
        pasteContentPlaceholder: 'नौकरी का विवरण या अन्य प्रासंगिक टेक्स्ट यहाँ पेस्ट करें...',
        nextButton: 'अगला',
        qCountTitle: '🔢 साक्षात्कार की अवधि चुनें',
        qCountSubtitle: 'आप अपने अभ्यास साक्षात्कार के लिए कितने प्रश्न उत्पन्न करना चाहेंगे?',
        q10Label: '10 प्रश्न',
        q20Label: '20 प्रश्न',
        q30Label: '30 प्रश्न',
        q40Label: '40 प्रश्न',
        generateButton: 'प्रश्न उत्पन्न करें',
        loadingAnalyzing: 'आपके दस्तावेज़ का विश्लेषण किया जा रहा है...',
        interviewTitle: '📝 आपका कस्टम साक्षात्कार',
        feedbackTitle: '🏆 आपकी प्रतिक्रिया रिपोर्ट',
        feedbackSubtitle: "यहां आपके उत्तरों का विस्तृत विश्लेषण है। अपने साक्षात्कार कौशल को बेहतर बनाने के लिए प्रतिक्रिया की समीक्षा करें।",
        startOverButton: 'पुनः आरंभ करें',
        printButton: '🖨️ रिपोर्ट प्रिंट करें',
        evaluatingText: "आपके उत्तरों का मूल्यांकन किया जा रहा है...",
        noAnswerExplanation: "कोई उत्तर नहीं दिया गया। साक्षात्कार में, प्रत्येक प्रश्न का प्रयास करना महत्वपूर्ण है। यह आपके कौशल को प्रदर्शित करने का एक महत्वपूर्ण अवसर चूक जाता है।",
        noCodeText: "(कोई कोड प्रदान नहीं किया गया)",
        noAnswerText: "<em>(कोई उत्तर नहीं दिया गया)</em>",
        suggestionText: "💡 मॉडल उत्तर सुझाव:",
        codeNoOutput: 'कोड बिना किसी त्रुटि के निष्पादित हुआ, लेकिन कोई आउटपुट नहीं मिला। (परिणाम प्रदर्शित करने के लिए console.log() का उपयोग करें)',
        errorAPI: 'API कॉल स्थिति के साथ विफल रहा',
        errorSafety: 'सुरक्षा चिंताओं के कारण सामग्री को अवरुद्ध कर दिया गया था। कृपया अपना इनपुट या प्रॉम्प्ट समायोजित करें।',
        errorInvalidResponse: 'API से अमान्य प्रतिक्रिया संरचना। कोई टेक्स्ट सामग्री नहीं मिली।',
        errorPDFLibrary: 'पीडीएफ प्रोसेसिंग लाइब्रेरी उपलब्ध नहीं है। कृपया सुनिश्चित करें कि pdf.js के लिए CDN लिंक सही है।',
        errorProcessInput: 'इनपुट को संसाधित करने में विफल। त्रुटि: ',
        errorGenerateQuestions: 'AI प्रश्नों को उत्पन्न करने में विफल रहा। त्रुटि: ',
        errorGetFeedback: 'प्रतिक्रिया प्राप्त करते समय एक त्रुटि हुई। त्रुटि: ',
        overallScoreText: (score, total) => `आपका कुल स्कोर: ${score} / ${total}`,
        reviewText: `सुधार के क्षेत्रों को इंगित करने और अपने अगले साक्षात्कार के लिए अभ्यास करने के लिए व्यक्तिगत प्रतिक्रिया की समीक्षा करें!`,
        rating90: "उत्कृष्ट प्रदर्शन!",
        rating75: "बहुत बढ़िया काम!",
        rating60: "अच्छा प्रयास, सुधार की गुंजाइश है।",
        rating40: "महत्वपूर्ण अभ्यास की आवश्यकता है।",
        rating0: "पुनः ध्यान केंद्रित करने और फिर से सीखने का समय है।",
        questionProgress: (current, total) => `प्रश्न ${current} / ${total}`,
        nextQuestionBtn: 'अगला प्रश्न →',
        submitFeedbackBtn: 'प्रतिक्रिया के लिए सबमिट करें',
        runCodeBtn: '▶️ कोड चलाएँ',
        answerPlaceholder: 'अपना विस्तृत उत्तर यहाँ टाइप करें...',
        codePlaceholder: 'अपना कोड यहाँ लिखें...',
        outputText: 'आउटपुट यहाँ दिखाया जाएगा...',
    }
};

const App = () => {
    const [currentSection, setCurrentSection] = useState('upload'); // 'upload', 'questionCount', 'loading', 'questions', 'results'
    const [apiKey, setApiKey] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
    const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedbacksCache, setFeedbacksCache] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const t = translations[currentLanguage]; // Shorthand for translations

    useEffect(() => {
        const storedApiKey = localStorage.getItem('geminiApiKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    const showSection = (section) => {
        setErrorMessage(''); // Clear errors when changing sections
        setCurrentSection(section);
    };

    const parsePDF = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ") + "\n";
            }
            return text;
        } catch (error) {
            console.error("Error parsing PDF:", error);
            throw new Error(t.errorProcessInput + error.message);
        }
    };

    const callGenerativeAPI = async (prompt) => {
        if (!apiKey) {
            throw new Error("API key is missing. Please enter your Gemini API key.");
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

        const body = {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.5,
                topK: 1,
                topP: 1,
            }
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`${t.errorAPI} ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0].finishReason === 'SAFETY') {
            throw new Error(t.errorSafety);
        }
        if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            throw new Error(t.errorInvalidResponse);
        }
        return data.candidates[0].content.parts[0].text;
    };

    const handleFileUploadOrText = async (file, textInput) => {
        if (!apiKey) {
            setErrorMessage("Please enter your Gemini API key.");
            return;
        }
        localStorage.setItem('geminiApiKey', apiKey);

        setLoadingMessage(t.loadingAnalyzing);
        showSection('loading');

        try {
            if (textInput) {
                setSelectedFileContent(textInput);
            } else if (file) {
                if (file.type === "application/pdf") {
                    const content = await parsePDF(file);
                    setSelectedFileContent(content);
                } else {
                    const content = await file.text();
                    setSelectedFileContent(content);
                }
            } else {
                setErrorMessage("No input provided. Please either paste text or upload a file.");
                showSection('upload');
                return;
            }
            showSection('questionCount');
        } catch (error) {
            console.error("Error handling input:", error);
            setErrorMessage(t.errorProcessInput + error.message);
            showSection('upload');
        }
    };

    const generateQuestions = async () => {
        if (!selectedFileContent) {
            setErrorMessage("No content available. Please provide input again.");
            showSection('upload');
            return;
        }

        const langName = currentLanguage === 'hi' ? 'Hindi' : 'English';
        setLoadingMessage(`Generating ${selectedQuestionCount} personalized questions in ${langName}...`);
        showSection('loading');

        const prompt = `Based on the following content, generate an array of ${selectedQuestionCount} unique, insightful, and relevant interview questions. Mix content-specific questions with common behavioral and potential coding questions.
        IMPORTANT: All questions in the output must be in the ${langName} language.
        Return the output as a valid JSON array of strings. For example: ["Question 1?", "Write a function to reverse a string."]\n\nContent:\n${selectedFileContent}`;

        try {
            const responseText = await callGenerativeAPI(prompt);
            const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const generatedQuestions = JSON.parse(cleanedResponse);

            setQuestionsAndAnswers(generatedQuestions.map(q => ({ question: q, answer: "" })));
            setCurrentQuestionIndex(0);
            showSection('questions');
        } catch (error) {
            console.error("Error generating questions:", error);
            setErrorMessage(t.errorGenerateQuestions + error.message + ". Please check your API key, network, or content and try again.");
            showSection('questionCount');
        }
    };

    const isCodingQuestion = (question) => {
        const keywords = ['code', 'function', 'algorithm', 'implement', 'write a', 'array', 'string', 'variable', 'loop', 'debug', 'फ़ंक्शन', 'कोड', 'एल्गोरिदम', 'लिखें'];
        const lowerCaseQuestion = question.toLowerCase();
        return keywords.some(keyword => lowerCaseQuestion.includes(keyword));
    };

    const handleAnswerSubmit = (answer) => {
        const updatedQuestionsAndAnswers = [...questionsAndAnswers];
        updatedQuestionsAndAnswers[currentQuestionIndex].answer = answer;
        setQuestionsAndAnswers(updatedQuestionsAndAnswers);

        if (currentQuestionIndex < questionsAndAnswers.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            submitAnswers();
        }
    };

    const submitAnswers = async () => {
        setLoadingMessage(t.evaluatingText);
        showSection('loading');

        const feedbackPromises = questionsAndAnswers.map(qa => getAnswerFeedback(qa.question, qa.answer));

        try {
            const resolvedFeedbacks = await Promise.all(feedbackPromises);
            setFeedbacksCache(resolvedFeedbacks);
            showSection('results');
        } catch (error) {
            console.error("Error submitting answers:", error);
            setErrorMessage(t.errorGetFeedback + error.message + ". Please check your network or API key and try again.");
            showSection('questions');
        }
    };

    const getAnswerFeedback = async (question, answer) => {
        if (!answer) {
            return { score: 0, explanation: t.noAnswerExplanation };
        }

        const isCoding = isCodingQuestion(question);
        const langName = currentLanguage === 'hi' ? 'Hindi' : 'English';

        const promptType = isCoding
            ? `You are an expert programming interview evaluator. Evaluate the code solution based on correctness, clarity, and efficiency. Provide a score from 0 to 5. The explanation must be CONCISE and ACTIONABLE (2-3 sentences max).`
            : `You are an expert interview evaluator. Evaluate the answer based on the question. Provide a score from 0 to 5. The explanation must be CONCISE and ACTIONABLE (2-3 sentences max). For low scores, identify the biggest weakness and suggest a fix. For high scores, praise the key strength and offer one refinement.`;

        const prompt = `${promptType}
        IMPORTANT: The explanation must be in the ${langName} language.
        Return a valid JSON object with "score" (number) and "explanation" (string).
        Question: "${question}"
        Answer/Code: "${answer}"`;

        const responseText = await callGenerativeAPI(prompt);
        const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedResponse);
    };

    const improveAnswer = async (index) => {
        const qa = questionsAndAnswers[index];
        const isCoding = isCodingQuestion(qa.question);
        const langName = currentLanguage === 'hi' ? 'Hindi' : 'English';

        const promptType = isCoding
            ? `You are an expert coding interview coach. Rewrite the user's code into an optimal "5/5" solution. Add comments to explain the logic.`
            : `You are an expert interview coach. Rewrite the user's answer into a concise, impactful, model "5/5" response (3-5 sentences). Focus on clarity and a professional tone. Use the STAR method briefly if it fits.`;

        const prompt = `${promptType}
        IMPORTANT: The new, ideal answer must be provided directly, in the ${langName} language.
        Original Question: "${qa.question}"
        User's Answer/Code: "${qa.answer}"
        Model Answer:`;

        try {
            const improvedAnswerText = await callGenerativeAPI(prompt);
            return improvedAnswerText;
        } catch (error) {
            console.error("Error improving answer:", error);
            throw new Error(`Failed to generate a suggestion. ${error.message}`);
        }
    };

    const startOver = () => {
        setApiKey('');
        setSelectedFileContent('');
        setSelectedQuestionCount(10);
        setQuestionsAndAnswers([]);
        setCurrentQuestionIndex(0);
        setFeedbacksCache([]);
        setLoadingMessage('');
        setErrorMessage('');
        localStorage.removeItem('geminiApiKey');
        showSection('upload');
    };

    const getOverallScoreDetails = () => {
        const totalPossibleScore = feedbacksCache.length * 5;
        const yourTotalScore = feedbacksCache.reduce((sum, f) => sum + f.score, 0);
        const percentage = totalPossibleScore > 0 ? (yourTotalScore / totalPossibleScore) * 100 : 0;

        let rating = "";
        if (percentage >= 90) rating = t.rating90;
        else if (percentage >= 75) rating = t.rating75;
        else if (percentage >= 60) rating = t.rating60;
        else if (percentage >= 40) rating = t.rating40;
        else rating = t.rating0;

        return {
            yourTotalScore,
            totalPossibleScore,
            percentage: percentage.toFixed(0),
            rating,
            overallScoreText: t.overallScoreText(yourTotalScore, totalPossibleScore),
            reviewText: t.reviewText
        };
    };

    return (
        <div className="container">
            <div className="language-selector">
                <select id="languageSelector" onChange={(e) => setCurrentLanguage(e.target.value)} value={currentLanguage}>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                </select>
            </div>

            {currentSection === 'upload' && (
                <UploadSection
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    onNext={handleFileUploadOrText}
                    errorMessage={errorMessage}
                    t={t}
                />
            )}
            {currentSection === 'questionCount' && (
                <QuestionCountSection
                    selectedQuestionCount={selectedQuestionCount}
                    setSelectedQuestionCount={setSelectedQuestionCount}
                    onGenerate={generateQuestions}
                    errorMessage={errorMessage}
                    t={t}
                />
            )}
            {currentSection === 'loading' && (
                <LoadingSection message={loadingMessage} t={t} />
            )}
            {currentSection === 'questions' && questionsAndAnswers.length > 0 && (
                <QuestionsSection
                    question={questionsAndAnswers[currentQuestionIndex].question}
                    isCodingQuestion={isCodingQuestion(questionsAndAnswers[currentQuestionIndex].question)}
                    onAnswerSubmit={handleAnswerSubmit}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={questionsAndAnswers.length}
                    errorMessage={errorMessage}
                    t={t}
                />
            )}
            {currentSection === 'results' && (
                <ResultsSection
                    questionsAndAnswers={questionsAndAnswers}
                    feedbacksCache={feedbacksCache}
                    isCodingQuestion={isCodingQuestion}
                    onImproveAnswer={improveAnswer}
                    onStartOver={startOver}
                    overallScoreDetails={getOverallScoreDetails()}
                    t={t}
                />
            )}
        </div>
    );
};

export default App;
