const col = (title, field, options) => ({ title, field, ...options })

const initTable = (id, data, settings) =>
  $(id).bootstrapTable({ ...settings, data })

const wikipediaLinkFormatter = (title) => `
  <a href="http://en.wikipedia.org/wiki/Special:Search?search=${title}&go=Go">${title}</a>
`

Tables = {
  col,
  initTable,
  wikipediaLinkFormatter
}
