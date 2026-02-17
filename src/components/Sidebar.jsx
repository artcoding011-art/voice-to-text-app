import React from 'react';
import { Folder, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ history, selectedNote, onSelectNote, onNewNote, transcript, onToggle }) => {
    return (
        <div className="sidebar hidden md:flex h-full flex-col">
            <div className="toolbar bg-[#f7f7f5] flex items-center justify-between px-4 font-semibold text-[11px] text-gray-600 border-b border-[#e5e5e5] shrink-0">
                <span className="flex-1 text-center ml-6">Folders</span>
                <button
                    onClick={onToggle}
                    className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <PanelLeftClose size={16} />
                </button>
            </div>
            <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#e8e8e7] rounded-md text-[11px] font-medium">
                    <Folder size={14} fill="currentColor" className="text-[#f7ce46]" />
                    <span>Notes</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* New Note Placeholder when active */}
                <div
                    className={`note-item ${!selectedNote ? 'active' : ''}`}
                    onClick={onNewNote}
                >
                    <div className="note-title">New Note</div>
                    <div className="note-preview">
                        {transcript && !selectedNote ? transcript.substring(0, 30) + '...' : 'Click to create...'}
                    </div>
                    <div className="text-[9px] text-gray-500 mt-1">
                        {transcript && !selectedNote ? 'Editing...' : 'Create new'}
                    </div>
                </div>

                {history.map(note => (
                    <div
                        key={note.id}
                        className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                        onClick={() => onSelectNote(note)}
                    >
                        <div className="note-title">{note.title}</div>
                        <div className="note-preview">{note.preview}</div>
                        <div className="text-[9px] text-gray-500 mt-1">{note.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
