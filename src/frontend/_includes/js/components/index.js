const initComponent = ({ content, initializer, style }) => {
  let includeList = []

  const include = (component) => {
    const unwrapped = access(component)
    includeList = [...includeList, unwrapped]
    return unwrapped.content
  }

  const id = uniqueId()

  if ($('head style').length === 0) {
    $('head').prepend('<style></style>')
  }
  // TODO: Avoid appending same style multiple times
  $('head style').append(style?.({ id }))

  return private({
    id,
    content: content({ id, include }),
    initializer: () => {
      initializer?.({ id })
      includeList.forEach(({ initializer, id }) => {
        initializer?.({ id })
      })
    },
  })
}

const setContent = (selector, component) => {
  const { content, initializer } = access(component)
  $(selector).html(content)
  initializer?.()
}

Components = {}
Components.initComponent = initComponent
Components.setContent = setContent
Components.Home = {}

///////////////////////////////////////////////////////////////////////////////

const componentPropAccessor = Symbol()

const private = (component) => ({ [componentPropAccessor]: component })

const access = (component) => component[componentPropAccessor]

const uniqueId = () => '_' + Math.random().toString(36).substring(2, 9)

