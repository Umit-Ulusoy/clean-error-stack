import { cleanStack } from './index.js';

if (process.env.NODE_ENV === 'production') {
  process.exit(0);
}

const originalPrepareStackTrace = Error.prepareStackTrace;

Error.prepareStackTrace = (error, structuredStackTrace) => {
  let stack;
  if (originalPrepareStackTrace) {
    stack = originalPrepareStackTrace(error, structuredStackTrace);
  } else {
    const name = error.name || 'Error';
    const message = error.message || '';
    const header = message ? `${name}: ${message}` : name;
    
    const frames = structuredStackTrace.map(frame => {
      return `    at ${frame.toString()}`;
    });
    
    stack = header + '\n' + frames.join('\n');
  }
  
  return cleanStack(stack);
};

process.on('uncaughtException', (error) => {
  console.error('\n💥 Uncaught Exception:\n');
  console.error(cleanStack(error));
  console.error('\n');
  process.exit(1);
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
