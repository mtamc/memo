const { html, css } = Utils
const { getEntries, toData } = Netlify
const { col, initTable, typeToTitle, detailFormatter, allColumns, byStatus, statuses, entryTypeToExtraColumns, statusToTitle } = Tables
const { initComponent, WithRemoteData } = Components
const { getEntryTypeFromUrl } = Http

const List = (username) => initComponent({
  content: ({ include }) => html`
    <div class="container">
      <div class="row" style="padding:20px">
        <div class="col-xs-12 col-sm-12 col-md-12">
          ${include(
            ListPageHeader(typeToTitle[getEntryTypeFromUrl()], username)
          )}
        </div>
          ${include(WithRemoteData({
            remoteData: getEntries(getEntryTypeFromUrl(), username),
            component: (resp) => SubLists(getEntryTypeFromUrl(), toData(resp))
          }))}
      </div>
    </div>
  `
})

Components.List.List = List

///////////////////////////////////////////////////////////////////////////////

const ListPageHeader = (title, username) => initComponent({
  content: () => html`
    <div class="row">
      <h1><a href="/profile/?user=${username}"><i class="fa fa-home"></i></a> ${title}</h1>
    </div>
    <hr>
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
      <div class="col-md-10 col-md-offset-1 sublist-wrapper">
        <h2 id="${id}-title" class="collapsible sublist-title">
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
      
  },
  style: () => css`
    .sublist-wrapper {
      margin-top: 50px
    }

    .sublist-title {
      margin-bottom: -30px
    }
    @media (max-width: 475px) {
      .sublist-wrapper {
        margin-top: 0
      }

      .sublist-title {
        margin-bottom: 0
      }
    }

    .fixed-table-container {
      overflow: auto;
    }

    .fixed-table-header, .fixed-table-body {
      min-width: 550px;
    }
  `
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
