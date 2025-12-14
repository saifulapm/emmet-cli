import { EmmetOutput } from '../types/cli';

/**
 * Format output for display
 */
export function formatOutput(
  expanded: string,
  options?: {
    removeTabStops?: boolean;
    indent?: string;
  }
): string {
  let output = expanded;

  // Remove tab stops if requested
  if (options?.removeTabStops) {
    output = removeTabStops(output);
  }

  // Replace indentation if custom indent specified
  if (options?.indent !== undefined && options.indent !== '\t') {
    output = replaceIndentation(output, options.indent);
  }

  return output;
}

/**
 * Remove tab stop markers from text
 * Removes ${0}, ${1:placeholder}, etc.
 */
export function removeTabStops(text: string): string {
  // Remove tab stops with placeholders: ${1:placeholder}
  text = text.replace(/\$\{(\d+):([^}]+)\}/g, '$2');

  // Remove simple tab stops: ${1}
  text = text.replace(/\$\{\d+\}/g, '');

  return text;
}

/**
 * Replace tab indentation with custom indentation
 */
export function replaceIndentation(text: string, indent: string): string {
  // Replace leading tabs with custom indentation
  return text.replace(/^(\t+)/gm, (match) => {
    return indent.repeat(match.length);
  });
}

/**
 * Format as JSON output
 */
export function formatAsJson(
  expanded: string,
  abbreviation: string,
  syntax: string,
  filter?: string
): string {
  const output: EmmetOutput = {
    expanded,
    abbreviation,
    syntax,
    filter
  };

  return JSON.stringify(output, null, 2);
}

/**
 * Write to stdout
 */
export function writeStdout(content: string): void {
  process.stdout.write(content);

  // Add newline if content doesn't end with one
  if (!content.endsWith('\n')) {
    process.stdout.write('\n');
  }
}

/**
 * Write to stderr
 */
export function writeStderr(content: string): void {
  process.stderr.write(content);

  // Add newline if content doesn't end with one
  if (!content.endsWith('\n')) {
    process.stderr.write('\n');
  }
}
