const { html, css } = Utils
const { initComponent } = Components
const { TextInput } = Components.UI

const ExternalFields = ({ commonMetadata: data, overrides }, type) => {
  const get = (prop) => overrides?.[prop] ?? data?.[prop]

  return initComponent({
    content: ({ include }) => html`
      <div id="external-fields" style="width: 200px">
        ${include([
          Input('Title', 'title', get('englishTranslatedTitle')),
          Input('Original title', 'original-title',
            get('originalTitle') === get('englishTranslatedTitle')
              ? ''
              : get('originalTitle') || ''
          ),
          Input('Release year', 'release-year', get('releaseYear'), 'number'),
          Input(`Duration (${
            type === 'books'    ? 'pages' :
            type === 'tv_shows' ? 'minutes per ep' :
            /* type films */      'minutes'
          })`, 'duration', type === 'games' ? (get('duration')??0)/60 : get('duration')),
          Input('Image URL', 'image-url', get('imageUrl')),
          Input('Genres (comma-separated)', 'genres', get('genres')?.join(', ')),
          ...(
            type === 'films' ? [
              Input('Director(s) (comma-separated)', 'directors', get('directors')?.join(', ')),
              Input('Actors (comma-separated)', 'actors', get('actors')?.join(', ')),
            ] : type === 'books' ? [
              Input('Author(s) (comma-separated)', 'authors', get('authors')?.join(', ')),
            ] : type === 'games' ? [
              Input('Platforms (comma-separated)', 'platforms', get('platforms')?.join(', ')),
              Input('Studios (comma-separated)', 'studios', get('studios')?.join(', ')),
              Input('Publishers (comma-separated)', 'publishers', get('publishers')?.join(', ')),
            ] : /* type === 'tv_shows' */ [
              Input('Director(s) (comma-separated)', 'directors', get('directors')?.join(', ')),
              Input('Actors (comma-separated)', 'actors', get('actors')?.join(', ')),
              Input('Episodes', 'episodes', get('episodes')),
            ]
          ),
        ])}
      </div>
    `
  })
}

Components.List.ExternalFields = ExternalFields

///////////////////////////////////////////////////////////////////////////////

const Input = (label, id, defaultValue, type) => initComponent({
  content: ({ include }) => html`
    <div style="margin: 15px 0">
      ${include(TextInput({ label, id, defaultValue, type }))}
    </div>
  `
})
