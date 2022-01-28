const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification, TextInput, Button } = Components.UI
const { createEntry } = Netlify
const { statusToTitle, typeToAPIType } = Tables

const EntryForm = (type, data) => initComponent({
  content: ({ include }) => html`
    <div id="submit-button-add-entry-wrapper">
      ${include(AddEntryButton(type, data))}
    </div>
    <div id="add-entry-fields">
      ${include([
        ExternalFields(data ?? {}, type),
        PersonalFields(data ?? {}, type),
        ThirdColumn(data)
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

Components.List.EntryForm = EntryForm

///////////////////////////////////////////////////////////////////////////////

const AddEntryButton = (type, data) => Button({
  label: "Add entry",
  style: ({ id }) => css`
    #${id} {
      margin: auto;
      cursor: pointer;
      padding: 10px 30px;
      background: #0E9CE0;
      border: 3px solid white;
      border-radius: 7px;
      color: white;
      font-weight: bold;
      font-size: 17px;
      margin-bottom: 10px;
      display: inline-block;
    }
  `,
  onClick: () => {
    createEntry(type, log({
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
    }))
      .map(() => location.reload())
      .mapErr((err) => showNotification(`Error adding this entry: ${err}`))
  },
})

const log = x => (console.log(JSON.stringify(x)), x)
const ExternalFields = ({ commonMetadata }, type) => {
  console.log(type)
  return initComponent({
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
        ExternalField('Genres', commonMetadata.genres.join(', ')),
        ...(
          type === 'films' ? [
            ExternalField('Staff', commonMetadata.staff.join(', ')),
          ] : type === 'books' ? [
            ExternalField('Author(s)', commonMetadata.authors.join(', ')),
          ] : type === 'games' ? [
            ExternalField('Platforms', commonMetadata.platforms.join(', ')),
            ExternalField('Studios', commonMetadata.studios.join(', ')),
            ExternalField('Publishers', commonMetadata.publishers.join(', ')),
          ] : /* type === 'tv_shows' */ [
            ExternalField('Staff', commonMetadata.staff.join(', ')),
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
}

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
        <select name="status" id="status" value=${data.status ?? "InProgress"}>
          <option value="InProgress">${statusToTitle(type, 'InProgress')}</option>
          <option value="Completed">${statusToTitle(type, 'Completed')}</option>
          <option value="Dropped">${statusToTitle(type, 'Dropped')}</option>
          <option value="Planned">${statusToTitle(type, 'Planned')}</option>
        </select>
      </div>
      <div style="margin: 15px 0">
        <label for="score">Score</label><br>
        <select name="score" id="score" value=${data.score ?? "10"}>
          <option value="10">10</option>
          <option value="9">9</option>
          <option value="8">8</option>
          <option value="7">7</option>
          <option value="6">6</option>
          <option value="6">6</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      ${type !== 'films'
        ? html`
          <div style="margin: 15px 0">
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
      <div style="margin: 15px 0">
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
        <label for="review">Review</label><br>
        <textarea id="review" name="review" rows="4" cols="21"></textarea>"
      </div>
    </div>
  `,
  initializer: () => {
    if (document.getElementById('started-date')) {
      new Litepicker({ element: document.getElementById('started-date') })
    }
    new Litepicker({ element: document.getElementById('completed-date') })
  }
})

const ThirdColumn = (data) => initComponent({
  content: () => html`
    <div id="third-column-add-entry">
      <img
        id="external-img"
        src="${data?.imageUrl ?? '/img/mawaru.png'}"
        alt="${data?.englishTranslatedTitle ?? ''} cover"
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
