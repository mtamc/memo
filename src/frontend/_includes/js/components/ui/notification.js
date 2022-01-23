const { html, css } = Utils
const { initComponent, appendContent } = Components

const Notification = (message) => initComponent({
  content: ({ id }) => html`
    <div id="${id}"class="notification">
      ${message}
    </div>
  `,
  initializer: ({ id }) => {
    $(`#${id}`).click(() => {
      $(`#${id}`).remove()
    })
  },
  style: () => css`
    .notification {
      cursor: pointer;
      display: none;
      position: fixed;
      top: 20px;
      left: 50%;
      background: white;
      border-radius: 5px;
      z-index: 9999999999999999999999999;
      transform: translateX(-50%);
      width: 90vw;
      max-width: 600px;
      padding: 15px 30px;
      box-shadow: 1px 1px 5px rgba(0,0,0,.4);
    }
  `
})

const showNotification = (message, style) => {
  const id = appendContent('body', Notification(message, style))
  const notif = $('#' + id)
  notif.fadeIn(100)
  setTimeout(() => {
    notif.remove()
  }, 5000)
}

Components.UI.showNotification = showNotification
