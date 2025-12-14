import * as path from 'path';
import * as os from 'os';
import { URI } from 'vscode-uri';
import { updateExtensionsPath } from '@vscode/emmet-helper';
import { NodeFileService, pathExists } from '../utils/fileService';
import { EmmetConfig } from '../types/cli';

export interface LoadedConfig {
  variables?: Record<string, string>;
  syntaxProfiles?: Record<string, any>;
  snippets?: Record<string, any>;
}

/**
 * Load Emmet configuration from multiple sources with proper priority
 */
export async function loadConfig(options: EmmetConfig): Promise<void> {
  const fs = new NodeFileService();
  const configPaths: string[] = [];

  // 1. User home directory: ~/.emmet/
  const homeDir = os.homedir();
  const homeEmmetPath = path.join(homeDir, '.emmet');
  if (pathExists(homeEmmetPath)) {
    configPaths.push(homeEmmetPath);
  }

  // 2. Project root: .emmet/
  const projectEmmetPath = path.join(process.cwd(), '.emmet');
  if (pathExists(projectEmmetPath)) {
    configPaths.push(projectEmmetPath);
  }

  // 3. Custom path via --config flag
  if (options.config) {
    const customPath = path.resolve(options.config);
    if (pathExists(customPath)) {
      configPaths.push(customPath);
    } else {
      throw new Error(`Config path does not exist: ${customPath}`);
    }
  }

  // Load configs from all paths using updateExtensionsPath
  if (configPaths.length > 0) {
    try {
      await updateExtensionsPath(
        configPaths,
        fs,
        [URI.file(process.cwd())],
        URI.file(homeDir)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load config: ${error.message}`);
      }
      throw error;
    }
  }
}

/**
 * Get configuration paths that will be searched
 */
export function getConfigPaths(customPath?: string): string[] {
  const paths: string[] = [];

  const homeDir = os.homedir();
  const homeEmmetPath = path.join(homeDir, '.emmet');
  paths.push(homeEmmetPath);

  const projectEmmetPath = path.join(process.cwd(), '.emmet');
  paths.push(projectEmmetPath);

  if (customPath) {
    paths.push(path.resolve(customPath));
  }

  return paths;
}
