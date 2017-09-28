module.exports =
`Usage: mkchoice [-h|--help] [-v|--vanish] [-p <prompt>|--prompt <prompt>] [args] [-- <args>]

  mkchoice prompts the user's tty to choose one of the given options, and
  outputs the chosen option. Pass - as one of the args to also read
  line-separated options from stdin. Arguments after -- are taken as
  literal options, not interpreted as flags.

  Change the selected option with up/down or j/k, and confirm your
  selection with space or enter.

  If the --vanish flag is given, the prompt will be erased from the
  terminal before the output is shown. Otherwise, the final state of the
  prompt will still be visible on the screen.

  Example:

  $ seq 3 | mkchoice -p "Which one?" a - b -- -p -h - -- z >some-file
  Which one?
    a
    1
    2
    3
  > b
    -p
    -h
    -
    --
    z
  $ cat some-file
  b
`;
