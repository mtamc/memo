const { html, css } = Utils
const { Button } = Components.UI
const { updateEntry, createEntry, deleteEntry } = Netlify
const { typeToAPIType } = Tables

const DeleteButton = (type, data) => Button({
  label: 'Delete',
  style: ({ id }) => css`
    #${id} {
      ${buttonStyle('#e0480e')}
      margin-left: 5px;
    }
  `,
  onClick: () => {
    deleteEntry(type, data.dbRef)
      .map(() => location.reload())
      .mapErr((err) => showNotification(`Error deleting this entry: ${err}`)
      )
  }
})

const SubmitButton = (type, data, isEdit) => Button({
  label: isEdit ? 'Edit entry' : "Add entry",
  style: ({ id }) => css`
    #${id} {
      ${buttonStyle('#0E9CE0')}
      margin-right: 5px;
    }
  `,
  onClick: () =>
    (isEdit
      ? updateEntry(type, data.dbRef, generateEntry(data, type))
      : createEntry(type, generateEntry(data, type))
    )
      .map(() => location.reload())
      .mapErr((err) =>
        showNotification(
          `Error ${isEdit ? 'editing' : 'adding'} this entry: ${err}`
        )
      ),
})

Components.List.SubmitButton = SubmitButton
Components.List.DeleteButton = DeleteButton

///////////////////////////////////////////////////////////////////////////////

const buttonStyle = (color) => `
  margin: auto;
  cursor: pointer;
  padding: 10px 30px;
  background: ${color};
  border-radius: 7px;
  color: white;
  border: 0;
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
  display: inline-block;
`

const getCommaSeparated = (id) => $(`#${id}`).val().split(',').map(x => x.trim())

const getInt = (id) => parseInt($(`#${id}`).val()) || undefined

const generateEntry = (data, type) => ({
  commonMetadata: data?.commonMetadata ?? {
    entryType: typeToAPIType[type],
    englishTranslatedTitle: $('#title').val(),
    originalTitle: $('#original-title').val(),
    apiRefs: [],
    releaseYear: getInt('release-year'),
    duration: getInt('duration'),
    imageUrl: $('#image-url').val(),
    genres: getCommaSeparated('genres'),
    ...(
      type === 'films' ? {
        staff: getCommaSeparated('staff'),
      } : type === 'books' ? {
        authors: getCommaSeparated('authors'),
      } : type === 'games' ? {
        platforms: getCommaSeparated('platforms'),
        studios: getCommaSeparated('studios'),
        publishers: getCommaSeparated('publishers'),
      } : /* type === 'tv_shows' */ {
        staff: getCommaSeparated('staff'),
        episodes: getInt('episodes'),
      }
    ),
  },
  status: $('#status').val(),
  score: parseInt($('#score').val()) || undefined,
  completedDate: Date.parse($('#completed-date').val()) || undefined,
  review: $('#review').val(),
  ...(
    type === 'films'
      ? {}
      : { startedDate: Date.parse($('#started-date').val()) || undefined }
  ),
  ...(
    type === 'tv_shows'
      ? { progress: getInt('progress') }
      : {}
  ),
})

