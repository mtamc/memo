const { html, css } = Utils
const { initComponent } = Components
const { Button } = Components.UI

const InputWithAction = ({ label, btnLabel, onSubmit, style }) => initComponent({
  content: ({ id, include }) => html`
    <label for="${id}-input">${label ?? ""}</label><br>
    <input type="text" id="${id}-input">
    ${include(Button({
      relatedInputIdOrIds: `${id}-input`,
      label: btnLabel,
      onClick: onSubmit
    }))}
  `,
  style: () => css`
    ${style ?? ''}
  `
})

const TextInput = ({ label, id, defaultValue, type }) => initComponent({
  content: () => html`
    <div>
      <label for="${id}">${label}</label><br>
      <input type="${type ?? 'text'}" id="${id}" value="${defaultValue ?? ''}">
    </div>
  `
})

Components.UI.InputWithAction = InputWithAction
Components.UI.TextInput = TextInput
