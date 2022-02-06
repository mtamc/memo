const { getUserName, setBio } = Netlify
const { html, css } = Utils
const { initComponent, setContent } = Components
const { Button, showNotification } = Components.UI

const Biography = (userdata) => initComponent({
  content: ({ include }) => html`
    <h2 id="biography-heading">About ${userdata.username}</h2>
    <div id="biography-content">
      ${marked.parse(userdata.biography ?? `*${userdata.username} has not written anything yet!*`)}
    </div>
    <hr>
  `,
  initializer: () => {
    getUserName()
      .map(({ username }) => {
        if (username === userdata.username) {
          $('#biography-heading').append(' <i id="biography-edit" class="fas fa-edit"></i>')
          $('#biography-edit').click(() => {
            setContent('#biography-content', BiographyInput(userdata.biography))
          })
        }
      })
  },
  style: () => css`
    #biography-edit {
      font-size: 14px;
      vertical-align: middle;
      color: #0EA8EB;
      cursor: pointer;
    }
  `
})

Components.Profile.Biography = Biography

///////////////////////////////////////////////////////////////////////////////

const BiographyInput = (currentBio) => initComponent({
  content: ({ include }) => html`
    <textarea id="biography-input">${currentBio ?? ''}</textarea><br>
    ${include(Button({
      label: "Save",
      // TODO: the style is duplicated with add entry button, deduplicate
      style: ({ id }) => css`
        #${id} {
          margin: auto;
          margin-top: 10px;
          cursor: pointer;
          padding: 10px 30px;
          background: #0E9CE0;
          border-radius: 7px;
          color: white;
          border: 0;
          font-weight: bold;
          font-size: 17px;
          margin-bottom: 10px;
          display: inline-block;
        }
      `,
      onClick: () => setBio($('#biography-input').val())
        .map(() => location.reload())
        .mapErr((err) =>
          showNotification(`Error saving biography: ${err}`)
        )
    }))}
  `,
  style: () => css`
    #biography-input {
      width: 100%;
      min-height: 300px;
    }
  `
})
