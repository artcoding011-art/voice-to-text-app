import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Copy, Trash2, Search, Edit3, Folder, ChevronLeft } from 'lucide-react'
import useSpeechRecognition from './hooks/useSpeechRecognition'

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

  const chatEndRef = useRef(null);

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

  // Format current date
  const getCurrentDate = () => new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimTranscript, selectedNote]);

  const hasContent = transcript.length > 0;

  return (
    <div className="mac-window">
      {/* Sidebar - mimicking Notes list */}
      <div className="sidebar hidden md:flex">
        <div className="toolbar bg-[#f7f7f5] justify-center font-semibold text-sm text-gray-600">
          Folders
        </div>
        <div className="p-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#e8e8e7] rounded-md text-sm font-medium">
            <Folder size={16} fill="currentColor" className="text-[#f7ce46]" />
            <span>Notes</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* New Note Placeholder when active */}
          <div
            className={`note-item ${!selectedNote ? 'active' : ''}`}
            onClick={handleNewNote}
          >
            <div className="note-title">New Note</div>
            <div className="note-preview">
              {transcript && !selectedNote ? transcript.substring(0, 30) + '...' : 'Click to create...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {transcript && !selectedNote ? 'Editing...' : 'Create new'}
            </div>
          </div>

          {history.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
              onClick={() => handleSelectNote(note)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-preview">{note.preview}</div>
              <div className="text-xs text-gray-500 mt-1">{note.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium text-center hover:text-gray-600 cursor-default">
              {selectedNote ? 'Viewing' : (hasContent ? 'Editing' : 'Ready')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!selectedNote && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer hover:text-black"
              >
                <option value="ko-KR">한국어</option>
                <option value="en-US">English</option>
                <option value="ja-JP">日本語</option>
              </select>
            )}

            <button onClick={handleCopy} title="Copy" className="text-gray-500 hover:text-[#f7ce46] transition-colors">
              <Copy size={18} />
            </button>

            {selectedNote && (
              <button onClick={() => handleDeleteNote(selectedNote.id)} title="Delete Note" className="text-gray-500 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            )}

            <button onClick={handleNewNote} title="New Note" className="text-gray-500 hover:text-[#f7ce46] transition-colors">
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="editor-area bg-[var(--main-bg)]">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-[#b0b0b0] placeholder-title">
              {selectedNote ? selectedNote.title : getCurrentDate()}
            </h1>

            {!selectedNote && (
              <div className="text-gray-400 text-lg mb-8">
                {isListening ? 'Listening...' : (hasContent ? 'Review your note' : 'Press microphone to start')}
              </div>
            )}

            <div className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed min-h-[200px]">
              {selectedNote ? selectedNote.content : (
                <>
                  {transcript}
                  <span className="text-gray-400">{interimTranscript}</span>
                </>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Save/Cancel Actions */}
            {!selectedNote && !isListening && hasContent && (
              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2 rounded-full bg-[#f7ce46] text-white hover:bg-[#e6c03d] shadow-md transition-transform transform hover:scale-105 font-medium"
                >
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Mic Button (or bottom bar) */}
        {!selectedNote && (!hasContent || isListening) ? (
          <div className="p-6 flex justify-center pb-8 bg-gradient-to-t from-white via-white to-transparent">
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${isListening ? 'bg-red-500 text-white recording-pulse' : 'bg-[#f7ce46] text-white hover:bg-[#e6c03d]'
                }`}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
