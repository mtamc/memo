const { html, css } = Utils
const { initComponent, setContent, WithRemoteData } = Components
const { Modal, InputWithAction, showNotification } = Components.UI
const { searchWorks } = Netlify
const { typeToTitle } = Tables
const { SearchResults } = Components.List

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

