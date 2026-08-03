const colors = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
};

function cleanStack(stackOrError) {
  if (!stackOrError) return '';

  const stack = typeof stackOrError === 'string' 
    ? stackOrError 
    : (stackOrError?.stack || String(stackOrError));

  const lines = stack.split(/\r?\n/);
  
  if (lines.length <= 1) {
    return colors.red(stack);
  }

  const errorMessage = lines[0];
  const stackLines = lines.slice(1);

  const shouldFilter = (line) => {
    if (!line.trim()) return false;
    if (line.includes('node_modules')) return true;
    if (line.includes('node:internal')) return true;
    if (line.includes('(internal/')) return true;
    if (line.includes('<anonymous>')) return true;
    if (line.match(/\(node:[a-z_]+/)) return true;
    return false;
  };

  const cleanedLines = stackLines
    .filter(line => !shouldFilter(line))
    .map(line => {
      if (line.trim().startsWith('at ')) {
        return colors.yellow(line);
      }
      return line;
    });

  if (cleanedLines.length === 0) {
    return colors.red(errorMessage);
  }

  return colors.red(errorMessage) + '\n' + cleanedLines.join('\n');
}

function cleanError(error) {
  if (error && typeof error === 'object' && error.stack) {
    return {
      ...error,
      name: error.name,
      message: error.message,
      stack: cleanStack(error.stack)
    };
  }
  return error;
}

module.exports = cleanStack;
module.exports.cleanStack = cleanStack;
module.exports.cleanError = cleanError;
module.exports.default = cleanStack;