export interface EmmetConfig {
  syntax?: string;
  filter?: string;
  tabStops?: boolean;
  indent?: string;
  config?: string;
  variables?: Record<string, string>;
  profile?: string;
  syntaxProfiles?: Record<string, any>;
  snippets?: Record<string, any>;
}

export interface ExpandOptions extends EmmetConfig {
  abbreviation: string;
}

export interface WrapOptions extends EmmetConfig {
  abbreviation: string;
  text: string | string[];
  multiLine?: boolean;
}

export interface ExtractOptions {
  text: string;
  syntax?: string;
  position?: number;
}

export interface ValidateOptions {
  abbreviation: string;
  syntax?: string;
}

export interface EmmetOutput {
  expanded: string;
  abbreviation: string;
  syntax: string;
  filter?: string;
}

export class EmmetError extends Error {
  constructor(
    message: string,
    public code: number,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'EmmetError';
  }
}

export const ErrorCodes = {
  INVALID_ABBREVIATION: 1,
  INVALID_SYNTAX: 2,
  CONFIG_ERROR: 3,
  MISSING_ARGUMENT: 4
} as const;
