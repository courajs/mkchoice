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

  let prompt = 'Choose one:';

  while (processedArgs.includes('-p') || processedArgs.includes('--prompt')) {
    let promptIndex = processedArgs.indexOf('-p');
    if (promptIndex === -1) {
      promptIndex = processedArgs.indexOf('--prompt');
    }

    [,prompt] = processedArgs.splice(promptIndex, 2);
  }

  return {
    prompt,
    choices: processedArgs.concat(literalArgs),
    shouldSubstituteStdin: processedArgs.includes('-')
  };
}
