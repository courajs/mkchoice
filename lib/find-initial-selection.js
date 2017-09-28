module.exports = function(args) {
  if (args.choices.includes(args.selection)) {
    return args.choices.indexOf(args.selection);
  } else if (!isNaN(parseInt(args.selection))) {
    let index = parseInt(args.selection);
    return Math.min(index, args.choices.length - 1);
  } else {
    return 0;
  }
}
