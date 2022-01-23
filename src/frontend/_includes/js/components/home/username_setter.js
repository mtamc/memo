const { html } = Utils
const { initComponent } = Components
const { InputWithAction, showNotification } = Components.UI

const UsernameSetter = () => initComponent({
  content: ({ include }) => include(InputWithAction({
    label: "Pick a username to start using Memo.",
    btnLabel: "Submit",
    onSubmit: (newName) => {
      Netlify.setName(newName)
        .map((resp) => {
          if (resp.error) {
            showNotification('This username is already taken.')
          } else {
            setTimeout(() => location.reload(), 100)
          }
        })
    }
  }))
})

Components.Home.UsernameSetter = UsernameSetter
