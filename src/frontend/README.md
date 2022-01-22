The filenames in this directory define the frontend routes. How should the file
content be?

```
---
title: Home
layout: layouts/base.njk
---

TdMemoPage = Components.Home.HomePage
```

`Components.Home.HomePage` is simply a JavaScript global object defined in
`_includes/js/components/home/index.js`. By assigning TdMemoPage to it,
the page content will be set to that component. Refer to the README at
`_includes/js/components/` to learn more about what TdMemo components
are.
