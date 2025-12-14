import { isAbbreviationValid } from '@vscode/emmet-helper';
import { EmmetConfig } from '../types/cli';
import { getInput } from '../utils/input';
import { detectSyntax, normalizeSyntax, validateSyntax as validateSyntaxSupport } from '../utils/syntax';

export interface ValidateCommandOptions extends EmmetConfig {
  abbreviation?: string;
  json?: boolean;
}

export interface ValidateResult {
  valid: boolean;
  syntax: string;
  abbreviation: string;
}

/**
 * Validate Emmet abbreviation
 */
export async function validateCommand(
  options: ValidateCommandOptions
): Promise<{ valid: boolean; result?: string }> {
  // Get abbreviation from argument or stdin
  const abbreviation = await getInput(options.abbreviation, true);

  // Detect or get syntax
  const rawSyntax = options.syntax || detectSyntax(abbreviation);
  const syntax = normalizeSyntax(rawSyntax);

  // Validate that syntax is supported
  try {
    validateSyntaxSupport(syntax);
  } catch {
    // If syntax is not supported, abbreviation is invalid
    return { valid: false };
  }

  // Validate abbreviation
  const valid = isAbbreviationValid(syntax, abbreviation);

  // Format output
  if (options.json) {
    const result: ValidateResult = {
      valid,
      syntax,
      abbreviation
    };
    return {
      valid,
      result: JSON.stringify(result, null, 2)
    };
  }

  return { valid };
}
