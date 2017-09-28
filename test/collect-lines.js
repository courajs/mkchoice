const assert = require('assert');
const stream = require('stream');
const collect = require('../lib/collect-lines');

describe("The stream lines collector", function() {
  it("resolves to an array of lines", async function() {
    let stdin = new stream.PassThrough();
    stdin.write('a');
    stdin.write('\nb\nc');
    let lines = collect(stdin);
    stdin.end('at');
    assert.deepEqual(await lines, ['a', 'b', 'cat']);
  });
});
