const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification, TextInput, Button } = Components.UI
const { createEntry } = Netlify
const { statusToTitle, typeToAPIType } = Tables

const NewEntryForm = (type, data) => initComponent({
  content: ({ include }) => html`
    <div id="submit-button-add-entry-wrapper">
      ${include(AddEntryButton(type, data))}
    </div>
    <div id="add-entry-fields">
      ${include([
        ExternalFields(data, type),
        PersonalFields(type),
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

Components.List.NewEntryForm = NewEntryForm

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
    const log = x => (console.log(JSON.stringify(x)), x)
    createEntry(type, log({
      commonMetadata: data ?? {
        entryType: typeToAPIType[type],
        englishTranslatedTitle: $('#title').val(),
        originalTitle: $('#original-title').val(),
        apiRefs: [],
        releaseYear: parseInt($('#release-year').val()) || undefined,
        duration: parseInt($('#duration').val()) || undefined,
        imageUrl: $('#image-url').val(),
        genres: $('#genres').val().split(',').map(x => x.trim()),
        ...(
          type === 'films' ? {
            staff: $('#staff').val().split(',').map(x => x.trim()),
          } : type === 'books' ? {
            authors: $('#authors').val().split(',').map(x => x.trim()),
          } : type === 'games' ? {
            platforms: $('#platforms').val().split(',').map(x => x.trim()),
            studios: $('#studios').val().split(',').map(x => x.trim()),
            publishers: $('#publishers').val().split(',').map(x => x.trim()),
          } : /* type === 'tv_shows' */ {
            staff: $('#staff').val().split(',').map(x => x.trim()),
            episodes: parseInt($('#episodes').val()) || undefined,
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

const ExternalFields = (data, type) => initComponent({
  content: ({ include }) => html`
    <div id="external-fields" style="width: 200px">
      ${include(data ? [
        ExternalField('Title', data.englishTranslatedTitle),
        ExternalField(
          'Original title',
          data.originalTitle == data.englishTranslatedTitle ? '' : data.originalTitle
        ),
        ExternalField('Release year', data.releaseYear),
        ExternalField('Duration (minutes)', data.duration),
        ExternalField('Genres', data.genres.join(', ')),
        ...(
          type === 'films' ? [
            ExternalField('Staff', data.staff.join(', ')),
          ] : type === 'books' ? [
            ExternalField('Author(s)', data.authors.join(', ')),
          ] : type === 'games' ? [
            ExternalField('Platforms', data.platforms.join(', ')),
            ExternalField('Studios', data.studios.join(', ')),
            ExternalField('Publishers', data.publishers.join(', ')),
          ] : /* type === 'tv_shows' */ [
            ExternalField('Staff', data.staff.join(', ')),
            ExternalField('Episodes', data.episodes),
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

const PersonalFields = (type) => initComponent({
  content: () => html`
    <div id="personal-fields">
      <div style="margin: 15px 0">
        <label for="status">Status</label><br>
        <select name="status" id="status">
          <option value="InProgress">${statusToTitle(type, 'InProgress')}</option>
          <option value="Completed">${statusToTitle(type, 'Completed')}</option>
          <option value="Dropped">${statusToTitle(type, 'Dropped')}</option>
          <option value="Planned">${statusToTitle(type, 'Planned')}</option>
        </select>
      </div>
      <div style="margin: 15px 0">
        <label for="score">Score</label><br>
        <select name="score" id="score" value="10">
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
            <label for="completed-date">Started Date</label><br>
            <input data-toggle="datepicker" id="started-date">
          </div>
        `
        : ''
      }
      <div style="margin: 15px 0">
        <label for="completed-date">Completed Date</label><br>
        <input data-toggle="datepicker" id="completed-date">
      </div>
      <div style="margin: 15px 0">
        <label for="review">Review</label><br>
        <textarea id="review" name="review" rows="4" cols="21"></textarea>"
      </div>
    </div>
  `,
  initializer: () => {
    new Litepicker({ element: document.getElementById('started-date') })
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
