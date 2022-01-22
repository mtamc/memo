const { initComponent } = Components

const Error404 = () => initComponent({
  content: () => `Page not found...`
})

Components.Error404 = Error404
