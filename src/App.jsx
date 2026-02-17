import { useState, useRef, useEffect } from 'react'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import Sidebar from './components/Sidebar'
import NoteEditor from './components/NoteEditor'
import { getCurrentDate } from './helpers/dateUtils'

function App() {
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    clearTranscript,
    language,
    setLanguage
  } = useSpeechRecognition('ko-KR');

  // History for sidebar
  const [history, setHistory] = useState([
    { id: 1, title: 'Ideas for Project', preview: 'Focus on clean UI and responsiveness...', date: 'Yesterday', content: 'Focus on clean UI and responsiveness. Ensure mobile compatibility.' },
  ]);

  const [selectedNote, setSelectedNote] = useState(null);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCopy = () => {
    const textToCopy = selectedNote ? selectedNote.content : (transcript + (interimTranscript ? interimTranscript : ''));
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const handleSave = () => {
    if (!transcript.trim()) return;

    const newNote = {
      id: Date.now(),
      title: getCurrentDate() + ' Note',
      preview: transcript.substring(0, 50) + (transcript.length > 50 ? '...' : ''),
      date: 'Just now',
      content: transcript
    };

    setHistory([newNote, ...history]);
    clearTranscript(); // Auto-reset for new note
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to discard this recording?')) {
      clearTranscript();
    }
  };

  const handleSelectNote = (note) => {
    if (isListening) {
      if (!confirm('Stop recording and view note?')) return;
      stopListening();
    }
    setSelectedNote(note);
  };

  const handleNewNote = () => {
    if (isListening) return; // Already new note mode basically
    setSelectedNote(null);
    clearTranscript();
  };

  const handleDeleteNote = (id) => {
    if (confirm('Delete this note?')) {
      setHistory(history.filter(n => n.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    }
  }

  const hasContent = transcript.length > 0;

  return (
    <div className="mac-window">
      <Sidebar
        history={history}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        transcript={transcript}
      />

      <NoteEditor
        selectedNote={selectedNote}
        transcript={transcript}
        interimTranscript={interimTranscript}
        isListening={isListening}
        hasContent={hasContent}
        language={language}
        setLanguage={setLanguage}
        onCopy={handleCopy}
        onDelete={handleDeleteNote}
        onNewNote={handleNewNote}
        onSave={handleSave}
        onCancel={handleCancel}
        onToggleRecording={toggleRecording}
      />
    </div>
  )
}

export default App
