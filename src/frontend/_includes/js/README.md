We don't have a JS bundling pipeline, so we're creating
global variables. Every file in this directory must be added to
`src/frontend/_includes/layouts/base.njk`. Mind include order
as modules may only use objects from modules which have been
included before them.
