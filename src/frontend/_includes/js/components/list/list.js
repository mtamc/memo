const { html, css } = Utils
const { getEntries, getUserName } = Netlify
const { col, initTable, typeToTitle, detailFormatter, allColumns, statuses, entryTypeToExtraColumns, statusToTitle, editColumn } = Tables
const { initComponent, WithRemoteData, appendContent, Nothing } = Components
const { Modal_ } = Components.UI
const { AddEntryButton } = Components.List
const { getEntryTypeFromUrl, getNameFromUrl } = Http
const { EntryForm } = Components.List

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
            remoteData: getUserName().unwrapOr(null),
            component: (resp) =>
              resp?.username === getNameFromUrl()
                ? AddEntryButton(getEntryTypeFromUrl())
                : Nothing()
          }))}
          ${include(WithRemoteData({
            remoteData: getEntries(getEntryTypeFromUrl(), username),
            component: (entries) => SubLists(getEntryTypeFromUrl(), entries)
          }))}
      </div>
    </div>
  `,
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
        <h2 id="${id}-title" class="collapsible sublist-title">${statusToTitle(entryType, status)}</h2>
        <table id="${id}-list"></table>
      </div>
    </div>
  `,
  initializer: ({ id }) => {
    const relevantEntries = data.filter((e) => e.status === status)

    getUserName()
      .map((resp) => resp?.username === getNameFromUrl())
      .unwrapOr(false)
      .then((isOwner) => {
        initFullTable(`#${id}-list`, relevantEntries, entryType, isOwner, status)
        $(`#${id}-title`).click(() => {
          $(`#${id}-title`).next().toggle(200)
          $(`#${id}-title`).toggleClass('is-collapsed')
        })
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

const initFullTable = (selector, data, entryType, isOwner, status) => {
  initTable(selector, data, {
    detailView: true,
    detailFormatter,
    icons: 'icons',
    iconsPrefix: 'fa',
    search: true,
    showColumns: true,
    sortName: status === 'Planned' ? 'Preference' : 'Score',
    sortOrder: 'desc',
    columns: [
      ...allColumns(status),
      ...entryTypeToExtraColumns(entryType, status),
      ...(isOwner ? [editColumn()] : []),
    ]
  })
  if (isOwner) {
    $('.edit-button').each((_, btn) => {
      $(btn).get()[0].onclick = () => {
        appendContent('body', Modal_({
          title: "Edit an entry",
          content: EntryForm(entryType, $(btn).data('entry'))
        }))
        $(btn).attr('id')
      }
    })
  }
}
