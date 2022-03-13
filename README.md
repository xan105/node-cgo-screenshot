About
=====

Take a screenshot of the active display in .png

Example
=======

```js
import { screenshot } from "@xan105/screenshot";
screenshot("./path/to/file.png").then(console.log).catch(console.error);
```

Install
=======

```
npm install @xan105/screenshot
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) starting with version 2.0.0.<br />
Previous version(s) are CommonJS (CJS) with an ESM wrapper.

## Named export

#### `screenshot(filePath: string, overwrite?: boolean): Promise<string>`

Take a screenshot in .png at given location.<br/>
Doesn't overwrite if it already exists (default) unless you set overwrite to true.<br/>
Returns png filepath.<br/>

NB: filepath extension will be enforced to '.png'
