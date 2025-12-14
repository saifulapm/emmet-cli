import {
  expandAbbreviation,
  getExpandOptions,
  getSyntaxType,
  isStyleSheet
} from '@vscode/emmet-helper';
import { UserConfig } from 'emmet';
import { loadConfig } from '../config/loader';
import { mergeConfig } from '../config/merger';
import { loadAdvancedConfig, mergeAdvancedConfig, toVSCodeEmmetConfig } from '../config/advancedConfig';
import { EmmetConfig, EmmetError, ErrorCodes } from '../types/cli';
import { getInput } from '../utils/input';
import { formatOutput } from '../utils/output';
import { detectSyntax, normalizeSyntax, validateSyntax } from '../utils/syntax';

export interface ExpandCommandOptions extends EmmetConfig {
  abbreviation?: string;
}

/**
 * Expand Emmet abbreviation
 */
export async function expandCommand(
  options: ExpandCommandOptions
): Promise<string> {
  try {
    // Load configuration from files
    await loadConfig(options);

    // Load advanced configuration
    const advancedConfigRaw = await loadAdvancedConfig(options.config);
    const advancedConfig = mergeAdvancedConfig(advancedConfigRaw);

    // Get abbreviation from argument or stdin
    const abbreviation = await getInput(options.abbreviation, true);

    // Detect or get syntax
    const rawSyntax = options.syntax || detectSyntax(abbreviation);
    const syntax = normalizeSyntax(rawSyntax);

    // Validate syntax
    validateSyntax(syntax);

    // Get syntax type (markup or stylesheet)
    const syntaxType = getSyntaxType(syntax);

    // Merge configuration (CLI options + advanced config)
    const emmetConfig = mergeConfig(options);

    // Convert advanced config to VSCode format and merge
    const vscodeConfig = toVSCodeEmmetConfig(advancedConfig);
    // Deep merge: start with vscodeConfig, then add non-empty properties from emmetConfig
    const combinedConfig = {
      ...vscodeConfig,
      ...emmetConfig,
      syntaxProfiles: { ...vscodeConfig.syntaxProfiles, ...emmetConfig.syntaxProfiles },
      variables: { ...vscodeConfig.variables, ...emmetConfig.variables },
      preferences: { ...vscodeConfig.preferences, ...emmetConfig.preferences }
    };

    // Log combined config for debugging
    if (process.env.DEBUG_EMMET) {
      console.error('Combined config:', JSON.stringify(combinedConfig, null, 2));
    }

    // Get expand options with filters
    // Snippets are loaded from .emmet/snippets.json via loadConfig
    const expandOpts = getExpandOptions(
      syntax,
      combinedConfig,
      options.filter
    );

    // Create user config for expansion
    const userConfig: UserConfig = {
      type: syntaxType,
      syntax,
      options: expandOpts.options,
      variables: expandOpts.variables,
      snippets: expandOpts.snippets
    };

    // Expand abbreviation
    let expanded: string;
    try {
      expanded = expandAbbreviation(abbreviation, userConfig);
    } catch (error) {
      if (error instanceof Error) {
        throw new EmmetError(
          `Failed to expand abbreviation: ${error.message}`,
          ErrorCodes.INVALID_ABBREVIATION,
          {
            abbreviation,
            syntax
          }
        );
      }
      throw error;
    }

    // Format output
    const formatted = formatOutput(expanded, {
      removeTabStops: options.tabStops === false,
      indent: options.indent
    });

    return formatted;
  } catch (error) {
    if (error instanceof EmmetError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new EmmetError(
        error.message,
        ErrorCodes.INVALID_ABBREVIATION
      );
    }
    throw error;
  }
}
