class NotesManager {
    constructor() {
        this.notes = [];
        this.currentNoteId = null;
        this.isEditing = false;
        
        this.init();
    }
    
    init() {
        this.loadNotesFromStorage();
        this.setupEventListeners();
        this.renderNotesList();
    }
    
    loadNotesFromStorage() {
        const savedNotes = localStorage.getItem('logiq_notes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
        }
    }
    
    saveNotesToStorage() {
        localStorage.setItem('logiq_notes', JSON.stringify(this.notes));
        this.updateNotesStats();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('noteSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchNotes(e.target.value);
            });
        }
        
        // Auto-save on content change
        const noteContent = document.getElementById('noteContent');
        if (noteContent) {
            noteContent.addEventListener('input', () => {
                if (this.isEditing && this.currentNoteId) {
                    this.autoSave();
                }
            });
        }
    }
    
    createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: []
        };
        
        this.notes.unshift(newNote);
        this.currentNoteId = newNote.id;
        this.isEditing = true;
        this.saveNotesToStorage();
        this.renderNotesList();
        this.showNoteEditor(newNote);
    }
    
    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.currentNoteId = noteId;
            this.isEditing = true;
            this.showNoteEditor(note);
        }
    }
    
    saveNote() {
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        
        if (!titleInput || !contentInput) return;
        
        const title = titleInput.value.trim() || 'Untitled Note';
        const content = contentInput.value;
        
        if (this.currentNoteId) {
            // Update existing note
            const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
            if (noteIndex !== -1) {
                this.notes[noteIndex].title = title;
                this.notes[noteIndex].content = content;
                this.notes[noteIndex].updatedAt = new Date().toISOString();
            }
        } else {
            // Create new note
            const newNote = {
                id: Date.now().toString(),
                title: title,
                content: content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                tags: []
            };
            this.notes.unshift(newNote);
            this.currentNoteId = newNote.id;
        }
        
        this.saveNotesToStorage();
        this.renderNotesList();
        this.showNotification('Note saved successfully!', 'success');
    }
    
    deleteNote() {
        if (!this.currentNoteId) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
            if (noteIndex !== -1) {
                this.notes.splice(noteIndex, 1);
                this.saveNotesToStorage();
                this.renderNotesList();
                this.hideNoteEditor();
                this.showNotification('Note deleted successfully!', 'success');
            }
        }
    }
    
    autoSave() {
        if (!this.currentNoteId) return;
        
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        
        if (!titleInput || !contentInput) return;
        
        const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
        if (noteIndex !== -1) {
            this.notes[noteIndex].title = titleInput.value.trim() || 'Untitled Note';
            this.notes[noteIndex].content = contentInput.value;
            this.notes[noteIndex].updatedAt = new Date().toISOString();
            this.saveNotesToStorage();
            
            // Update last saved time
            const lastSaved = document.getElementById('lastSaved');
            if (lastSaved) {
                lastSaved.textContent = `Last saved: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
        }
    }
    
    searchNotes(query) {
        const filteredNotes = query 
            ? this.notes.filter(note => 
                note.title.toLowerCase().includes(query.toLowerCase()) ||
                note.content.toLowerCase().includes(query.toLowerCase())
              )
            : this.notes;
        
        this.renderNotesList(filteredNotes);
    }
    
    renderNotesList(notesToShow = null) {
        const notesList = document.getElementById('notesList');
        if (!notesList) return;
        
        const notes = notesToShow || this.notes;
        
        if (notes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-notes">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes yet. Create your first note!</p>
                </div>
            `;
            return;
        }
        
        notesList.innerHTML = notes.map(note => `
            <div class="note-item" onclick="editNote('${note.id}')">
                <h4>${this.escapeHtml(note.title)}</h4>
                <p>${this.getPreviewText(note.content)}</p>
                <div class="note-meta">
                    <small>${this.formatDate(note.updatedAt)}</small>
                    <small>${this.getWordCount(note.content)} words</small>
                </div>
            </div>
        `).join('');
    }
    
    showNoteEditor(note) {
        const editor = document.getElementById('noteEditor');
        const notesList = document.getElementById('notesList');
        
        if (editor && notesList) {
            notesList.style.display = 'none';
            editor.style.display = 'block';
            
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            
            // Focus on title
            setTimeout(() => {
                document.getElementById('noteTitle').focus();
                document.getElementById('noteTitle').select();
            }, 100);
        }
    }
    
    hideNoteEditor() {
        const editor = document.getElementById('noteEditor');
        const notesList = document.getElementById('notesList');
        
        if (editor && notesList) {
            editor.style.display = 'none';
            notesList.style.display = 'block';
            
            // Clear inputs
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            
            this.currentNoteId = null;
            this.isEditing = false;
        }
    }
    
    cancelEdit() {
        this.hideNoteEditor();
    }
    
    updateNotesStats() {
        const notesCount = document.getElementById('notesCount');
        const lastSaved = document.getElementById('lastSaved');
        
        if (notesCount) {
            notesCount.textContent = `${this.notes.length} note${this.notes.length !== 1 ? 's' : ''} saved`;
        }
        
        if (lastSaved && !this.isEditing) {
            lastSaved.textContent = `Last saved: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
    }
    
    // Helper methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getPreviewText(content) {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    getWordCount(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    
    showNotification(message, type) {
        // Use the main script's notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// ===== Global Functions for HTML onclick =====
let notesManager = null;

function loadNotes() {
    if (!notesManager) {
        notesManager = new NotesManager();
    }
    return notesManager;
}

function createNewNote() {
    const manager = loadNotes();
    manager.createNewNote();
}

function editNote(noteId) {
    const manager = loadNotes();
    manager.editNote(noteId);
}

function saveNote() {
    const manager = loadNotes();
    manager.saveNote();
}

function deleteNote() {
    const manager = loadNotes();
    manager.deleteNote();
}

function cancelEdit() {
    const manager = loadNotes();
    manager.cancelEdit();
}

function updateNotesStats() {
    const manager = loadNotes();
    if (manager) {
        manager.updateNotesStats();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    notesManager = new NotesManager();
    
    // Add CSS for notes
    const style = document.createElement('style');
    style.textContent = `
        .empty-notes {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-muted);
        }
        .empty-notes i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        .note-meta {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            font-size: 0.75rem;
            color: var(--text-muted);
        }
        .note-item {
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
        }
        .note-item:hover {
            border-left-color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
});
