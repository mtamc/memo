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


Components.Error404 = Error404
Components.Redirect = Redirect
