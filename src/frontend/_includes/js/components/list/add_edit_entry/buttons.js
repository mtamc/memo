const { html, css } = Utils
const { Button } = Components.UI
const { updateEntry, createEntry, deleteEntry } = Netlify
const { typeToAPIType } = Tables
const { isArray } = Array

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
      : createEntry(type, log(generateEntry(data, type)))
    )
      .map(() => location.reload())
      .mapErr((err) =>
        showNotification(
          `Error ${isEdit ? 'editing' : 'adding'} this entry: ${err}`
        )
      ),
})

const log = x => (console.log(JSON.stringify(x)), x)
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
  commonMetadata: data?.commonMetadata ?? emptyMetadata(type),
  overrides: getOverrides(data?.commonMetadata, type),
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

const emptyMetadata = (type) => ({
  entryType: typeToAPIType[type],
  englishTranslatedTitle: 'N/A',
  apiRefs: []
})

const getOverrides = (api, type) => {
  const englishTranslatedTitle = getIfDifferent(api?.englishTranslatedTitle, $('#title').val())
  return {
    englishTranslatedTitle,
    originalTitle: getIfDifferent(api?.originalTitle, $('#original-title').val()) ?? englishTranslatedTitle,
    releaseYear: getIfDifferent(api?.releaseYear, getInt('release-year')),
    duration: getIfDifferent(api?.duration, getInt('duration')),
    imageUrl: getIfDifferent(api?.imageUrl, $('#image-url').val()),
    genres: getIfDifferent(api?.genres, getCommaSeparated('genres')),
    ...(
      type === 'films' ? {
        directors: getIfDifferent(api?.directors, getCommaSeparated('directors')),
        actors: getIfDifferent(api?.actors, getCommaSeparated('actors')),
      } : type === 'books' ? {
        authors: getIfDifferent(api?.authors, getCommaSeparated('authors')),
      } : type === 'games' ? {
        platforms: getIfDifferent(api?.platforms, getCommaSeparated('platforms')),
        studios: getIfDifferent(api?.studios, getCommaSeparated('studios')),
        publishers: getIfDifferent(api?.publishers, getCommaSeparated('publishers')),
      } : /* type === 'tv_shows' */ {
        directors: getIfDifferent(api?.directors, getCommaSeparated('directors')),
        actors: getIfDifferent(api?.actors, getCommaSeparated('actors')),
        episodes: getIfDifferent(api?.episodes, getInt('episodes')),
      }
    )
  }
}

const getIfDifferent = (apiVal, userVal) => {
  const areEqual = isArray(apiVal) ? areArraysIdentical : (a, b) => a === b
  return areEqual(apiVal, userVal) ? undefined : (userVal || undefined)
}

const areArraysIdentical = (arr1, arr2) =>
  arr1.length === arr2.length && arr1.every((el, i) => arr2[i] === el)
