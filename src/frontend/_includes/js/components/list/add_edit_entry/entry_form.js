/**
 * This file is fairly large, should probably be
 * refactored into multiple files?
 */
const { html, css } = Utils
const { initComponent } = Components
const { SubmitButton, DeleteButton, ExternalFields, PersonalFields, CoverColumn } = Components.List

const EntryForm = (type, data) => {
  const isEdit = data?.status ?? false
  return initComponent({
    content: ({ include }) => html`
      <div id="submit-button-add-entry-wrapper">
        ${include(SubmitButton(type, data, isEdit))}
        ${isEdit ? include(DeleteButton(type, data)) : ''}
      </div>
      <div id="add-entry-fields">
        ${include([
          ExternalFields(data ?? {}, type),
          PersonalFields(data ?? {}, type),
          CoverColumn(data),
        ])}
      </div>
    `,
    style: () => css`
      #add-entry-fields {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      #submit-button-add-entry-wrapper {
        text-align: center;
      }
    `
  })
}

Components.List.EntryForm = EntryForm
