const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification, TextInput, Button } = Components.UI
const { createEntry } = Netlify
const { statusToTitle } = Tables

const NewEntryForm = (type, data) => initComponent({
  content: ({ id, include }) => html`
    <div id="submit-button-add-entry-wrapper">
      ${include(AddEntryButton(type, data))}
    </div>
    <div id="add-entry-fields">
      ${include([
        ExternalFields(data),
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
    const log = x => (console.log(x), x)
    createEntry(type, log({
      commonMetadata: data,
      entryType: 'Film',
      status: $('#status').val(),
      score: parseInt($('#score').val()) || undefined,
      completedDate: Date.parse($('#completed-date').val()) || undefined,
      review: $('#review').val(),
    }))
      .map(() => location.reload())
      .mapErr((err) => showNotification(`Error adding this entry: ${err}`))
  },
})

const ExternalFields = (data) => initComponent({
  content: ({ include }) => html`
    <div id="external-fields" style="width: 200px">
      ${include([
        ExternalField('Title', data.englishTranslatedTitle),
        ExternalField(
          'Original title',
          data.originalTitle == data.englishTranslatedTitle ? '' : data.originalTitle
        ),
        ExternalField('Release year', data.releaseYear),
        ExternalField('Duration (minutes)', data.duration),
        ExternalField('Genres', data.genres.join(', ')),
        ExternalField('Staff', data.staff.join(', ')),
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
    // new Litepicker({ element: document.getElementById('started-date') })
    new Litepicker({ element: document.getElementById('completed-date') })
  }
})

const ThirdColumn = (data) => initComponent({
  content: () => html`
    <div id="third-column-add-entry">
      <img
        id="external-img"
        src="${data.imageUrl}"
        alt="${data.englishTranslatedTitle} cover"
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

const Input = (props) => initComponent({
  content: ({ include }) => html`
    <div style="margin: 15px 0">
      ${include(TextInput(props))}
    </div>
  `
})
