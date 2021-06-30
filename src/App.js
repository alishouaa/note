import React, { useEffect, useState } from 'react';
import './App.css';
import Preview from './component/preview';
import Message from './component/message';
import NotesContainer from './component/notes/notesContainer';
import NotesList from './component/notes/notesList';
import Note from './component/notes/note';
import NoteForm from './component/notes/noteForm';
import Alert from './component/alert/alert';


function App() {

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selecteNote, setSelectNote] = useState(null);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('notes')) {
            setNotes(JSON.parse(localStorage.getItem('notes')));

        } else {
            localStorage.setItem('notes', JSON.stringify([]));
        }

    }, []);
    useEffect(() => {
        if(validationErrors.length !== 0) {
            setTimeout(() => {
                setValidationErrors([]);
            },3000)
        }
        
    }, [validationErrors]);

    const saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    const validate = () => {
        const validationErrors = [];
        let passed = true;
        if(!title) {
            validationErrors.push("الرجاء إدخال عنوان الملاحظة");
            passed = false;
        }
        if(!content) {
            validationErrors.push("الرجاء إدخال محتوى الملاحظة");
            passed = false;
        }
        
        setValidationErrors(validationErrors);
        return passed;


    }


    const changeTitleHandler = (e) => {
        setTitle(e.target.value);
    }

    const changeContentHandler = (e) => {
        setContent(e.target.value);
    }

    const saveNoteHandler = () => {

        if(!validate()) return;
        const note = {
            id: new Date(),
            title: title,
            content: content
        }
        const updateNotes = [...notes, note];
        saveToLocalStorage('notes',updateNotes);
        setNotes(updateNotes);
        setCreating(false);
        setSelectNote(note.id);
        setTitle("");
        setContent("");


    }


    const selectNoteHandler = noteId => {
        setSelectNote(noteId);
        setCreating(false);
        setEditing(false);
    }

    const editNodteHandler = () => {
        const note = notes.find(note => note.id === selecteNote);
        setEditing(true);
        setTitle(note.title);
        setContent(note.content);
    }

    const updateNoteHandler = () => {
        if(!validate()) return;
        const updateNotes = [...notes];
        const noteIndex = notes.findIndex(note => note.id === selecteNote);
        updateNotes[noteIndex] = {
            id: selecteNote,
            title: title,
            content: content
        };
        saveToLocalStorage('notes',updateNotes);
        setNotes(updateNotes);
        setEditing(false);
        setTitle("");
        setContent("");
    }

    const addNoteHandler = () => {
        setCreating(true);
        setEditing(false);
        setTitle("");
        setContent("");
    }

    const deletNoteHandler = () => {
        const updateNotes = [...notes];
        const noteIndex = updateNotes.findIndex(note => note.id === selecteNote);
        saveToLocalStorage('notes',updateNotes);
        notes.splice(noteIndex, 1);
        setNotes(notes);
        setSelectNote(null);

    }

    const getAddNote = () => {
        return (
            <NoteForm
                formTitle="ملاحظة جديدة"
                title={title}
                content={content}
                titleChanged={changeTitleHandler}
                contentChanged={changeContentHandler}
                submitText="حفظ"
                submitClicked={saveNoteHandler}

            />
        );
    }

    const getPreview = () => {
        if (notes.length === 0) {
            return <Message title="لا يوجد ملاحظة" />
        }
        if (!selecteNote) {
            return <Message title=" الرجاء اختيار ملاحظة" />
        }

        const note = notes.find(note => {
            return note.id === selecteNote;
        });

        let noteDisplay = (
            <div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
            </div>
        )

        if (editing) {
            noteDisplay = (
                <NoteForm
                    formTitle="تعديل ملاحظة"
                    title={title}
                    content={content}
                    titleChanged={changeTitleHandler}
                    contentChanged={changeContentHandler}
                    submitText="حفظ"
                    submitClicked={updateNoteHandler}

                />
            );
        }
        return (
            <div>
                {!editing &&
                    <div className="note-operations">
                        <a href="#" onClick={editNodteHandler}>
                            <i className="fa fa-pencil-alt" />
                        </a>
                        <a href="#" onClick={deletNoteHandler}>
                            <i className="fa fa-trash" /></a>
                    </div>
                }
                {noteDisplay}
            </div>
        );
    };




    return (
        <div className="App">
            <NotesContainer>
                <NotesList>
                    {notes.map(note =>
                        <Note
                            key={note.id}
                            title={note.title}
                            noteClicked={() => selectNoteHandler(note.id)}
                            active={selecteNote === note.id}
                        />)}
                </NotesList>
                <button className="add-btn" onClick={addNoteHandler}>
                    +
                    </button>
            </NotesContainer>

            <Preview>
                {creating ? getAddNote() : getPreview()}
            </Preview>

            {validationErrors.length !== 0 && <Alert validationMessages={validationErrors} />}

        </div>
    );

}

export default App;
