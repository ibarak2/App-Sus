import { NoteEditor } from './note-editor.jsx'
import { NoteAdd } from './note-add.jsx'

export function NoteVideo(props) {
  const { note, onChangeNoteColor, onDeleteNote, onDuplicateNote } = props

  function convertUrl() {
    if (note.info.url.includes('youtube.com')) {
      const videoId = note.info.url.slice(32, 43) //key # = from 33rd character on
      const embed = 'https://www.youtube.com/embed/' + videoId //Add youtube link before key #
      return embed
    }
  }

  return (
    <div className="note-video-container">
      <button
        className={`fa-solid fa-thumbtack pin-btn video ${
          props.isPinned ? 'pinned' : ''
        }`}
        onClick={(ev) => props.onPin(ev, note.id)}
      ></button>
      <iframe
        width="99%"
        height="300px"
        src={convertUrl()}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="note-img-description">
        {note.info.title && <h4>{note.info.title}</h4>}
        <NoteEditor
          noteId={note.id}
          onChangeNoteColor={onChangeNoteColor}
          onDeleteNote={onDeleteNote}
          onDuplicateNote={onDuplicateNote}
        />
      </div>
    </div>
  )
}

///////////////////

// const createIframeLink = () => {
//   if (videoUrl.charAt(12) == 'y') {    //if the 13th character = y (youtube videos)
//     videoId = videoUrl.substring(32)   //key # = from 33rd character on
//     let embed = 'https://www.youtube.com/embed/' + videoId    //Add youtube link before key #
//     return embed
//   }
// }
