import { useState, useEffect } from 'react'
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

  // Sidebar state (Default closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Optional logic
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewNote = () => {
    if (isListening) return; // Already new note mode basically
    setSelectedNote(null);
    clearTranscript();
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteNote = (id) => {
    if (confirm('Delete this note?')) {
      setHistory(history.filter(n => n.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hasContent = transcript.length > 0;

  return (
    <div className="mac-window relative flex h-full overflow-hidden">

      {/* Sidebar Container */}
      <div
        className={`
            transition-all duration-300 ease-in-out bg-[#f7f7f5] border-r border-[#e5e5e5] flex-shrink-0
            ${isSidebarOpen ? 'w-[85vw] md:w-[280px]' : 'w-0 border-none'}
            
            fixed md:relative z-30 h-full
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            md:transform-none
        `}
      >
        <div className="w-[85vw] md:w-[280px] h-full flex flex-col overflow-hidden whitespace-nowrap">
          <Sidebar
            history={history}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            onNewNote={handleNewNote}
            transcript={transcript}
          />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full relative z-10">
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
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  )
}

export default App
