import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    executePythonScript: (scriptName: string, args: string[]) => Promise<string>;
  }
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<{ title: string; content: string }[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    // Carregar as notas existentes ao iniciar o componente
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const result = await window.executePythonScript('note_manager.py', ['list']); // Assuming 'list' command lists all notes
      // Parse the result and update the state
      if (result) {
        const parsedNotes = result.split('\n').map(line => {
          const [title, content] = line.split(': '); // Assuming title: content format
          return { title: title, content: content };
        });
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Erro ao carregar as notas:', error);
    }
  };

  const handleCreateNote = async () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      console.log('Criando nota:', newNoteTitle, newNoteContent); // Adicionado console.log
      try {
        await window.executePythonScript('note_manager.py', ['create', newNoteTitle, newNoteContent]);
        // Recarregar as notas após criar uma nova
        loadNotes();
        setNewNoteTitle('');
        setNewNoteContent('');
      } catch (error) {
        console.error('Erro ao criar a nota:', error);
      }
    }
  };

  const handleEditNote = async () => {
    if (selectedNote) {
      try {
        await window.executePythonScript('note_manager.py', ['edit', selectedNote.title, newNoteContent]);
        // Recarregar as notas após editar
        loadNotes();
        setSelectedNote(null);
        setNewNoteContent('');
      } catch (error) {
        console.error('Erro ao editar a nota:', error);
      }
    }
  };

  const handleDeleteNote = async (title: string) => {
    if (window.confirm('Tem certeza que deseja remover esta nota?')) {
      try {
        await window.executePythonScript('note_manager.py', ['delete', title]);
        // Recarregar as notas após remover
        loadNotes();
        setSelectedNote(null);
      } catch (error) {
        console.error('Erro ao remover a nota:', error);
      }
    }
  };

  const handleSelectNote = (note: { title: string; content: string }) => {
    setSelectedNote(note);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
      <h1>Notas</h1>
      <div>
        <h2>Criar/Editar Nota</h2>
        <input
          type="text"
          placeholder="Título"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          style={{
            padding: '10px',
            marginRight: '10px',
            backgroundColor: '#282828',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '4px',
          }}
        />
        <textarea
          placeholder="Conteúdo"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          style={{
            padding: '10px',
            backgroundColor: '#282828',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '4px',
            width: '100%',
            marginBottom: '10px',
          }}
        />
        {selectedNote ? (
          <button onClick={handleEditNote} style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Salvar Edição
          </button>
        ) : (
          <button onClick={handleCreateNote} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            Criar
          </button>
        )}
      </div>
      <div>
        <h2>Notas Existentes</h2>
        {notes.map((note, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#282828', borderRadius: '4px', cursor: 'pointer', border: selectedNote?.title === note.title ? '2px solid #007bff' : 'none' }} onClick={() => handleSelectNote(note)}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleDeleteNote(note.title)} style={{ marginLeft: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;