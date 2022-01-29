const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification, TextInput, Button } = Components.UI
const { updateEntry, createEntry, deleteEntry } = Netlify
const { statusToTitle, typeToAPIType } = Tables

const EntryForm = (type, data) => {
  const isEdit = data?.status ?? false
  return initComponent({
    content: ({ include }) => html`
      <div id="submit-button-add-entry-wrapper">
        ${include(SubmitButton(type, data, isEdit))}
        ${isEdit ? include(DeleteButton(type, data)) : ''}
      </div>
      <div id="add-entry-fields">
        ${include([
          ExternalFields(data ?? {}, type),
          PersonalFields(data ?? {}, type),
          ThirdColumn(data),
        ])}
      </div>
    `,
    style: () => css`
      #add-entry-fields {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      #add-entry-fields > * {
        margin-bottom: 30px;
      }
      #submit-button-add-entry-wrapper {
        text-align: center;
      }
    `
  })
}

Components.List.EntryForm = EntryForm

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
      .mapErr((err) =>
        showNotification(
          `Error deleting this entry: ${err}`
        )
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
  onClick: () => {
    const entry = {
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
      )
    }

    ;(isEdit ? updateEntry(type, data.dbRef, entry) : createEntry(type, entry))
      .map(() => location.reload())
      .mapErr((err) =>
        showNotification(
          `Error ${isEdit ? 'editing' : 'adding'} this entry: ${err}`
        )
      )
  },
})

const ExternalFields = ({ commonMetadata }, type) => initComponent({
  content: ({ include }) => html`
    <div id="external-fields" style="width: 200px">
      ${include(commonMetadata ? [
        ExternalField('Title', commonMetadata.englishTranslatedTitle),
        ExternalField(
          'Original title',
          commonMetadata.originalTitle == commonMetadata.englishTranslatedTitle
            ? ''
            : commonMetadata.originalTitle
        ),
        ExternalField('Release year', commonMetadata.releaseYear),
        ExternalField('Duration (minutes)', commonMetadata.duration),
        ExternalField('Genres', commonMetadata.genres?.join(', ')),
        ...(
          type === 'films' ? [
            ExternalField('Staff', commonMetadata.staff?.join(', ')),
          ] : type === 'books' ? [
            ExternalField('Author(s)', commonMetadata.authors?.join(', ')),
          ] : type === 'games' ? [
            ExternalField('Platforms', commonMetadata.platforms?.join(', ')),
            ExternalField('Studios', commonMetadata.studios?.join(', ')),
            ExternalField('Publishers', commonMetadata.publishers?.join(', ')),
          ] : /* type === 'tv_shows' */ [
            ExternalField('Staff', commonMetadata.staff?.join(', ')),
            ExternalField('Episodes', commonMetadata.episodes),
          ]
        ),
      ] : [
        Input('Title', 'title'),
        Input('Original title', 'original-title'),
        Input('Release year', 'release-year'),
        Input('Duration (minutes)', 'duration'),
        Input('Image URL', 'image-url'),
        Input('Genres (comma-separated)', 'genres'),
        ...(
          type === 'films' ? [
            Input('Staff (comma-separated)', 'staff'),
          ] : type === 'books' ? [
            Input('Author(s) (comma-separated)', 'authors'),
          ] : type === 'games' ? [
            Input('Platforms (comma-separated)', 'platforms'),
            Input('Studios (comma-separated)', 'studios'),
            Input('Publishers (comma-separated)', 'publishers'),
          ] : /* type === 'tv_shows' */ [
            Input('Staff (comma-separated)', 'staff'),
            Input('Episodes', 'episodes'),
          ]
        ),
      ])}
    </div>
  `
})

const ExternalField = (label, content) => initComponent({
  content: () => html`
    <div style="margin: 15px 0">
      <div style="font-weight: bold">${label}</div>
      <div>${content}</div>
    </div>
  `
})

const PersonalFields = (data, type) => initComponent({
  content: () => html`
    <div id="personal-fields">
      <div style="margin: 15px 0">
        <label for="status">Status</label><br>
        <select name="status" id="status">
          ${
            ['InProgress', 'Completed', 'Dropped', 'Planned']
              .map((status) => html`
                <option value="${status}" ${status == data.status ? 'selected' : ''}>
                  ${statusToTitle(type, status)}
                </option>
              `)
              .join('')
          }
        </select>
      </div>
      <div style="margin: 15px 0">
        <label for="score">${data.status === 'Planned' ? 'Preference' : 'Score'}</label><br>
        <select name="score" id="score">
          ${
            ['10','9','8','7','6','5','4','3','2','1']
              .map((num) => html`
                <option value="${num}" ${num == data.score ? 'selected' : ''}>
                  ${num}
                </option>
              `)
              .join('')
          }
        </select>
      </div>
      ${type !== 'films'
        ? html`
          <div
            id="started-date-container"
            style="margin: 15px 0; display: ${data.status !== 'Planned' ? 'block' : 'none'};}"
          >
            <label for="started-date">Started Date</label><br>
            <input
              data-toggle="datepicker"
              id="started-date"
              value=${
                data.startedDate
                  ? (new Date(data.startedDate)).toISOString().substring(0, 10)
                  : ''
              }
            >
          </div>
        `
        : ''
      }
      <div
        id="completed-date-container"
        style="margin: 15px 0; display: ${data.status === 'Completed' ? 'block' : 'none'};}"
      >
        <label for="completed-date">Completed Date</label><br>
        <input
          data-toggle="datepicker"
          id="completed-date"
          value=${
            data.completedDate
              ? (new Date(data.completedDate)).toISOString().substring(0, 10)
              : ''
          }
        >
      </div>
      <div style="margin: 15px 0">
        <label for="review">Comments</label><br>
        <textarea id="review" name="review" rows="4" cols="21">${data.review ?? ''}</textarea>
      </div>
    </div>
  `,
  initializer: () => {
    if (document.getElementById('started-date')) {
      new Litepicker({ element: document.getElementById('started-date') })
    }
    if (document.getElementById('completed-date')) {
      new Litepicker({ element: document.getElementById('completed-date') })
    }

    $('#status').on('change', () => {
      console.log('status changeld')
      console.log($('#status').val())
      if ($('#status').val() === 'Planned') {
        $('label[for="score"]').html('Preference')
        $('started-date').val('')
        $('#started-date-container').hide()
        $('completed-date').val('')
        $('#completed-date-container').hide()
      } else if ($('#status').val() === 'Dropped') {
        $('label[for="score"]').html('Score')
        $('#started-date-container').show()
        $('completed-date').val('')
        $('#completed-date-container').hide()
      } else if ($('#status').val() === 'Completed') {
        $('label[for="score"]').html('Score')
        $('#started-date-container').show()
        $('#completed-date-container').show()
      } else if ($('#status').val() === 'InProgress') {
        $('label[for="score"]').html('Score')
        $('#started-date-container').show()
        $('completed-date').val('')
        $('#completed-date-container').hide()
      }
        
    })
  }
})

const ThirdColumn = (data) => initComponent({
  content: () => html`
    <div id="third-column-add-entry">
      <img
        id="external-img"
        src="${data?.commonMetadata.imageUrl ?? '/img/mawaru.png'}"
        alt="${data?.commonMetadata.englishTranslatedTitle ?? ''} cover"
      />
    </div>
  `,
  style: () => css`
    #third-column-add-entry {
      flex-shrink: 4;
      text-align: center;
      max-width: 200px;
    }
    #external-img {
      max-width: 100%;
      margin-top: 50px;
      border-radius: 10px;
      box-shadow: 2px 2px 5px rgba(0,0,0,.5)
    }
  `
})

const Input = (label, id) => initComponent({
  content: ({ include }) => html`
    <div style="margin: 15px 0">
      ${include(TextInput({ label, id }))}
    </div>
  `
})

const getCommaSeparated = (id) => $(`#${id}`).val().split(',').map(x => x.trim())

const getInt = (id) => parseInt($(`#${id}`).val()) || undefined

const log = x => (console.log(JSON.stringify(x)), x)
