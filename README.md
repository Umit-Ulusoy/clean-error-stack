# 🧹 clean-error-stack

> Clean up messy Node.js stack traces during development. Filter out `node_modules` and internal Node.js code. **Focus only on your code!** 🎯

[![npm version](https://img.shields.io/npm/v/clean-error-stack.svg)](https://www.npmjs.com/package/clean-error-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why?

Have you ever been frustrated by error messages that look like this?

```
Error: Something went wrong
    at Object.<anonymous> (/your-app/index.js:10:11)
    at Module._compile (node:internal/modules/cjs/loader:1159:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Function.Module._load (node:internal/modules/cjs/loader:878:12)
    at node_modules/express/lib/router/index.js:284:15
    at node_modules/express/lib/router/layer.js:95:5
    at node_modules/body-parser/index.js:73:21
    ...50+ more lines of framework internals...
```

**With clean-error-stack, you get:**

```
Error: Something went wrong
    at Object.<anonymous> (/your-app/index.js:10:11)
```

Clean, focused, and **clickable** in your terminal! 🎉

## ✨ Features

- ✅ **Automatic Filtering**: Removes `node_modules`, `node:internal`, `(internal/`, and `<anonymous>` lines
- 🎨 **Colored Output**: Error messages in red, stack traces in yellow using native ANSI codes
- 🔗 **Editor Integration**: File paths and line numbers preserved (clickable in VS Code!)
- ⚡ **Zero Configuration**: One-line import to activate
- 🛡️ **Production-Safe**: Automatically disabled in production environments
- 🪶 **Zero Dependencies**: Pure Node.js with no external packages required
- 🚀 **TypeScript Support**: Full type definitions included

## 📦 Installation

```bash
npm install clean-error-stack
```

## 🚀 Quick Start

### Automatic Mode (Recommended)

Add this single line at the **top** of your application's entry point:

```javascript
// index.js, app.js, or server.js
import 'clean-error-stack/register';

// That's it! All errors are now automatically cleaned
```

**Real-world example:**

```javascript
import 'clean-error-stack/register';
import express from 'express';

const app = express();

app.get('/error', (req, res) => {
  throw new Error('Oops! Something broke');
});

app.listen(3000);
```

When you hit `/error`, you'll see:
```
Error: Oops! Something broke
    at /project/src/app.js:6:9
```

Instead of 50+ lines of Express internals! 🎯

### Manual Mode

For fine-grained control over specific errors:

```javascript
import { cleanStack } from 'clean-error-stack';

try {
  dangerousOperation();
} catch (error) {
  console.error(cleanStack(error));
}
```

## 🎬 Before & After

### ❌ Before: Messy and Overwhelming

```
Error: User validation failed
    at validateUser (/app/services/user.js:45:11)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Server.<anonymous> (node:internal/http:1:1)
    at Module._compile (node:internal/modules/cjs/loader:1159:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Function.Module._load (node:internal/modules/cjs/loader:878:12)
    at node_modules/express/lib/router/index.js:284:15
    at node_modules/express/lib/router/layer.js:95:5
    at node_modules/express/lib/application.js:640:50
    at node_modules/body-parser/index.js:73:21
    at node_modules/compression/index.js:119:11
    ...40+ more lines...
```

### ✅ After: Clean and Actionable

```
Error: User validation failed
    at validateUser (/app/services/user.js:45:11)
```

You immediately see **where the problem is** in your code! 🎯

## 📖 Use Cases

### Express.js Application

```javascript
import 'clean-error-stack/register';
import express from 'express';

const app = express();

app.get('/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new Error('User not found');
  }
  res.json(user);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

### CLI Tools

```javascript
#!/usr/bin/env node
import 'clean-error-stack/register';
import { parseArgs } from 'util';
import { processFile } from './processor.js';

const args = parseArgs({ options: { file: { type: 'string' } } });
await processFile(args.values.file);
```

### Testing & Debugging

```javascript
import 'clean-error-stack/register';
import { test } from 'node:test';

test('should handle invalid input', async () => {
  await expect(processData(null)).rejects.toThrow();
});
```

## 📝 API Reference

### `cleanStack(stackOrError)`

Cleans a stack trace string or Error object.

**Parameters:**
- `stackOrError` (string | Error): Stack trace string or Error object

**Returns:** Cleaned and colored stack trace string

**Example:**

```javascript
import { cleanStack } from 'clean-error-stack';

try {
  riskyOperation();
} catch (error) {
  const cleaned = cleanStack(error.stack);
  console.log(cleaned);
}
```

### `cleanError(error)`

Cleans the stack trace of an Error object in-place.

**Parameters:**
- `error` (Error): Error object to clean

**Returns:** The same Error object with cleaned stack

**Example:**

```javascript
import { cleanError } from 'clean-error-stack';

const error = new Error('Something failed');
cleanError(error);
console.error(error);
```

## ⚙️ How It Works

The package employs three strategies to catch and clean all errors:

1. **`Error.prepareStackTrace` Override**: Intercepts stack trace generation at the source
2. **`uncaughtException` Handler**: Catches synchronous errors that weren't caught
3. **`unhandledRejection` Handler**: Catches async errors (unhandled Promise rejections)

**Filtering Logic:**
- Removes lines containing `node_modules`
- Removes Node.js internal modules (`node:internal`, `(internal/`)
- Removes anonymous functions (`<anonymous>`)
- Preserves file paths, line numbers, and column numbers for editor integration

## 🛡️ Production Safety

**This package only works in development mode.** When `NODE_ENV=production`, it does absolutely nothing.

Your production logs remain complete and unmodified for debugging and monitoring tools.

```bash
# Development mode (cleaning active)
npm run dev

# Production mode (cleaning disabled, original logs preserved)
NODE_ENV=production npm start
```

## 🧪 Testing

Run the included test suite:

```bash
npm test
```

The `test-demo.js` file demonstrates:
- ✅ Synchronous errors (caught)
- ✅ Asynchronous errors (unhandled rejections)
- ✅ Uncaught exceptions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT © [clean-error-stack contributors](LICENSE)

## 💡 Tips

- Add `import 'clean-error-stack/register'` as the **first line** in your entry point
- Works great with nodemon, ts-node, and other development tools
- Compatible with Node.js 14+
- Works in both ESM and CommonJS projects (this package uses ESM)
- **Zero dependencies** - Uses native Node.js ANSI color codes for terminal output

---

**Made with ❤️ for developers who deserve clean, readable error messages**

**Star ⭐ this repo if it saved you from scrolling through endless stack traces!**
