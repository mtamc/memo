const { html, css } = Utils
const { initComponent } = Components

const CoverColumn = (data) => initComponent({
  content: () => html`
    <div id="third-column-add-entry">
      <img
        id="external-img"
        src="${data.overrides?.imageUrl ?? data.commonMetadata?.imageUrl ?? '/img/mawaru.png'}"
        alt="${data?.commonMetadata.englishTranslatedTitle ?? ''} cover"
      />
      ${(data.commonMetadata?.externalUrls?.length ?? 0) > 0
        ? html`
          <div id="external-links">
            <b>External links</b><br>
            ${data.commonMetadata.externalUrls
              .map(({ name, url }) => `<a href="${url}">${name}</a><br>`)
              .join('')}
          </div>
        `
        : ''
      }
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
    #external-links {
      margin-top: 25px;
    }
  `
})

Components.List.CoverColumn = CoverColumn
