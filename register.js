import { cleanStack } from './index.js';

if (process.env.NODE_ENV === 'production') {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ [clean-error-stack] WARNING: clean-error-stack is registered in a PRODUCTION environment. ' +
    'It is recommended to use this package only during development (NODE_ENV=development).'
  );
} else {
  const originalPrepareStackTrace = Error.prepareStackTrace;

  Error.prepareStackTrace = (error, structuredStackTrace) => {
    let stack;
    if (originalPrepareStackTrace) {
      stack = originalPrepareStackTrace(error, structuredStackTrace);
    } else {
      const name = error.name || 'Error';
      const message = error.message || '';
      const header = message ? `${name}: ${message}` : name;
      
      const frames = structuredStackTrace.map(frame => `    at ${frame.toString()}`);
      stack = header + '\n' + frames.join('\n');
    }
    
    return cleanStack(stack);
  };

  process.on('uncaughtException', (error) => {
    console.error('\n💥 Uncaught Exception:\n');
    console.error(cleanStack(error));
    console.error('\n');
  });

  process.on('unhandledRejection', (reason) => {
    console.error('\n⚠️  Unhandled Promise Rejection:\n');
    if (reason instanceof Error) {
      console.error(cleanStack(reason));
    } else {
      console.error(reason);
    }
    console.error('\n');
  });
}