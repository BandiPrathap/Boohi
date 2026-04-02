import React, { useState, useEffect, useRef } from 'react';
import UploadView from './components/UploadView';
import ExamView from './components/ExamView';
import ResultView from './components/ResultView';
import AnswerKeyPrompt from './components/AnswerKeyPrompt';
import Home from './components/Home';

// External Library Loaders
const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const App = () => {
  const [view, setView] = useState('home'); // home | upload | exam | uploadKey | result
  const [questionPdf, setQuestionPdf] = useState(null);
  const [answerKeyPdf, setAnswerKeyPdf] = useState(null);
  const [numQuestions, setNumQuestions] = useState(100);
  const [timerDuration, setTimerDuration] = useState(120); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [extractedKeys, setExtractedKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // PDF Viewer States
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.5);
  const canvasRef = useRef(null);

  const loadPdfJs = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = PDFJS_URL;
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        resolve(window.pdfjsLib);
      };
      document.head.appendChild(script);
    });
  };

  const renderPage = async (num, doc = pdfDoc, scale = pdfScale) => {
    if (!doc || !canvasRef.current) return;
    const page = await doc.getPage(num);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
  };

  // Re-render when scale or page changes
  useEffect(() => {
    if (pdfDoc) {
      // ensure currentPage is within bounds
      const pageToRender = Math.min(Math.max(1, currentPage), pdfDoc.numPages || 1);
      renderPage(pageToRender, pdfDoc, pdfScale);
    }
  }, [pdfScale, currentPage, pdfDoc]);

  const startExam = async () => {
    if (!questionPdf) {
      setErrorMessage('Please upload the Question Paper first.');
      return;
    }
    setLoading(true);
    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await questionPdf.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(doc);
      setTimeLeft(Number(timerDuration) * 60);
      setIsTimerRunning(true);
      setView('exam');
      setTimeout(() => renderPage(1, doc), 100);
    } catch (err) {
      setErrorMessage('Error loading PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractFromFile = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const pdfjs = await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ');
      }

      const regex = /(\d+)\s*[\.\-\)\:]?\s*([A-D]|[a-d])/g;
      let match;
      const keys = {};
      while ((match = regex.exec(fullText)) !== null) {
        keys[parseInt(match[1])] = match[2].toUpperCase();
      }

      if (Object.keys(keys).length === 0) {
        throw new Error("Could not detect any patterns (e.g., '1-A') in the answer key PDF.");
      }

      setExtractedKeys(keys);
      setView('result');
      setIsTimerRunning(false);
    } catch (err) {
      setErrorMessage('Key Extraction Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAnswerKeyUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAnswerKeyPdf(file);
        // extract immediately
        setTimeout(() => extractFromFile(file), 100);
      }
    };
    input.click();
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      // Timer expired: stop timer, move to answer-key upload page and disable edits
      setIsTimerRunning(false);
      if (view === 'exam') {
        // show upload prompt; if answerKeyPdf already present, process it
        setView('uploadKey');
        if (answerKeyPdf) extractFromFile(answerKeyPdf);
      }
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, view, answerKeyPdf]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const onRestart = () => {
    window.location.reload();
  };

  const proceedToUpload = () => setView('upload');

  if (view === 'upload') {
    return (
      <UploadView
        questionPdf={questionPdf}
        setQuestionPdf={setQuestionPdf}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        timerDuration={timerDuration}
        setTimerDuration={setTimerDuration}
        startExam={startExam}
        loading={loading}
        errorMessage={errorMessage}
      />
    );
  }

  if (view === 'home') {
    return <Home onProceed={proceedToUpload} />;
  }

  if (view === 'exam') {
    return (
      <ExamView
        pdfDoc={pdfDoc}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        renderPage={renderPage}
        canvasRef={canvasRef}
        userAnswers={userAnswers}
        setUserAnswers={setUserAnswers}
        markedForReview={markedForReview}
        setMarkedForReview={setMarkedForReview}
        numQuestions={Number(numQuestions)}
        formatTime={formatTime}
        timeLeft={timeLeft}
        setIsTimerRunning={setIsTimerRunning}
        openAnswerKeyUpload={openAnswerKeyUpload}
        loading={loading}
        pdfScale={pdfScale}
        setPdfScale={setPdfScale}
      />
    );
  }

  if (view === 'uploadKey') {
    return (
      <AnswerKeyPrompt extractFromFile={extractFromFile} loading={loading} existingFileName={answerKeyPdf?.name} />
    );
  }

  if (view === 'result') {
    return (
      <ResultView extractedKeys={extractedKeys} userAnswers={userAnswers} onRestart={onRestart} />
    );
  }

  return null;
};

export default App;