const { cleanStack } = require('./index.cjs');[cite: 3]

if (process.env.NODE_ENV === 'production') {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ [clean-error-stack] WARNING: clean-error-stack is registered in a PRODUCTION environment. ' +
    'It is recommended to use this package only during development (NODE_ENV=development).'
  );
} else {
  const originalPrepareStackTrace = Error.prepareStackTrace;[cite: 3]

  Error.prepareStackTrace = (error, structuredStackTrace) => {[cite: 3]
    let stack;[cite: 3]
    if (originalPrepareStackTrace) {[cite: 3]
      stack = originalPrepareStackTrace(error, structuredStackTrace);[cite: 3]
    } else {
      const name = error.name || 'Error';[cite: 3]
      const message = error.message || '';[cite: 3]
      const header = message ? `${name}: ${message}` : name;[cite: 3]
      
      const frames = structuredStackTrace.map(frame => `    at ${frame.toString()}`);[cite: 3]
      stack = header + '\n' + frames.join('\n');[cite: 3]
    }
    
    return cleanStack(stack);[cite: 3]
  };

  process.on('uncaughtException', (error) => {[cite: 3]
    console.error('\n💥 Uncaught Exception:\n');[cite: 3]
    console.error(cleanStack(error));[cite: 3]
    console.error('\n');[cite: 3]
  });

  process.on('unhandledRejection', (reason) => {[cite: 3]
    console.error('\n⚠️  Unhandled Promise Rejection:\n');[cite: 3]
    
    if (reason instanceof Error) {[cite: 3]
      console.error(cleanStack(reason));[cite: 3]
    } else {
      console.error(reason);[cite: 3]
    }
    
    console.error('\n');[cite: 3]
  });
}