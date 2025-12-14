import { extractAbbreviationFromText } from '@vscode/emmet-helper';
import { EmmetConfig, EmmetError, ErrorCodes } from '../types/cli';
import { getInput } from '../utils/input';
import { detectSyntax, normalizeSyntax } from '../utils/syntax';

export interface ExtractCommandOptions extends EmmetConfig {
  text?: string;
  position?: number;
}

export interface ExtractResult {
  abbreviation: string;
  filter?: string;
}

/**
 * Extract abbreviation from text
 */
export async function extractCommand(
  options: ExtractCommandOptions
): Promise<string> {
  try {
    // Get text from argument or stdin
    const text = await getInput(options.text, true);

    // Detect or get syntax
    const rawSyntax = options.syntax || detectSyntax(text);
    const syntax = normalizeSyntax(rawSyntax);

    // Extract abbreviation
    let result;
    try {
      result = extractAbbreviationFromText(text, syntax);
    } catch (error) {
      if (error instanceof Error) {
        throw new EmmetError(
          `Failed to extract abbreviation: ${error.message}`,
          ErrorCodes.INVALID_ABBREVIATION,
          {
            text,
            syntax
          }
        );
      }
      throw error;
    }

    if (!result) {
      throw new EmmetError(
        'No abbreviation found in text',
        ErrorCodes.INVALID_ABBREVIATION,
        {
          text,
          syntax
        }
      );
    }

    // Format as JSON
    const output: ExtractResult = {
      abbreviation: result.abbreviation,
      filter: result.filter
    };

    return JSON.stringify(output, null, 2);
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
