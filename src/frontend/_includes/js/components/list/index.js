const { html, css } = Utils
const { initComponent, Error404, WithRemoteData } = Components
const { col, initTable, typeToTitle, detailFormatter, allColumns, byStatus, statuses, entryTypeToExtraColumns, statusToTitle } = Tables
const { getUserIdFromName, getEntries, toData } = Netlify
const { getNameFromUrl, getEntryTypeFromUrl } = Http

const ListPage = () => initComponent({
  content: ({ include }) => include(
    typeToTitle[getEntryTypeFromUrl()]
      ? WithRemoteData(getUserIdFromName(getNameFromUrl()),
        ({ data }) => data
          ? List(getNameFromUrl())
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
          ${include(ListPageHeader(typeToTitle[getEntryTypeFromUrl()]))}
          <hr>
        </div>
          ${include(WithRemoteData(
            getEntries(getEntryTypeFromUrl(), username),
            (resp) => SubLists(getEntryTypeFromUrl(), toData(resp))
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
  detailFormatter,
  icons: 'icons',
  iconsPrefix: 'fa',
  search: true,
  showColumns: true,
  sortName: 'Score',
  sortOrder: 'desc',
  columns: [
    ...allColumns(),
    ...entryTypeToExtraColumns(entryType)
  ]
})
