import {
  expandAbbreviation,
  getExpandOptions,
  getSyntaxType
} from '@vscode/emmet-helper';
import { UserConfig } from 'emmet';
import { loadConfig } from '../config/loader';
import { mergeConfig } from '../config/merger';
import { loadAdvancedConfig, mergeAdvancedConfig, toVSCodeEmmetConfig } from '../config/advancedConfig';
import { EmmetConfig, EmmetError, ErrorCodes } from '../types/cli';
import { readStdin } from '../utils/input';
import { formatOutput } from '../utils/output';
import { detectSyntax, normalizeSyntax, validateSyntax } from '../utils/syntax';

export interface WrapCommandOptions extends EmmetConfig {
  abbreviation: string;
  multiLine?: boolean;
}

/**
 * Wrap text with Emmet abbreviation
 */
export async function wrapCommand(
  options: WrapCommandOptions
): Promise<string> {
  try {
    // Load configuration from files
    await loadConfig(options);

    // Load advanced configuration
    const advancedConfigRaw = await loadAdvancedConfig(options.config);
    const advancedConfig = mergeAdvancedConfig(advancedConfigRaw);

    // Get abbreviation from argument (required)
    const abbreviation = options.abbreviation;
    if (!abbreviation) {
      throw new EmmetError(
        'Abbreviation is required for wrap command',
        ErrorCodes.MISSING_ARGUMENT,
        { example: 'emmet wrap "ul>li*" --syntax html < selection.txt' }
      );
    }

    // Get text to wrap from stdin (required)
    const textToWrap = await readStdin();
    if (!textToWrap) {
      throw new EmmetError(
        'No text provided via stdin to wrap',
        ErrorCodes.MISSING_ARGUMENT,
        { example: 'echo "item1\\nitem2" | emmet wrap "ul>li*" --syntax html' }
      );
    }

    // Detect or get syntax
    const rawSyntax = options.syntax || detectSyntax(abbreviation);
    const syntax = normalizeSyntax(rawSyntax);

    // Validate syntax
    validateSyntax(syntax);

    // Get syntax type
    const syntaxType = getSyntaxType(syntax);

    // Merge configuration (CLI options + advanced config)
    const emmetConfig = mergeConfig(options);

    // Convert advanced config to VSCode format and merge
    const vscodeConfig = toVSCodeEmmetConfig(advancedConfig);
    const combinedConfig = { ...vscodeConfig, ...emmetConfig };

    // Get expand options with filters
    // Snippets are loaded from .emmet/snippets.json via loadConfig
    const expandOpts = getExpandOptions(
      syntax,
      combinedConfig,
      options.filter
    );

    // Prepare text for wrapping
    let text: string | string[];
    if (options.multiLine) {
      // Split by lines for multi-line mode
      text = textToWrap.split('\n').map(line => line.trim()).filter(line => line);
    } else {
      text = textToWrap;
    }

    // Create user config for expansion with text
    const userConfig: UserConfig = {
      type: syntaxType,
      syntax,
      text,
      options: expandOpts.options,
      variables: expandOpts.variables,
      snippets: expandOpts.snippets
    };

    // Expand abbreviation with text
    let expanded: string;
    try {
      expanded = expandAbbreviation(abbreviation, userConfig);
    } catch (error) {
      if (error instanceof Error) {
        throw new EmmetError(
          `Failed to wrap with abbreviation: ${error.message}`,
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
