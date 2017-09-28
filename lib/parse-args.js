module.exports = function(args) {
  var literalBoundary = args.indexOf('--');
  var processedArgs, literalArgs;
  if (literalBoundary !== -1) {
    processedArgs = args.slice(0, literalBoundary);
    literalArgs = args.slice(literalBoundary+1);
  } else {
    processedArgs = args;
    literalArgs = [];
  }

  if (processedArgs.includes('--help') || processedArgs.includes('-h')) {
    return {shouldHelp: true};
  }

  let shouldVanish = false;
  if (processedArgs.includes('-v') || processedArgs.includes('--vanish')) {
    shouldVanish = true;
    let index = processedArgs.indexOf('-v');
    if (index === -1) {
      index = processedArgs.indexOf('--vanish');
    }
    processedArgs.splice(index, 1);
  }

  let prompt = 'Choose one:';
  if (processedArgs.includes('-p') || processedArgs.includes('--prompt')) {
    let promptIndex = processedArgs.indexOf('-p');
    if (promptIndex === -1) {
      promptIndex = processedArgs.indexOf('--prompt');
    }

    [,prompt] = processedArgs.splice(promptIndex, 2);
  }

  let selection = 0;
  if (processedArgs.includes('-s') || processedArgs.includes('--selection')) {
    let index = processedArgs.indexOf('-s');
    if (index === -1) {
      index = processedArgs.indexOf('--selection');
    }
    [,selection] = processedArgs.splice(index, 2);
  }

  let allArgs = processedArgs.concat(literalArgs);
  let choices = allArgs;
  let shouldSubstituteStdin = processedArgs.includes('-');

  if (choices.length === 0) {
    choices = ['-'];
    shouldSubstituteStdin = true;
  }

  return {
    prompt,
    choices,
    shouldSubstituteStdin,
    shouldVanish,
    selection
  };
}
