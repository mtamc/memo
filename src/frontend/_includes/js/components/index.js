/** The magic function to create and compose components */
const initComponent = ({ content, initializer, style }) => {
  let includeList = []

  /**
   * Include the component HTML inside another, but also remember to
   * include that component's JS/initializer inside the parent's
   * This function is provided as a parameter to `content`
   */
  const include = (component) => {
    const unwrapped = access(component)
    includeList = [...includeList, unwrapped]
    return unwrapped.content
  }

  /** Generate a identifier unique to that component's instance */
  const id = uniqueId()

  /** Create <style> tag if none exists */
  const styleTag = $('head style')
  if (styleTag.length === 0) {
    $('head').prepend('<style></style>')
  }

  /** Add the component style to the site if it has not already */
  const componentStyle = style?.({ id })
  if (!styleTag.html().includes(componentStyle)) {
    styleTag.append(componentStyle)
  }

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
Components.UI = {}
Components.Home = {}
Components.Summary = {}
Components.List = {}

///////////////////////////////////////////////////////////////////////////////

/** Hide component internals to force consumers to use initComponent/include */
const componentPropAccessor = Symbol()
const private = (component) => ({ [componentPropAccessor]: component })
const access = (component) => component[componentPropAccessor]

const uniqueId = () => '_' + Math.random().toString(36).substring(2, 9)

