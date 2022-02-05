const { entryTypes, getEntries } = Netlify
const { col, initTable, typeToTitle, profileColumns } = Tables
const { html, css } = Utils
const { UsernameSetter } = Components.Profile
const { initComponent, WithRemoteData } = Components

const Biography = (userdata) => initComponent({
  content: ({ include }) => html`
    <h2>About ${userdata.username}</h2>
    <div>
      ${marked.parse(userdata.biography ?? `*${userdata.username} has not written anything yet!*`)}
    </div>
    <hr>
  `
})


Components.Profile.Biography = Biography

