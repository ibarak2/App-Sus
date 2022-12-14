import { noteService } from '../services/note.service.js'
import { NoteTypeBtns } from './note-type-btns.jsx'

export class NoteAdd extends React.Component {

  //---- states ----//
  state = {
    key: '',
    isActive: false,
    noteType: 'note-txt',
    noteInfo: {
      title: '',
      txt: '',
      url: '',
      todo: [''],
    },
  }

  //---- created and attached to React elements via the ref attribute ----//
  inputRef = React.createRef()

  //---- getting the values for the curecct inputs on add new note ----//
  handleChange = ({ target }) => {
    const value = target.value
    const field = target.name

    this.setState((prevState) => ({
      ...prevState,
      noteInfo: { ...prevState.noteInfo, [field]: value },
    }))
  }

  //---- submiting new note with currect values ----//
  onAddNote = (ev) => {
    ev.preventDefault()
    const note = this.state
    if (
      !note.noteInfo.title.length &&
      !note.noteInfo.txt.length &&
      !note.noteInfo.url.length &&
      !note.noteInfo.todo.length
    )
      return
    noteService.addNote(note)
      .then(
        this.setState({
          key: '',
          isActive: false,
          noteType: 'note-txt',
          noteInfo: {
            title: '',
            txt: '',
            url: '',
            todo: [''],
          },
        })
      )
      .then(this.props.loadNotes)
      .then(this.onExpandInput(false))
  }

  //---- showing title input and content input when focusing on content input ----//
  onExpandInput = (ev, isOpen) => {
    if (ev.relatedTarget) return
    this.setState({ isActive: isOpen })
  }

  //---- opening both inputs (title and content) for the clicked note type button ----//
  onChangeType = (ev) => {
    ev.preventDefault()

    this.onExpandInput(ev, true)
    const value = ev.target.value
    this.setState((prevState) => ({ ...prevState, noteType: value }))
    this.inputRef.current.focus()
  }

  //---- for to-do note only ----//
  clearTodoLine = () => {
    const { todo } = this.state.noteInfo
    return todo.filter((task) => {
      return task !== ''
    })
  }
  handleChangeTodo = (ev, idx) => {
    let { todo } = this.state.noteInfo
    todo[idx] = ev.target.value
    todo = this.clearTodoLine()
    this.handleChange({ target: { value: todo, name: 'todo' } })
    todo.push('')
    this.setState({ todo })
  }

  //---- rendering new note inputs and buttons ----//
  render() {
    const { txt, title, url, todo } = this.state.noteInfo
    const { isActive, noteType, key } = this.state
    return (
      <div className="note-add">
        <form
          onSubmit={this.onAddNote}
          onBlur={(ev) => {
            this.onExpandInput(ev, true)
          }}
        >
          <input
            className={`note-add-title ${isActive ? '' : 'hide'}`}
            type="text"
            name="title"
            autoComplete="off"
            placeholder="Title"
            value={title}
            onChange={this.handleChange}
          />

          {noteType === 'note-txt' && (
            <input
              key={key}
              name="txt"
              autoComplete="off"
              type="text"
              placeholder="Take a note..."
              value={txt}
              onFocus={(ev) => this.onExpandInput(ev, true)}
              onChange={this.handleChange}
              ref={this.inputRef}
            />
          )}
          {noteType === 'note-img' && (
            <input
            key={key}
              name="url"
              autoComplete="off"
              type="text"
              placeholder="Enter Image URL"
              value={url}
              onFocus={(ev) => this.onExpandInput(ev, true)}
              onChange={this.handleChange}
              ref={this.inputRef}
            />
          )}
          {noteType === 'note-todo' &&
            todo.map((task, idx) => (
              <input
                key={idx}
                name="todo"
                autoComplete="off"
                type="text"
                placeholder="List item"
                value={task}
                className="todo-line"
                onFocus={(ev) => this.onExpandInput(ev, true)}
                onChange={(ev) => this.handleChangeTodo(ev, idx)}
                ref={this.inputRef}
              />
            ))}
          {noteType === 'note-video' && (
            <input
              name="url"
              autoComplete="off"
              type="text"
              placeholder="Enter Video URL"
              value={url}
              onFocus={(ev) => this.onExpandInput(ev, true)}
              onChange={this.handleChange}
              ref={this.inputRef}
            />
          )}
          {isActive && (
            <div className="form-actions">
              <button className="note-create-btn">Create</button>
            </div>
          )}
        </form>
        <NoteTypeBtns onChangeType={this.onChangeType} />
      </div>
    )
  }
}
