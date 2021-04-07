Take a screenshot of the active display in .png

Install
-------

```
npm install @xan105/screenshot
```

Example
-------

```js
"use strict"

const screenshot = require("@xan105/screenshot");

screenshot("./path/to/file.png").then(console.log).catch(console.error);
```

API
---

`screenshot(string filepath, [bool overwrite = false]) <promise>string`

Take a screenshot in .png at given location.<br/>
Doesn't overwrite if it already exists (default) unless you set overwrite to true.<br/>
Returns png filepath.<br/>

NB: filepath extension will be enforced to '.png'
