const col = (title, field, options) => ({ title, field, ...options })

const initTable = (id, data, settings) =>
  $(id).bootstrapTable({ ...settings, data })

const wikipediaLinkFormatter = (title, row) => `
  <a href="http://en.wikipedia.org/wiki/Special:Search?search=${row.englishTranslatedTitle}&go=Go">${title}</a>
`

Tables = {
  col,
  initTable,
  wikipediaLinkFormatter
}
