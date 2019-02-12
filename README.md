[![npm package](https://img.shields.io/npm/v/demo-loader.svg)](https://www.npmjs.com/package/demo-loader)
[![npm downloads](https://img.shields.io/npm/dw/demo-loader.svg)](https://www.npmjs.com/package/demo-loader)
[![licence](https://img.shields.io/npm/l/demo-loader.svg)](https://opensource.org/licenses/MIT)

`demo-loader` is a webpack loader that loads the original source of a javascript module together with a related markdown file, and attaches them to the exports of the module.

# Usage
Install the loader with `npm install --save-dev demo-loader`. Then configure webpack by adding a rule, for example

```javascript
module.exports = {
    // other config
    rules: [{
        test: /\.demo.js$/,
        exclude: /node_modules/,
        use: [{
            loader: "demo-loader"
        }, {
            loader: "babel-loader",
        }]
    }]
}
```

&hellip;or you can use the webpack inline loader syntax:

```javascript
import SimpleDemo from 'demo-loader!./demos/Simple.demo';
```

## Accessing raw source
After setting up your loader, you can import the raw source from the module like this:

```javascript
import { __source__ } from 'demo-loader!./demos/Simple.demo';

console.log(__source__);
```

&hellip;or as a field on the default export (if one exists):

```javascript
import SimpleDemo from 'demo-loader!./demos/Simple.demo';

console.log(SimpleDemo.__source__);
```

## Accessing demo markup
The loader will look for a file with the same name, but ending in `.md` instead of `.js` (or `.mjs` or `.es6` or `.jsx`), and expose the contents in the same way:

```javascript
import { __markdown__ } from 'demo-loader!./demos/Simple.demo';

console.log(__markdown__);
```

&hellip;or

```javascript
import SimpleDemo from 'demo-loader!./demos/Simple.demo';

console.log(SimpleDemo.__markdown__);
```

If no markdown file is found, the value of `__markdown__` will just be an empty string.

`demo-loader` adds the markdown file to the dependency tree, so changes to the markdown will trigger a re-build if you're using webpack in watch mode.
