/** The magic function to create and compose components */
const initComponent = ({ content, initializer, style }) => {
  let includeList = []

  // Include the component HTML inside another, but also remember to
  // include that component's JS/initializer inside the parent's
  // This function is provided as a parameter to `content`
  const include = (component) => {
    const unwrapped = access(component)
    includeList = [...includeList, unwrapped]
    return unwrapped.content
  }

  // Generate a identifier unique to that component's instance
  // This is passed to `content`, `initializer` and `style`
  const id = uniqueId()

  // Create <style> tag if none exists
  const styleTag = $('head style')
  if (styleTag.length === 0) {
    $('head').prepend('<style></style>')
  }

  // Add the component style to the site if it has not already
  const componentStyle = style?.({ id })
  if (!styleTag.html().includes(componentStyle)) {
    styleTag.first().append(componentStyle)
  }

  return private({
    id,
    content: content({ id, include }),
    // We create a new initializer that also contains the child initializers
    initializer: () => {
      // This component's initializer, with the unique id passed into it
      initializer?.({ id })

      // The child components' initializers
      includeList.forEach(({ initializer, id }) => {
        initializer?.({ id })
      })
    },
  })
}

/** Imperative way to replace an element inner HTML with a component */
const setContent = (selector, component) => {
  const { content, initializer } = access(component)
  // Set the inner HTML to the component's content
  $(selector).html(content)
  // Run the component's initializer
  initializer?.()
}

Components = {}
Components.initComponent = initComponent
Components.setContent = setContent
Components.UI = {}
Components.Home = {}
Components.Profile = {}
Components.List = {}

///////////////////////////////////////////////////////////////////////////////

/** Hide component internals to force consumers to use initComponent/include */
const componentPropAccessor = Symbol()
const private = (component) => ({ [componentPropAccessor]: component })
const access = (component) => component[componentPropAccessor]

const uniqueId = () => '_' + Math.random().toString(36).substring(2, 9)

