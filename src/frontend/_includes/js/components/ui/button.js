const { html, css } = Utils
const { initComponent } = Components
const { isArray } = Array

/** You can pass a single input ID or an array of { name, inputId } */
const Button = ({ style, label, relatedInputIdOrIds, onClick }) => initComponent({
  content: ({ id }) => html`
    <button id="${id}">${label ?? "Submit"}</button>
  `,
  style: style ?? (() => ''),
  initializer: ({ id }) => {
    $(`#${id}`).off('click', '**')
    $(`#${id}`).click(() => {
      // Disable button for a second to prevent accidental multiclicks
      $(`#${id}`).prop('disabled',true)
        setTimeout(() => {
          $(`#${id}`).prop('disabled',false)
      }, 1000)

      // Run onSubmit callback with the input value(s) (if any)
      if (relatedInputIdOrIds) {
        const value = isArray(relatedInputIdOrIds)
          ? relatedInputIdOrIds.map(({ name, inputId }) => ({
            [name]: $(`#${inputId}`).val()
          }))
          : $(`#${relatedInputIdOrIds}`).val()
        onClick(value)
      } else {
        onClick()
      }
    })

    // Trigger onclick onenter too if a related input Id is provided
    if (relatedInputIdOrIds) {
      if (isArray(relatedInputIdOrIds)) {
        relatedInputIdOrIds.forEach(({ inputId }) => {
          $(`#${inputId}`).keypress(triggerClick(id))
        })
      } else {
        $(`#${relatedInputIdOrIds}`).keypress(triggerClick(id))
      }
    }
  }
})

Components.UI.Button = Button

///////////////////////////////////////////////////////////////////////////////

const ENTER_KEY_CODE = 13

const triggerClick = (btnId) => ({ which }) => {
  if (which == ENTER_KEY_CODE) {
    $(`#${btnId}`).trigger('click')
    return false
  }
}
