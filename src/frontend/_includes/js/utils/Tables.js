const col = (field, title) => ({ field, title })

const createInitTableFunction = (settings) => (id, data) =>
  $(id).bootstrapTable({ ...settings, data })

Tables = {
  col,
  createInitTableFunction,
}
