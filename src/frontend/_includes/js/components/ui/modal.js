const { html, css } = Utils
const { initComponent, appendContent } = Components

const Modal = ({ title, content, openButtonHtml }) => initComponent({
  content: ({ id, include }) => html`
    <div id="${id}">${openButtonHtml({ include, id })}</div>
  `,
  initializer: ({ id }) => {
    $(`#${id}`).click(() => {
      appendContent('body', Modal_({ title, content }))
    })
  }
})

const Modal_ = ({ title, content }) => initComponent({
  content: ({ id, include }) => html`
    <div id=${id}>
      ${include(Overlay(id))}
      <div id="td-modal-window-${id}" class="td-modal-window">
        ${include(ModalHeader(title, id))}
        <div id="td-modal-content-wrapper-${id}" class="td-modal-content-wrapper">
          <div class="td-modal-content">
            ${include(content)}
          </div>
        </div>
      </div>
    </div>
  `,
  style: () => css`
    .td-modal-window {
      //display: none;
      position: fixed;
      box-shadow: 1px 1px 10px rgba(0,0,0,.4);
      top: 50%;
      left: 50%;
      z-index: 99;
      padding: 50px;
      transform: translate(-50%, -50%);
      overflow: hidden;
      background: #fff;
      border-radius: 5px;
      width: min(90%, 850px);
      height:min(90%, 850px);
    }
    .td-modal-content-wrapper {
      margin-top: 30px;
      height: calc(100% - 60px);
      overflow: auto;
    }
    .td-modal-content {
      width: calc(100% - 7px);
    }
    .td-modal-content-wrapper::-webkit-scrollbar-track
    {
      background-color: white;
    }
    .td-modal-content-wrapper::-webkit-scrollbar
    {
      width: 7px;
      background-color: #F5F5F5;
    }
    .td-modal-content-wrapper::-webkit-scrollbar-thumb
    {
      background-color: #E5E5E5;
      border-radius: 3px;
    }
  `,
})

Components.UI.Modal = Modal
Components.UI.Modal_ = Modal_

////////////////////////////////////////////////////////////////////////////////

const ModalHeader = (title, parentId) => initComponent({
  content: ({ include }) => html`
    <div class="td-modal-header modal-header">
      <div class="td-modal-title">${title}</div>
      ${include(CloseButton(parentId))}
    </div>
  `,
  style: () => css`
    .td-modal-title {
      position: absolute;
      top: 27px;
      left: 60px;
      font-size: 27px;
    }
  `
})

const Overlay = (parentId) => initComponent({
  content: () => html`
    <div id="overlay-${parentId}"></div>
  `,
  style: () => css`
    #overlay-${parentId} {
      //display: none;
      position: fixed;
      top: 0;
      left: 0;
      background: black;
      opacity: .2;
      z-index: 98;
      width: 100vw;
      height: 100vh;
    }
  `,
  initializer: () => {
    $(`#overlay-${parentId}`).click(() => {
      closeModal(parentId)
    })
  }
})

const CloseButton = (parentId) => initComponent({
  content: () => html`
    <div id="cancel-button-${parentId}" class="cancel-button"><i class="fas fa-window-close"></i></div>
  `,
  style: () => `
    .cancel-button {
      cursor: pointer;
      color: #0E9CE0;
      font-weight: bold;
      font-size: 40px;
      position: absolute;
      top: 18px;
      right: 60px;
      
    }
  `,
  initializer: () => {
    $(`#cancel-button-${parentId}`).click(() => {
      closeModal(parentId)
    })
  }
})

const closeModal = (parentId) => {
  $(`#td-modal-window-${parentId}`).fadeOut(200)
  $(`#overlay-${parentId}`).hide()
  $(`#${parentId}`).remove()
}
