const { html, css } = Utils
const { initComponent } = Components
const { TextInput } = Components.UI

const ExternalFields = ({ commonMetadata }, type) => initComponent({
  content: ({ include }) => html`
    <div id="external-fields" style="width: 200px">
      ${include(commonMetadata ? [
        ExternalField('Title', commonMetadata.englishTranslatedTitle),
        ExternalField(
          'Original title',
          commonMetadata.originalTitle == commonMetadata.englishTranslatedTitle
            ? ''
            : commonMetadata.originalTitle
        ),
        ExternalField('Release year', commonMetadata.releaseYear),
        ExternalField('Duration (minutes)', commonMetadata.duration),
        ExternalField('Genres', commonMetadata.genres?.join(', ')),
        ...(
          type === 'films' ? [
            ExternalField('Director(s)', commonMetadata.directors?.join(', ')),
            ExternalField('Actors', commonMetadata.actors?.join(', ')),
          ] : type === 'books' ? [
            ExternalField('Author(s)', commonMetadata.authors?.join(', ')),
          ] : type === 'games' ? [
            ExternalField('Platforms', commonMetadata.platforms?.join(', ')),
            ExternalField('Studios', commonMetadata.studios?.join(', ')),
            ExternalField('Publishers', commonMetadata.publishers?.join(', ')),
          ] : /* type === 'tv_shows' */ [
            ExternalField('Director(s)', commonMetadata.directors?.join(', ')),
            ExternalField('Actors', commonMetadata.actors?.join(', ')),
            ExternalField('Episodes', commonMetadata.episodes, 'episodes'),
          ]
        ),
      ] : [
        Input('Title', 'title'),
        Input('Original title', 'original-title'),
        Input('Release year', 'release-year'),
        Input('Duration (minutes)', 'duration'),
        Input('Image URL', 'image-url'),
        Input('Genres (comma-separated)', 'genres'),
        ...(
          type === 'films' ? [
            Input('Director(s) (comma-separated)', 'directors'),
            Input('Actors (comma-separated)', 'actors'),
          ] : type === 'books' ? [
            Input('Author(s) (comma-separated)', 'authors'),
          ] : type === 'games' ? [
            Input('Platforms (comma-separated)', 'platforms'),
            Input('Studios (comma-separated)', 'studios'),
            Input('Publishers (comma-separated)', 'publishers'),
          ] : /* type === 'tv_shows' */ [
            Input('Director(s) (comma-separated)', 'directors'),
            Input('Actors (comma-separated)', 'actors'),
            Input('Episodes', 'episodes'),
          ]
        ),
      ])}
    </div>
  `
})

Components.List.ExternalFields = ExternalFields

///////////////////////////////////////////////////////////////////////////////

const ExternalField = (label, content, id) => initComponent({
  content: () => html`
    <div style="margin: 15px 0">
      <div style="font-weight: bold">${label}</div>
      <div id="${id ?? ''}">${content}</div>
    </div>
  `
})

const Input = (label, id) => initComponent({
  content: ({ include }) => html`
    <div style="margin: 15px 0">
      ${include(TextInput({ label, id }))}
    </div>
  `
})

