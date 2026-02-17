import React, { useEffect, useRef } from 'react';
import { Copy, Trash2, Edit3, Mic, MicOff, ChevronLeft } from 'lucide-react';
import { getCurrentDate } from '../helpers/dateUtils';

const NoteEditor = ({
    selectedNote,
    transcript,
    interimTranscript,
    isListening,
    hasContent,
    language,
    setLanguage,
    onCopy,
    onDelete,
    onNewNote,
    onSave,
    onCancel,
    onToggleRecording
}) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, interimTranscript, selectedNote]);

    return (
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

                    <button onClick={onCopy} title="Copy" className="text-gray-500 hover:text-[#f7ce46] transition-colors">
                        <Copy size={18} />
                    </button>

                    {selectedNote && (
                        <button onClick={() => onDelete(selectedNote.id)} title="Delete Note" className="text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                        </button>
                    )}

                    <button onClick={onNewNote} title="New Note" className="text-gray-500 hover:text-[#f7ce46] transition-colors">
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
                                onClick={onCancel}
                                className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="px-8 py-2 rounded-full bg-[#f7ce46] text-white hover:bg-[#e6c03d] shadow-md transition-transform transform hover:scale-105 font-medium"
                            >
                                Save Note
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Mic Button */}
            {!selectedNote && (!hasContent || isListening) ? (
                <div className="p-6 flex justify-center pb-8 bg-gradient-to-t from-white via-white to-transparent">
                    <button
                        onClick={onToggleRecording}
                        className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${isListening ? 'bg-red-500 text-white recording-pulse' : 'bg-[#f7ce46] text-white hover:bg-[#e6c03d]'
                            }`}
                    >
                        {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default NoteEditor;
