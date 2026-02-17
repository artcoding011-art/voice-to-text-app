import React from 'react';
import { Folder, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ history, selectedNote, onSelectNote, onNewNote, transcript, onToggle }) => {
    return (
        <div className="sidebar flex h-full flex-col w-full">
            <div className="toolbar bg-[#f7f7f5] flex items-center justify-end px-4 border-b border-[#e5e5e5] shrink-0">
                <button
                    onClick={onToggle}
                    className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <PanelLeftClose size={16} />
                </button>
            </div>
            {/* Notes List */}
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
