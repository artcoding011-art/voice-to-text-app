import React, { useEffect, useRef } from 'react';
import { Copy, Trash2, Edit3, Mic, MicOff, ChevronLeft, Menu } from 'lucide-react';
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
    onToggleRecording,
    onToggleSidebar,
    isSidebarOpen
}) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, interimTranscript, selectedNote]);

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Toolbar */}
            <div className="toolbar shrink-0 z-10 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                        title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium cursor-default">
                            {selectedNote ? 'Viewing' : (hasContent ? 'Editing' : 'Ready')}
                        </span>
                    </div>
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

            {/* Editor Area / Main Display */}
            <div className="flex-1 overflow-y-auto bg-[var(--main-bg)] relative">
                {/* Content Container */}
                <div className="max-w-3xl mx-auto p-8 min-h-full flex flex-col">
                    <h1 className="text-3xl font-bold mb-4 text-[#b0b0b0] placeholder-title">
                        {selectedNote ? selectedNote.title : getCurrentDate()}
                    </h1>

                    {/* Empty State / Listening Indicator */}
                    {!selectedNote && !hasContent && (
                        <div className="flex-1 flex flex-col justify-center items-center h-64 transition-opacity duration-300">
                            <div className="text-gray-300 text-xl font-light mb-8 animate-pulse">
                                {isListening ? 'Listening...' : 'Tap microphone to start'}
                            </div>
                        </div>
                    )}

                    <div className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed min-h-[100px] text-lg">
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
                        <div className="flex gap-4 mt-12 justify-center fade-in">
                            <button
                                onClick={onCancel}
                                className="px-6 py-2 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                className="px-8 py-2 rounded-full bg-[#f7ce46] text-white hover:bg-[#e6c03d] shadow-lg transform transition hover:-translate-y-0.5"
                            >
                                Save Note
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Centered Floating Mic Button */}
            {!selectedNote && (
                <div
                    className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out z-20
                    ${hasContent && !isListening ? 'bottom-8' : 'top-1/2 -translate-y-1/2'} 
                    `}
                >
                    <button
                        onClick={onToggleRecording}
                        className={`
                            relative group flex items-center justify-center rounded-full shadow-2xl transition-all duration-300
                            ${isListening ? 'w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600' : 'w-20 h-20 bg-gradient-to-br from-[#f7ce46] to-[#e6c03d] hover:scale-110'}
                        `}
                    >
                        {/* Ripple Effect when listening */}
                        {isListening && (
                            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20"></span>
                        )}
                        {isListening && (
                            <span className="absolute -inset-4 rounded-full border border-red-200 opacity-40 animate-pulse"></span>
                        )}

                        {/* Icons */}
                        {isListening ? (
                            <MicOff size={32} className="text-white relative z-10" />
                        ) : (
                            <Mic size={32} className="text-white relative z-10" />
                        )}

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NoteEditor;
