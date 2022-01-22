const { html, css } = Utils
const { initComponent, Error404, WithRemoteData } = Components
const { col, initTable, linkFormatter, typeToTitle, detailFormatter, basicColumns, byStatus, statuses, entryTypeToExtraColumns, statusToTitle } = Tables
const { getUserIdFromName, getEntries, toData } = Netlify

const ListPage = () => initComponent({
  content: ({ include }) => include(
    typeToTitle[getEntryType()]
      ? WithRemoteData(getUserIdFromName(getName()),
        ({ data }) => data
          ? List(getName())
          : Error404()
      )
      : Error404()
  )
})

Components.List.ListPage = ListPage

///////////////////////////////////////////////////////////////////////////////

const List = (username) => initComponent({
  content: ({ include }) => html`
    <div class="container">
      <div class="row" style="padding:20px">
        <div class="col-xs-12 col-sm-12 col-md-12">
          ${include(ListPageHeader(typeToTitle[getEntryType()]))}
          <hr>
        </div>
          ${include(WithRemoteData(
            getEntries(getEntryType(), username),
            (resp) => SubLists(getEntryType(), toData(resp))
          ))}
      </div>
    </div>
  `
})

const ListPageHeader = (title) => initComponent({
  content: () => html`
    <div class="row">
      <h1><a href="/"><i class="fa fa-home"></i></a> ${title}</h1>
    </div>
  `
})

const SubLists = (entryType, data) => initComponent({
  content: ({ include }) => html`
    ${statuses
      .map((status) => include(SubList(status, entryType, data)))
      .join('')
    }
  `
})

const SubList = (status, entryType, data) => initComponent({
  content: ({ id }) => html`
    <div class="row">
      <div class="col-md-10 col-md-offset-1" style="margin-top: 50px">
        <h2 id="${id}-title" class="collapsible" style="margin-bottom: -30px">
          ${statusToTitle(entryType, status)}
        </h2>
        <table id="${id}-list"></table>
      </div>
    </div>
  `,
  initializer: ({ id }) => {
    initFullTable(`#${id}-list`, byStatus(status, data), entryType)
    $(`#${id}-title`).click(() => {
      $(`#${id}-title`).next().toggleClass('d-none')
      $(`#${id}-title`).toggleClass('is-collapsed')
    })
      
  }
})

const initFullTable = (selector, data, entryType) => initTable(selector, data, {
  detailView: true,
  detailView: true,
  detailFormatter,
  icons: 'icons',
  iconsPrefix: 'fa',
  search: true,
  showColumns: true,
  sortName: 'Score',
  sortOrder: 'desc',
  columns: [
    ...basicColumns,
    col('Genres', 'commonMetadata.genres', { sortable: true }),
    ...entryTypeToExtraColumns(entryType)
  ]
})

const getUrlTypeAndUser = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return [urlParams.get('type'), urlParams.get('user')]
}

const getEntryType = () => getUrlTypeAndUser()[0]

const getName = () => getUrlTypeAndUser()[1]
