const { html } = Utils
const { initComponent, Menu } = Components

const Base = (title, content) => initComponent({
  content: ({ include }) => html`
    <div class="container">
      <div class="row" style="padding:20px">
        ${include(Menu())}
        <div class="col-xs-12 col-sm-9 col-md-9">
          <div class="row"> <h1>${title}</h1> </div>
          <hr>
          <div id="content">
            ${include(content)}
          </div>
          <hr>
        </div>
      </div>
    </div>
  `
})

Components.Base = Base
