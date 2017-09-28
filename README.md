# mkchoice

`mkchoice` is a tool for prompting a choice from a user, which is
compatible with shell pipelines:

```sh
$ ls -a | mkchoice -p "Which file should I delete?" | xargs rm
Which file should I delete?
> .DS_Store
  README.md
  index.js
  package.json
```

It does this by writing the prompt to the user's tty, instead of using
stdin/stdout.

```
$ mkchoice -h
Usage: mkchoice [-h|--help] [-p <prompt>|--prompt <prompt>] [args] [-- <args>]

  mkchoice prompts the user's tty to choose one of the given options, and
  outputs the chosen option. Pass - as one of the args to also read
  line-separated options from stdin. Arguments after -- are taken as
  literal options, not interpreted as flags.

  Change the selected option with up/down or j/k, and confirm your
  selection with space or enter.

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
```