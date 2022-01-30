const { html, css } = Utils
const { getEntries, getUserName } = Netlify
const { col, initTable, typeToTitle, detailFormatter, allColumns, statuses, entryTypeToFullColumns, statusToTitle, editColumn } = Tables
const { initComponent, WithRemoteData, appendContent, Nothing } = Components
const { Modal_ } = Components.UI
const { AddEntryButton } = Components.List
const { getEntryTypeFromUrl, getNameFromUrl } = Http
const { EntryForm } = Components.List

const List = (username) => initComponent({
  content: ({ include }) => html`
    <div class="container">
      <div class="row" style="padding:20px">
        <div id="list-header">
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
    <div id="global-stats">
      <hr>
      ${toStats(data, entryType)}
    </div>
  `,
  style: () => `
    #global-stats {
      text-align: center;
      margin-top: 60px;
    }
    #global-stats i {
      margin: 0 10px;
      opacity: 0.7;
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
    <div class="summary-stats">
      ${toStats(data.filter((e) => e.status === status), entryType)}
    </div>
  `,
  initializer: ({ id }) => {
    getUserName()
      .map((resp) => resp?.username === getNameFromUrl())
      .unwrapOr(false)
      .then((isOwner) => {
        initFullTable(`#${id}-list`, data.filter((e) => e.status === status), entryType, isOwner, status)
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
      overflow-x: auto;
    }

    .fixed-table-header, .fixed-table-body {
      min-width: 550px;
    }

    @media (min-width: 615px) {
      div.fixed-table-body:hover {
        overflow-y: visible;
        overflow-x: visible;
      }

      div.fixed-table-container:hover {
        overflow-x: visible;
        overflow-y: visible;
      }
    }

    .summary-stats {
      text-align: center;
      font-size: 11px;
      margin-top: 11px;
    }

    .summary-stats i {
      margin: 0 10px;
      opacity: 0.7;
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
      ...entryTypeToFullColumns(entryType, status),
      ...(isOwner ? [Columns.edit()] : []),
    ]
  })
  window.editEntry = (data) => {
    appendContent('body', Modal_({
      title: "Edit an entry",
      content: EntryForm(entryType, data)
    }))
  }
}

const toStats = (entries, entryType) => {
  const icon = ' <i class="fas fa-wave-square"></i> '
  const totalEpsSeen = entries
    .map(e => e.progress ?? 0)
    .reduce((a,b) => a + b, 0)
  const scores = entries.filter(e => e.score).map(e => e.score)
  const meanScore = scores.reduce((a,b) => a+b, 0) / (scores.length || 1)
  const days =
    entryType === 'tv_shows'
      ? (entries
        .reduce((mins, e) => mins + (e.commonMetadata.duration ?? 0 * e.commonMetadata.episode ?? 0), 0)
      ) / 60 / 24
      : entryType === 'films'
      ? (entries
        .reduce((mins, e) => mins + (e.commonMetadata.duration ?? 0), 0)
      ) / 60 / 24
      : entryType === 'books'
      ? (entries
        .reduce((hours, e) => hours + (e.commonMetadata.duration ?? 0 / 50), 0)
      ) / 24
      : /* games */ (entries
        .reduce((mins, e) => mins + (e.commonMetadata.duration ?? 0), 0)
      ) / 60 / 24

  return `Total entries: ${entries.length}${entryType === 'tv_shows' ? ` ${icon} Episodes seen: ${totalEpsSeen}` : ''} ${icon} Days spent: ${days.toFixed(2)} ${icon} Mean score: ${meanScore.toFixed(2)}`
}

