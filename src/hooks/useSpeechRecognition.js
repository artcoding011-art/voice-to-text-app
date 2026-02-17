import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = (initialLang = 'ko-KR') => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState(initialLang);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Browser does not support Speech Recognition');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Append final results to existing transcript or handle differently
            // Ideally, we want to maintain the full text.
            // The API sends the everything from the session usually if continuous is true?
            // No, for continuous, it sends chunks.
            // Actually with continuous=true, the resultIndex increments.
            // We should restart the transcript accumulator or just append.
            // For simplicity in this hook, we'll return the accumulating text from the session.

            // Better approach for React:
            // accumulate the final results in a state, and show interim in another.
        };

        // Correct handling for React state updates from event listeners is tricky.
        // Let's re-implement with a simpler handler that relies on the event structure.

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []); // Re-create if dependency changes? No, we handle lang change separately.

    // Update dynamic properties
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language;
        }
    }, [language]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript(''); // Clear previous session
                setInterimTranscript('');
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start failed", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const clearTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    // We need to redesign the onresult to properly update state.
    // Since useSpeechRecognition instance changes on render, we need to bind the event handler correctly or use refs.
    useEffect(() => {
        if (!recognitionRef.current) return;

        recognitionRef.current.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    // We need to append this to the *current* transcript state.
                    // usage of functional state update is valid here.
                    final += event.results[i][0].transcript + ' ';
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            if (final) {
                setTranscript(prev => prev + final);
            }
            // We might want to expose interim transcript separately or appended.
            // For now, let's just expose the finalized transcript + interim in a combined view if requested?
            // Or just update transcript with final, and have a separate 'interim' state.
        };

    }, [recognitionRef.current]);

    // Actually, mixing final and interim in one text block is easier for the user.
    // But let's keep them separate to style them or avoid flickering.
    // I will return { transcript, interimTranscript, ... }

    const [interimTranscript, setInterimTranscript] = useState('');

    useEffect(() => {
        if (!recognitionRef.current) return;

        recognitionRef.current.onresult = (event) => {
            let finalChunk = '';
            let interimChunk = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalChunk += event.results[i][0].transcript + ' ';
                } else {
                    interimChunk += event.results[i][0].transcript;
                }
            }

            if (finalChunk) {
                setTranscript(prev => prev + finalChunk);
            }
            setInterimTranscript(interimChunk);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied.');
            }
            // If 'no-speech', it might stop.
        };

    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        clearTranscript,
        language,
        setLanguage
    };
};

export default useSpeechRecognition;
