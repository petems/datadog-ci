import fs from 'fs'

import {Builtins, Cli, CommandClass} from 'clipanion'

const onError = (err: any) => {
  console.log(err)
  process.exitCode = 1
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)

const cli = new Cli({
  binaryLabel: 'Datadog AAS CLI',
  binaryName: 'datadog-aas',
  binaryVersion: '1.0.0',
})

cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)

const commandsPath = `${__dirname}/commands`
for (const commandFolder of fs.readdirSync(commandsPath)) {
  const commandPath = `${commandsPath}/${commandFolder}`
  if (fs.statSync(commandPath).isDirectory()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ;(require(`${commandPath}/cli`) as CommandClass[]).forEach((command) => cli.register(command))
  }
}

if (require.main === module) {
  void cli.runExit(process.argv.slice(2), {
    stderr: process.stderr,
    stdin: process.stdin,
    stdout: process.stdout,
  })
}

export {cli}