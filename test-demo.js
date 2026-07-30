import 'clean-error-stack/register';

console.log('🧪 clean-error-stack Test Suite\n');
console.log('This file intentionally throws errors to demonstrate how the package works.\n');

function deepFunction3() {
  throw new Error('This is a synchronous error thrown from deepFunction3');
}

function deepFunction2() {
  deepFunction3();
}

function deepFunction1() {
  deepFunction2();
}

async function asyncDeepFunction() {
  const fs = await import('fs');
  return fs.promises.readFile('/nonexistent/file.txt', 'utf8');
}

console.log('📌 Test 1: Synchronous Error (in 1 second)');
setTimeout(() => {
  try {
    deepFunction1();
  } catch (err) {
    console.error('\n🔴 Caught Synchronous Error:\n');
    console.error(err);
    console.error('\n');
  }
}, 1000);

console.log('📌 Test 2: Asynchronous Error / Unhandled Rejection (in 3 seconds)');
setTimeout(() => {
  asyncDeepFunction();
}, 3000);

console.log('📌 Test 3: Uncaught Exception (in 5 seconds - process will exit)');
setTimeout(() => {
  throw new Error('This is an uncaught exception! Process will exit.');
}, 5000);

console.log('\n⏳ Tests running sequentially... Watch the console.\n');
