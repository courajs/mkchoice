const assert = require('assert');
const findInitialSelection = require('../lib/find-initial-selection');

describe("findInitialSelection()", function() {
  it("finds the selected option", function() {
    let args = {
      choices: ['feature', 'master'],
      selection: 'master'
    };
    assert.strictEqual(findInitialSelection(args), 1);
  });

  it("allows numerical selection", function() {
    let args = {
      choices: ['feature', 'master'],
      selection: '1'
    };
    assert.strictEqual(findInitialSelection(args), 1);
  });

  it("prefers a value match", function() {
    let args = {
      choices: ['3', '2', '1'],
      selection: '2'
    };
    assert.strictEqual(findInitialSelection(args), 1);
  });

  it("clamps numerical selection", function() {
    let args = {
      choices: ['3', '2', '1'],
      selection: '9'
    };
    assert.strictEqual(findInitialSelection(args), 2);
  });

  it("defaults to zero", function() {
    let args = {
      choices: ['master', 'their-branch']
    };
    assert.strictEqual(findInitialSelection(args), 0);

    args = {
      choices: ['master', 'their-branch'],
      selection: 'my-branch'
    };
    assert.strictEqual(findInitialSelection(args), 0);
  });
});
