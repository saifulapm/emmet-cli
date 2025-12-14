import { VSCodeEmmetConfig } from '@vscode/emmet-helper';
import { EmmetConfig } from '../types/cli';

/**
 * Merge CLI options with loaded config to create VSCodeEmmetConfig
 */
export function mergeConfig(options: EmmetConfig): VSCodeEmmetConfig {
  const config: VSCodeEmmetConfig = {
    syntaxProfiles: {},
    variables: {},
    preferences: {}
  };

  // Merge syntax profiles from file
  if (options.syntaxProfiles) {
    config.syntaxProfiles = { ...options.syntaxProfiles };
  }

  // Merge variables from file and CLI
  if (options.variables) {
    config.variables = { ...options.variables };
  }

  // Apply profile option if specified
  if (options.profile && config.syntaxProfiles) {
    // The profile option specifies which profile to use
    // This is handled in the expansion logic
  }

  return config;
}

/**
 * Parse variables from CLI arguments
 * Example: --var-lang=en --var-charset=UTF-8
 */
export function parseVariables(args: string[]): Record<string, string> {
  const variables: Record<string, string> = {};

  for (const arg of args) {
    const match = arg.match(/^--var-([^=]+)=(.+)$/);
    if (match) {
      const [, name, value] = match;
      variables[name] = value;
    }
  }

  return variables;
}

/**
 * Deep merge objects (for config merging)
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      target[key] = deepMerge(
        { ...targetValue },
        sourceValue as any
      ) as any;
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue as any;
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}
