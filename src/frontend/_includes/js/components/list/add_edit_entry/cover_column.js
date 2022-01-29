const { html, css } = Utils
const { initComponent } = Components

const CoverColumn = (data) => initComponent({
  content: () => html`
    <div id="third-column-add-entry">
      <img
        id="external-img"
        src="${data?.commonMetadata.imageUrl ?? '/img/mawaru.png'}"
        alt="${data?.commonMetadata.englishTranslatedTitle ?? ''} cover"
      />
    </div>
  `,
  style: () => css`
    #third-column-add-entry {
      flex-shrink: 4;
      text-align: center;
      max-width: 200px;
    }
    #external-img {
      max-width: 100%;
      margin-top: 50px;
      border-radius: 10px;
      box-shadow: 2px 2px 5px rgba(0,0,0,.5)
    }
  `
})

Components.List.CoverColumn = CoverColumn
