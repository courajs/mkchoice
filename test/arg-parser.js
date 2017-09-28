const assert = require('assert');
const parseArgs = require('../lib/parse-args');

describe("The argument parser", function() {
  it("returns simple options", function() {
    let r = parseArgs(['a', 'b']);
    assert.deepEqual(r.choices, ['a', 'b']);
  });

  it("returns options after -- with no processing", function() {
    let r = parseArgs(['a', '--', '-h', '-p', '-', '--']);
    assert.deepEqual(r.choices, ['a', '-h', '-p', '-', '--']);
  });

  it("interprets help flags", function() {
    let r = parseArgs(['a', '--help']);
    assert.ok(r.shouldHelp, "It recognizes the long flag");

    r = parseArgs(['-h', 'a']);
    assert.ok(r.shouldHelp, "It recognizes the short flag");
  });

  it("defaults the prompt", function() {
    let r = parseArgs(['a']);
    assert.equal(r.prompt, 'Choose one:');
  });

  it("parses a given prompt", function() {
    let r = parseArgs(['a', '-p', 'Well...?', 'b']);
    assert.equal(r.prompt, 'Well...?', "It extracts the prompt");
    assert.deepEqual(r.choices, ['a', 'b'], "It doesn't include the prompt flag in the choices");
    assert.deepEqual(parseArgs(['-p', 'hey']), parseArgs(['--prompt', 'hey']), "The short & long flags are treated equivalently");
  });

  it("interprets the vanish flag", function() {
    let r = parseArgs(['a']);
    assert.equal(r.shouldVanish, false, 'Vanish is off by default');

    r = parseArgs(['a', '-v']);
    assert.equal(r.shouldVanish, true, 'The flag enables it');

    assert.deepEqual(r, parseArgs(['a', '--vanish']), 'The long and short flags are treated the same');
  });

  it("Returns whether - should be substituted with stdin", function() {
    let r = parseArgs(['a', '-']);
    assert.equal(r.shouldSubstituteStdin, true, "- before -- should substitute");

    r = parseArgs(['a', '--', '-']);
    assert.equal(r.shouldSubstituteStdin, false, "- after -- should not substitute");
  });

  it("Uses stdin if no options were passed", function() {
    let r = parseArgs(['-v']);
    assert.equal(r.shouldSubstituteStdin, true);
    assert.deepEqual(r.choices, ['-']);
  });
});
