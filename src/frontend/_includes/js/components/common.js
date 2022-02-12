const { initComponent } = Components

const Error404 = () => initComponent({
  content: () => `Page not found`
})

const Redirect = (url) => initComponent({
  content: () => '',
  initializer: () => {
    window.location.href = url
  }
})

const Nothing = () => initComponent({ content: () => '' })

const Div = (content) => initComponent({ content: () => content })

const Markdown = (mdText) => initComponent({
  content: () => DOMPurify.sanitize(marked.parse(mdText))
})


Components.Error404 = Error404
Components.Redirect = Redirect
Components.Nothing = Nothing
Components.Div = Div
Components.Markdown = Markdown
