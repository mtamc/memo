const { html } = Utils
const { initComponent } = Components

const UsernameSetter = () => initComponent({
  content: ({ id }) => html`
    <label for="${id}-input">Pick a username to start using Memo.</label><br>
    <input type="text" id="${id}-input"><br>
    <a id="${id}-submit">Submit</a>
    <div id="${id}-error"></div>
  `,
  initializer: ({ id }) => {
    $(`#${id}-submit`).click(() => {
      $(`#${id}-submit`).hide()
      const newName = $(`#${id}-input`).val()
      Netlify.setName(newName)
        .map((resp) => {
          if (resp.error) {
            console.log(resp.error)
            $(`#${id}-error`).html(`${resp.error}: ${resp.context ?? ''}`)
            $(`#${id}-submit`).show()
          } else {
            setTimeout(() => location.reload(), 100)
          }
        })
    })
  }
})

Components.Home.UsernameSetter = UsernameSetter
