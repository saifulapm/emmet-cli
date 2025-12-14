import * as path from 'path';
import * as fs from 'fs/promises';
import { pathExists } from '../utils/fileService';

/**
 * Advanced configuration options for Emmet CLI
 * Note: This is for CLI-specific settings, not VSCode editor settings
 */
export interface AdvancedEmmetConfig {
  /**
   * Variables available in expansions
   * Note: These are merged with variables from .emmet/snippets.json
   */
  variables?: {
    [key: string]: string;
  };

  /**
   * Emmet preferences
   * All VSCode emmet.preferences settings
   */
  preferences?: {
    /**
     * CSS color short format
     * Default: true
     */
    'css.color.short'?: boolean;

    /**
     * CSS integer unit
     * Default: 'px'
     */
    'css.intUnit'?: string;

    /**
     * CSS float unit
     * Default: 'em'
     */
    'css.floatUnit'?: string;

    /**
     * CSS unit aliases (e.g., "e:em, p:%, x:ex")
     */
    'css.unitAliases'?: string;

    /**
     * CSS fuzzy search minimum score
     * Default: 0.3
     */
    'css.fuzzySearchMinScore'?: number;

    /**
     * CSS value separator
     * Default: ': '
     */
    'css.valueSeparator'?: string;

    /**
     * CSS property end
     * Default: ';'
     */
    'css.propertyEnd'?: string;

    /**
     * SCSS value separator
     */
    'scss.valueSeparator'?: string;

    /**
     * SCSS property end
     */
    'scss.propertyEnd'?: string;

    /**
     * LESS value separator
     */
    'less.valueSeparator'?: string;

    /**
     * LESS property end
     */
    'less.propertyEnd'?: string;

    /**
     * Sass value separator
     */
    'sass.valueSeparator'?: string;

    /**
     * Sass property end
     */
    'sass.propertyEnd'?: string;

    /**
     * Stylus value separator
     */
    'stylus.valueSeparator'?: string;

    /**
     * Stylus property end
     */
    'stylus.propertyEnd'?: string;

    /**
     * Format: No indent tags (comma-separated list)
     * Example: "html,body,head"
     */
    'format.noIndentTags'?: string;

    /**
     * Format: Force indentation for tags (comma-separated list)
     * Example: "body,head"
     */
    'format.forceIndentationForTags'?: string;

    /**
     * Output inline break
     * Default: 3
     */
    'output.inlineBreak'?: number;

    /**
     * Output reverse attributes
     * Default: false
     */
    'output.reverseAttributes'?: boolean;

    /**
     * Output self-closing style: 'html' | 'xhtml' | 'xml'
     * Default: 'html'
     */
    'output.selfClosingStyle'?: 'html' | 'xhtml' | 'xml';

    /**
     * Profile: Allow compact boolean attributes
     * Default: false
     */
    'profile.allowCompactBoolean'?: boolean;

    /**
     * Filter: Comment trigger characters
     * Default: ['#', '.']
     */
    'filter.commentTrigger'?: string[];

    /**
     * Filter: Comment before template
     * Default: '<!-- '
     */
    'filter.commentBefore'?: string;

    /**
     * Filter: Comment after template
     * Default: ' -->'
     */
    'filter.commentAfter'?: string;

    /**
     * BEM: Element separator
     * Default: '__'
     */
    'bem.elementSeparator'?: string;

    /**
     * BEM: Modifier separator
     * Default: '_'
     */
    'bem.modifierSeparator'?: string;
  };
}

/**
 * Load advanced configuration from .emmet/config.json
 */
export async function loadAdvancedConfig(
  configDir?: string
): Promise<AdvancedEmmetConfig | null> {
  const configPath = configDir
    ? path.join(configDir, '.emmet', 'config.json')
    : path.join(process.cwd(), '.emmet', 'config.json');

  if (process.env.DEBUG_EMMET) {
    console.error('Loading config from:', configPath);
    console.error('File exists:', pathExists(configPath));
  }

  if (!pathExists(configPath)) {
    return null;
  }

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content) as AdvancedEmmetConfig;

    if (process.env.DEBUG_EMMET) {
      console.error('Loaded config:', JSON.stringify(config, null, 2));
    }

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load .emmet/config.json: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get default advanced configuration matching VSCode defaults
 */
export function getDefaultAdvancedConfig(): AdvancedEmmetConfig {
  return {
    variables: {},
    preferences: {
      'css.color.short': true,
      'css.intUnit': 'px',
      'css.floatUnit': 'em',
      'css.fuzzySearchMinScore': 0.3,
      'css.valueSeparator': ': ',
      'css.propertyEnd': ';',
      'output.inlineBreak': 3,
      'output.reverseAttributes': false,
      'output.selfClosingStyle': 'html',
      'profile.allowCompactBoolean': false,
      'bem.elementSeparator': '__',
      'bem.modifierSeparator': '_'
      // NOTE: Do not set filter.commentTrigger, filter.commentBefore, filter.commentAfter here
      // These have special default values in vscode-emmet-helper that should not be overridden
      // unless the user explicitly sets them in .emmet/config.json
    }
  };
}

/**
 * Merge advanced config with defaults
 */
export function mergeAdvancedConfig(
  userConfig: AdvancedEmmetConfig | null
): AdvancedEmmetConfig {
  const defaults = getDefaultAdvancedConfig();

  if (!userConfig) {
    return defaults;
  }

  return {
    variables: { ...defaults.variables, ...userConfig.variables },
    preferences: { ...defaults.preferences, ...userConfig.preferences }
  };
}

/**
 * Convert advanced config to VSCodeEmmetConfig format
 * This creates a config object compatible with vscode-emmet-helper's getExpandOptions
 */
export function toVSCodeEmmetConfig(
  advancedConfig: AdvancedEmmetConfig
): any {
  return {
    variables: advancedConfig.variables,
    preferences: advancedConfig.preferences
  };
}
