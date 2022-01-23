const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification, TextInput, Button } = Components.UI
const { searchWorks, retrieveWork } = Netlify
const { typeToTitle, statusToTitle } = Tables

const AddEntryButton = (type) => initComponent({
  content: ({ include }) => include(Modal({
    title: "Add an entry",
    content: AddEntryModal(type),
    openButtonHtml: () => html`
      <h2 class="text-center" id="add-entry">
        <i class="far fa-plus-square"></i><span id="add-entry-text">Add an entry</span>
      </h2>
    `
  })),
  style: () => `
    #add-entry {
      color: #0e9ce0;
      cursor: pointer;
      top: 20px;
      position: relative;
    }
    #add-entry-text {
      margin-left: 15px;
      position: relative;
      top: -1px;
    }
    #add-entry:hover {
      text-decoration: underline;
    }
    @media (max-width: 475px) {
      #add-entry {
        margin-bottom: 50px;
      }
    }
  `,
})

Components.List.AddEntryButton = AddEntryButton

///////////////////////////////////////////////////////////////////////////////

const AddEntryModal = (type) => initComponent({
  content: ({ include }) => html`
    ${include(InputWithAction({
      label: `Search ${typeToTitle[type]}`,
      btnLabel: "Search",
      onSubmit: (query) => {
        searchWorks('films', query)
          .map((results) =>
            setContent('#search-results', SearchResults(type, results))
          )
          .mapErr(showNotification)
      }
    }))}
    <hr>
    <div id="search-results"></div>
  `
})

const SearchResults = (type, results) => initComponent({
  content: ({ include }) => html`
    <div id="search-results">
      ${results.length > 0
        ? results.map((r) => include(Result(type, r))).join('')
        : '<i>No results found for this query...</i>'
      }
    </div>
  `
})

const Result = (type, { title, year, imageUrl, ref }) => initComponent({
  content: ({ id }) => html`
    <div id="${id}" class="search-result">
      <div class="search-result-img"><img src="${imageUrl || '/img/mawaru.png'}"></div>
      <div class="search-result-title">${title}${year ? ' (' + year + ')' : ''}</div>
    </div>
  `,
  style: () => css`
    .search-result {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin: 4px 0;
      padding: 4px;
    }
    .search-result-img {
      width: 25px;
      height: 35px;
    }
    .search-result-img img {
      object-fit: cover;
      width: 25px;
      height: 35px;
      border-radius: 5px;
    }
    .search-result-title {
      margin-left: 7px;
    }
    .search-result:nth-child(odd) {
      background: #efefef;
      border-radius: 5px;
    }
  `,
  initializer: ({ id }) => {
    $(`#${id}`).click(() => {
      setContent('#search-results', WithRemoteData({
        remoteData: retrieveWork(type, ref),
        component: (data) => NewEntryForm(type, data)
      }))
    })
  }
})

// TODO: break this up? put this in separate file?
const NewEntryForm = (type, data) => initComponent({
  content: ({ id, include }) => html`
    <div id="submit-button-add-entry-wrapper">
      ${include(Button({
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
          Netlify.createEntry(type, log({
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
      }))}
    </div>
    <div id="add-entry-fields">
      <div id="external-fields" style="width: 200px">
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Title</div>
          <div>${data.englishTranslatedTitle}</div>
        </div>
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Original title</div>
          <div>${data.originalTitle === data.englishTranslatedTitle ? '' : data.originalTitle}</div>
        </div>
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Release year</div>
          <div>${data.releaseYear}</div>
        </div>
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Duration (minutes)</div>
          <div>${data.duration}</div>
        </div>
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Genres</div>
          <div>${data.genres.join(', ')}</div>
        </div>
        <div style="margin: 15px 0">
          <div style="font-weight: bold">Staff</div>
          <div>${data.staff.join(', ')}</div>
        </div>
      </div>
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
      <div id="third-column-add-entry">
        <img
          id="external-img"
          src="${data.imageUrl}"
          alt="${data.englishTranslatedTitle} cover"
        />
      </div>
    </div>
  `,
  initializer: () => {
    // new Litepicker({ element: document.getElementById('started-date') })
    new Litepicker({ element: document.getElementById('completed-date') })
  },
  style: () => css`
    #add-entry-fields {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    #add-entry-fields > * {
      margin-bottom: 30px;
    }
    #personal-fields {
    }
    #third-column-add-entry {
      flex-shrink: 4;
      text-align: center;
      max-width: 200px;
    }
    #submit-button-add-entry-wrapper {
      text-align: center;
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
