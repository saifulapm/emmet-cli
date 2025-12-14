#!/usr/bin/env node

import { Command } from 'commander';
import { expandCommand } from './commands/expand';
import { wrapCommand } from './commands/wrap';
import { extractCommand } from './commands/extract';
import { validateCommand } from './commands/validate';
import { EmmetError } from './types/cli';
import { writeStdout, writeStderr } from './utils/output';
import { parseVariables } from './config/merger';

const program = new Command();

program
  .name('emmet')
  .description('VSCode Emmet CLI - Full-featured Emmet abbreviation expansion')
  .version('1.0.0');

// Global options
program
  .option('-s, --syntax <lang>', 'Language/syntax (html, css, jsx, etc.)')
  .option('-f, --filter <filters>', 'Filters: bem, c, t (comma-separated)')
  .option('-c, --config <path>', 'Custom config directory')
  .option('-i, --indent <chars>', 'Indentation string (default: tab)', '\t')
  .option('-t, --tab-stops', 'Include tab stops (default: true)', true)
  .option('-n, --no-tab-stops', 'Disable tab stops')
  .allowUnknownOption(); // Allow --var-* options

// Expand command
program
  .command('expand [abbreviation]')
  .description('Expand Emmet abbreviation')
  .allowUnknownOption() // Allow --var-* options
  .action(async (abbreviation, options, command) => {
    try {
      const globalOpts = command.parent.opts();
      const vars = parseVariables(process.argv);

      const result = await expandCommand({
        abbreviation,
        syntax: globalOpts.syntax,
        filter: globalOpts.filter,
        config: globalOpts.config,
        indent: globalOpts.indent,
        tabStops: globalOpts.tabStops,
        variables: vars
      });

      writeStdout(result);
      process.exit(0);
    } catch (error) {
      handleError(error);
    }
  });

// Wrap command
program
  .command('wrap <abbreviation>')
  .description('Wrap text/selection with abbreviation (text from stdin)')
  .option('--multi-line', 'Each line becomes separate item')
  .allowUnknownOption() // Allow --var-* options
  .action(async (abbreviation, cmdOptions, command) => {
    try {
      const globalOpts = command.parent.opts();
      const vars = parseVariables(process.argv);

      const result = await wrapCommand({
        abbreviation,
        syntax: globalOpts.syntax,
        filter: globalOpts.filter,
        config: globalOpts.config,
        indent: globalOpts.indent,
        tabStops: globalOpts.tabStops,
        multiLine: cmdOptions.multiLine,
        variables: vars
      });

      writeStdout(result);
      process.exit(0);
    } catch (error) {
      handleError(error);
    }
  });

// Extract command
program
  .command('extract [text]')
  .description('Extract abbreviation from text')
  .option('--position <n>', 'Character position', parseInt)
  .action(async (text, cmdOptions, command) => {
    try {
      const globalOpts = command.parent.opts();

      const result = await extractCommand({
        text,
        syntax: globalOpts.syntax,
        position: cmdOptions.position
      });

      writeStdout(result);
      process.exit(0);
    } catch (error) {
      handleError(error);
    }
  });

// Validate command
program
  .command('validate [abbreviation]')
  .description('Validate abbreviation')
  .option('--json', 'Output as JSON')
  .action(async (abbreviation, cmdOptions, command) => {
    try {
      const globalOpts = command.parent.opts();

      const { valid, result } = await validateCommand({
        abbreviation,
        syntax: globalOpts.syntax,
        json: cmdOptions.json
      });

      if (result) {
        writeStdout(result);
      }

      process.exit(valid ? 0 : 1);
    } catch (error) {
      handleError(error);
    }
  });

// Default action (expand if no subcommand)
program.action(async (options) => {
  try {
    const vars = parseVariables(process.argv);

    // If no subcommand, treat as expand
    const result = await expandCommand({
      syntax: options.syntax,
      filter: options.filter,
      config: options.config,
      indent: options.indent,
      tabStops: options.tabStops,
      variables: vars
    });

    writeStdout(result);
    process.exit(0);
  } catch (error) {
    handleError(error);
  }
});

// Error handler
function handleError(error: unknown): never {
  if (error instanceof EmmetError) {
    writeStderr(`Error: ${error.message}`);
    if (error.context) {
      for (const [key, value] of Object.entries(error.context)) {
        writeStderr(`  ${key}: ${value}`);
      }
    }
    process.exit(error.code);
  }

  if (error instanceof Error) {
    writeStderr(`Error: ${error.message}`);
    process.exit(1);
  }

  writeStderr('Unknown error occurred');
  process.exit(1);
}

// Parse arguments
program.parse();
