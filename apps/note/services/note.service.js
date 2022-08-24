import { storageService } from '../../../services/storage.service.js'
import { utilService } from '../../../services/util.service.js'

const KEY = 'notesDB'

export const noteService = {
  query,
  getNoteById,
  updateNoteText,
  addNote,
  changeNoteColor,
  deleteNote,
  toggleTodoCheck,
  togglePin,
}

function query(filterBy) {
  let notes = _loadFromStorage() || _createNotes()
  notes = _sortByPinned(notes)
  notes = notes.map((note) => {
    if (note.type !== 'note-todo') return note
    else {
      const sortedTodo = _sortByChecked(note.info.todo)
      note.info.todo = sortedTodo
      return note
    }
  })
  if (filterBy) {
    filterBy = filterBy.toLowerCase()
    const filteredNotes = notes.filter((note) => {
      if (note.type === 'note-todo')
        return (
          note.info.title.toLowerCase().includes(filterBy) ||
          _filterTodo(note.info.todo, filterBy)
        )
      else {
        return note.info.title
          ? note.info.title.toLowerCase().includes(filterBy)
          : '' || note.info.txt
          ? note.info.txt.toLowerCase().includes(filterBy)
          : ''
      }
    })
    return Promise.resolve(filteredNotes)
  }
  return Promise.resolve(notes)
}

function _filterTodo(todo, filterBy) {
  return todo.some((task) => task.txt.toLowerCase().includes(filterBy))
}

function getNoteById(id) {
  let notes = _loadFromStorage()
  const note = notes.find((note) => note.id === id)
  return Promise.resolve(note)
}

function _loadFromStorage() {
  return storageService.loadFromStorage(KEY)
}

function _saveToStorage(notes) {
  storageService.saveToStorage(KEY, notes)
}

function _createNotes() {
  const notes = [
    {
      id: 'pFBwMV',
      type: 'note-img',
      isPinned: false,
      info: {
        title: 'Move to Portugal',
        txt: '',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/1200px-Flag_of_Portugal.svg.png',
        todo: [],
      },
      style: {
        backgroundColor: '#FDCFE8',
      },
    },
    {
      id: 'u1rwav',
      type: 'note-todo',
      isPinned: false,
      info: {
        title: 'Groceries',
        txt: '',
        url: '',
        todo: [
          {
            txt: 'Water',
            isChecked: false,
          },
          {
            txt: 'Milk',
            isChecked: true,
          },
          {
            txt: 'Bread',
            isChecked: false,
          },
          {
            txt: 'Rice',
            isChecked: true,
          },
          {
            txt: 'Toiler Paper',
            isChecked: false,
          },
        ],
      },
      style: {
        backgroundColor: '#F28B82',
      },
    },
    {
      id: 'svPO8T',
      type: 'note-todo',
      isPinned: true,
      info: {
        title: 'Todo list for tomorrow',
        txt: '',
        url: '',
        todo: [
          {
            txt: 'Eat',
            isChecked: true,
          },
          {
            txt: 'Sleep',
            isChecked: true,
          },
          {
            txt: 'Code',
            isChecked: false,
          },
          {
            txt: 'Repeat',
            isChecked: false,
          },
        ],
      },
      style: {
        backgroundColor: '#FFF475',
      },
    },
    {
      id: 'TUfens',
      type: 'note-txt',
      isPinned: false,
      info: {
        txt: 'Lets init!',
        url: '',
        todo: [],
        title: 'Hello',
      },
      style: {
        backgroundColor: '#F1E4DE',
        color: '000',
      },
    },
    {
      id: 'WzQ9KF',
      type: 'note-img',
      isPinned: false,
      info: {
        url: '../../../assets/img/bbtcat.png',
        title: 'Bob for hire',
      },
      style: {
        backgroundColor: '#FFF475',
      },
    },
    {
      id: 'JIUJb7',
      type: 'note-video',
      isPinned: false,
      info: {
        videoId: '0Xtbnfcxxco',
      },
      style: {
        backgroundColor: '#FDCFE8',
      },
    },
  ]
  _saveToStorage(notes)
  console.log(notes)
  return notes
}

function updateNoteText(updatedNote, inputText, inputTitle) {
  updatedNote.info.txt = inputText
  updatedNote.info.title = inputTitle
  const updatedNotes = updateNote(updatedNote)
  _saveToStorage(updatedNotes)
  return Promise.resolve()
}

function updateNote(updatedNote) {
  const notes = _loadFromStorage()
  return notes.map((note) => {
    if (note.id === updatedNote.id) return updatedNote
    return note
  })
}

function addNote(note) {
  const { noteInfo, noteType } = note
  switch (noteType) {
    case 'note-txt':
      if (!noteInfo.txt && !noteInfo.title) return
      break
    case 'note-img':
      if (!noteInfo.url) return
      break
    case 'note-video':
      if (!noteInfo.url) return
      break
    case 'note-todo':
      if (!noteInfo.todo.length) return
      noteInfo.todo = noteInfo.todo
        .filter((task) => task.length >= 1)
        .map((task) => ({ txt: task }))
      console.log(noteInfo.todo)
      break
  }
  const newNote = {
    id: utilService.makeId(),
    type: noteType,
    isPinned: false,
    info: { ...noteInfo },
    style: {
      backgroundColor: '#fff',
    },
  }
  const notes = _loadFromStorage()
  notes.unshift(newNote)
  _saveToStorage(notes)
  return Promise.resolve(newNote)
}

function changeNoteColor(noteId, color) {
  const notes = _loadFromStorage()
  const note = notes.find((note) => note.id === noteId)
  note.style.backgroundColor = color
  _saveToStorage(notes)
  return Promise.resolve()
}

function deleteNote(noteId) {
  const notes = _loadFromStorage()
  const idx = notes.findIndex((note) => note.id === noteId)
  notes.splice(idx, 1)
  _sortByPinned(notes)
  _saveToStorage(notes)
  return Promise.resolve(notes)
}

function toggleTodoCheck(idx, noteId) {
  const notes = _loadFromStorage()
  const note = notes.find((note) => noteId === note.id)
  const todo = note.info.todo
  todo[idx].isChecked = !todo[idx].isChecked
  _sortByChecked(todo)
  _saveToStorage(notes)
  return Promise.resolve(todo)
}

function togglePin(noteId) {
  const notes = _loadFromStorage()
  const note = notes.find((note) => noteId === note.id)
  note.isPinned = !note.isPinned
  _sortByPinned(notes)
  _saveToStorage(notes)
  return Promise.resolve(notes)
}
function _sortByPinned(notes) {
  return notes.sort((a, b) => {
    if (a.isPinned && !b.isPinned) {
      return -1
    }
    if (!a.isPinned && b.isPinned) {
      return 1
    }
  })
}

function _sortByChecked(todo) {
  return todo.sort((a, b) => {
    if (!a.isChecked && b.isChecked) {
      return -1
    }
    if (!a.isChecked && b.isChecked) {
      return 1
    }
  })
}
