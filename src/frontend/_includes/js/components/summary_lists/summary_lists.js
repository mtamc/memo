const { getUserName, entryTypes, getEntries, toData } = Netlify
const { col, initTable, typeToTitle, basicColumns } = Tables
const { html } = Utils
const { UsernameSetter } = Components.Summary
const { initComponent, WithRemoteData } = Components

const SummaryLists = (username) => initComponent({
  content: ({ include }) => html`
    <div class="row">
      ${entryTypes
        .map(type => include(SummaryList(username, type)))
        .join('')
      }
    </div>
  `
})


Components.Summary.SummaryLists = SummaryLists

///////////////////////////////////////////////////////////////////////////////

const SummaryList = (username, type) => initComponent({
  content: ({ include }) => html`
    <div class="col-md-6">
      <h3><a href="/list?type=${type}&user=${username}">${typeToTitle[type]}</a></h3>
      ${include(WithRemoteData({
        remoteData: getEntries(type, username),
        component: (resp) => SummaryTable(type, toData(resp))
      }))}
    </div>
  `
})

const SummaryTable = (type, data) => initComponent({
  content: () => html`
    <table id="summary-${type}"></table>
  `,
  initializer: () => {
    initSummaryTable(typeToCssId(type), data)
  }
})

const initSummaryTable = (selector, data) => initTable(selector, data, {
  iconsPrefix: 'fa',
  pagination: true,
  pageSize: 5,
  onlyInfoPagination: true,
  columns: basicColumns(),
})

const typeToCssId = (type) => `#summary-${type}`
