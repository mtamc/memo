const { initComponent, setContent, Div } = Components
const { html, css } = Utils
const { identity } = R

/**
 * pages = [
 *   { title: 'Tab title', component: MyComponent() },
 *   { title: 'Another tab title', component: SomethingElse() },
 * ]
 */
const Tabbed = ({ pages }) => initComponent({
  content: ({ id, include }) => html`
    <div id="${id}">
      <div class="tab-titles">
        ${include(pages.map(Title))}
      </div>
      <div class="tab-contents">
        ${include(pages.map(Content))}
      </div>
    </div>
  `,
  initializer: ({ id }) => {
    const showComponent = (data) => setContent(`#${id}`, component(data))
    const showError = (err) => setContent(`#${id}`, Div(`Error: ${err}`))

    if (remoteData instanceof NT.ResultAsync) {
      remoteData.map(showComponent).mapErr(showError)
    } else {
      remoteData.then(showComponent).catch(showError)
    }
  }
})

Components.WithRemoteData = WithRemoteData

///////////////////////////////////////////////////////////////////////////////

