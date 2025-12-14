import * as path from 'path';
import { getEmmetMode } from '@vscode/emmet-helper';
import { EmmetError, ErrorCodes } from '../types/cli';

// Supported syntaxes
export const MARKUP_SYNTAXES = [
  'html', 'xml', 'xsl', 'jsx', 'js', 'pug', 'slim', 'haml', 'vue'
];

export const STYLESHEET_SYNTAXES = [
  'css', 'scss', 'sass', 'less', 'stylus', 'sss'
];

export const ALL_SYNTAXES = [...MARKUP_SYNTAXES, ...STYLESHEET_SYNTAXES];

// File extension to syntax mapping
const EXTENSION_MAP: Record<string, string> = {
  '.html': 'html',
  '.htm': 'html',
  '.xml': 'xml',
  '.xsl': 'xsl',
  '.jsx': 'jsx',
  '.tsx': 'jsx',
  '.js': 'js',
  '.ts': 'js',
  '.vue': 'vue',
  '.pug': 'pug',
  '.jade': 'pug',
  '.slim': 'slim',
  '.haml': 'haml',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.styl': 'stylus',
  '.stylus': 'stylus',
  '.sss': 'sss'
};

/**
 * Detect syntax from abbreviation pattern or file extension
 */
export function detectSyntax(
  abbreviation: string,
  options?: {
    file?: string;
    hint?: string;
  }
): string {
  // 1. Check explicit syntax hint
  if (options?.hint) {
    return normalizeSyntax(options.hint);
  }

  // 2. File extension hint
  if (options?.file) {
    const ext = path.extname(options.file).toLowerCase();
    if (EXTENSION_MAP[ext]) {
      return EXTENSION_MAP[ext];
    }
  }

  // 3. Pattern detection for CSS/stylesheet
  if (isCssAbbreviation(abbreviation)) {
    return 'css';
  }

  // 4. Pattern detection for HTML/markup
  if (isMarkupAbbreviation(abbreviation)) {
    return 'html';
  }

  // 5. Default to HTML
  return 'html';
}

/**
 * Normalize syntax name (handle aliases)
 */
export function normalizeSyntax(syntax: string): string {
  const normalized = syntax.toLowerCase().trim();

  // Handle aliases
  const aliasMap: Record<string, string> = {
    'jade': 'pug',
    'sass-indented': 'sass',
    'typescriptreact': 'jsx',
    'javascriptreact': 'jsx',
    'tsx': 'jsx'
  };

  return aliasMap[normalized] || normalized;
}

/**
 * Validate that syntax is supported
 */
export function validateSyntax(syntax: string): void {
  const normalized = normalizeSyntax(syntax);

  if (!ALL_SYNTAXES.includes(normalized)) {
    throw new EmmetError(
      `Unsupported syntax: ${syntax}`,
      ErrorCodes.INVALID_SYNTAX,
      {
        syntax,
        supported: ALL_SYNTAXES.join(', ')
      }
    );
  }
}

/**
 * Check if abbreviation looks like a CSS/stylesheet abbreviation
 */
function isCssAbbreviation(abbreviation: string): boolean {
  // Starts with @, -, or looks like CSS property
  if (/^[@-]/.test(abbreviation)) {
    return true;
  }

  // Starts with common CSS property prefix
  if (/^[a-z]+-?[a-z]*:/.test(abbreviation)) {
    return true;
  }

  // Common CSS abbreviations
  const cssPatterns = [
    /^(m|p|w|h|d|bd|bg|c|fs|fw|ta|va|pos|t|r|b|l|z)/,  // margin, padding, width, etc.
    /^(gtc|grid|flex|ai|jc)/  // grid, flexbox
  ];

  return cssPatterns.some(pattern => pattern.test(abbreviation));
}

/**
 * Check if abbreviation looks like a markup abbreviation
 */
function isMarkupAbbreviation(abbreviation: string): boolean {
  // Contains markup operators
  return /[>{+^]|^\.|^#/.test(abbreviation);
}

/**
 * Get Emmet mode for syntax (handles VSCode language mapping)
 */
export function getEmmetSyntax(syntax: string): string | undefined {
  return getEmmetMode(syntax);
}
