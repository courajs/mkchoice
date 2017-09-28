#!/usr/bin/env node

const child_process = require('child_process');
const fs = require('fs');
const tty = require('tty');
const {promisify} = require('util');
const timeout = promisify(setTimeout);
const ansi = require('ansi');

const parseArgs = require('./parse-args');
const helpText = require('./help');
const collectLines = require('./collect-lines');


go();

async function go() {
  try {
    var fd = fs.openSync('/dev/tty', 'r+');
  } catch (e) {
    if (e.code === 'ENXIO') {
      console.error('mkchoice can only be run in a terminal context');
      process.exit(1);
    }
  }

  let args = parseArgs(process.argv.slice(2));
  if (args.shouldHelp) {
    console.log(helpText);
    process.exit();
  }

  if (args.shouldSubstituteStdin) {
    let lines = await collectLines(process.stdin);
    let index = args.choices.indexOf('-');
    args.choices.splice(index, 1, ...lines);
  }

  let {prompt, choices} = args;

  let writeStream = new tty.WriteStream(fd);
  let cursor = ansi(writeStream);
  let readStream = new tty.ReadStream(fd);

  class State {
    constructor(choices, selected=0) {
      this.choices = choices;
      this.selected = selected;
    }

    up() {
      let newSelected = Math.max(0, this.selected - 1);
      return new State(this.choices, newSelected);
    }

    down() {
      let newSelected = Math.min(this.selected + 1, this.choices.length -1);
      return new State(this.choices, newSelected);
    }
  }


  let hasRendered = false;
  function render(state) {
    if (hasRendered) {
      cursor.up(state.choices.length + 1);
    }
    hasRendered = true;
    cursor.write(prompt);
    cursor.write('\n');
    for (let i in state.choices) {
      if (i == state.selected) {
        cursor.green()
          .write('> ')
          .write(state.choices[i])
          .fg.reset()
          .write('\n')
      } else {
        cursor
          .write('  ')
          .write(state.choices[i])
          .write('\n')
      }
    }
  }


  function buf(str) {
    return Buffer.from(str, 'hex');
  }



  /*
   * To find these buffer values, use find-raw-input-values.js
   */
  const bufs = {
    sigint: buf('03'),
    eof: buf('04'),
    j: buf('6a'),
    k: buf('6b'),
    up: buf('1b5b41'),
    down: buf('1b5b42'),
    space: buf('20'),
    enter: buf('0d')
  };

  function sigint(dat) { return dat.equals(bufs.sigint); }
  function eof(dat) { return dat.equals(bufs.eof); }
  function j(dat) { return dat.equals(bufs.j); }
  function k(dat) { return dat.equals(bufs.k); }
  function up(dat) { return dat.equals(bufs.up); }
  function down(dat) { return dat.equals(bufs.down); }
  function space(dat) { return dat.equals(bufs.space); }
  function enter(dat) { return dat.equals(bufs.enter); }


  let state = new State(choices);
  render(state);
  readStream.setRawMode(true);
  readStream.on('data', handleInput);
  function handleInput(d) {
    switch (true) {
      case sigint(d):
        process.exit(1);
        break;
      case eof(d):
        process.exit();
        break;
      case j(d) || down(d):
        state = state.down();
        render(state);
        break;
      case k(d) || up(d):
        state = state.up();
        render(state);
        break;
      case space(d) || enter(d):
        console.log(state.choices[state.selected]);
        process.exit();
        break;
    }
  }
}
