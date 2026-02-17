import React from 'react';
import { Folder } from 'lucide-react';

const Sidebar = ({ history, selectedNote, onSelectNote, onNewNote, transcript }) => {
    return (
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
                    onClick={onNewNote}
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
                        onClick={() => onSelectNote(note)}
                    >
                        <div className="note-title">{note.title}</div>
                        <div className="note-preview">{note.preview}</div>
                        <div className="text-xs text-gray-500 mt-1">{note.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
