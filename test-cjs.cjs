require('./register.cjs');

console.log('🧪 CommonJS Test\n');

setTimeout(() => {
  try {
    throw new Error('Test CJS error');
  } catch (err) {
    console.error('Caught error:', err);
  }
}, 100);

setTimeout(() => {
  console.log('\n✅ CommonJS test completed successfully!');
  process.exit(0);
}, 500);
