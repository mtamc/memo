const { html } = Utils

const UsernameSetter = () => [
  html`
    <label for="new-name">Pick a username to start using Memo.</label><br>
    <input type="text" id="new-name"><br>
    <a id="submit-new-name">Submit</a>
    <div id="new-name-error"></div>
  `,
  () => {
    document.querySelector('#submit-new-name')
      .addEventListener('click', () => {
        Netlify.setName($('#new-name').val())
          .map(({error}) => error
            ? $('#new-name-error').html(`${error}`)
            : location.reload()
          )
      })
  }
]

Components.Home.UsernameSetter = UsernameSetter
