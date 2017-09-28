#!/usr/bin/env node

process.stdin.setRawMode(true);

process.stdin.on('data', function(chunk) {
  if (chunk.length === 1 && chunk[0] === 3) {
    console.log('interrupt');
    process.exit(1);
  } else if (chunk.length === 1 && chunk[0] === 4) {
    console.log('EOF');
    process.exit(0);
  }
  console.log('data', chunk);
});
