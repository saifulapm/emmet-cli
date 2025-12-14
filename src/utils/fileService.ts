import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { URI as Uri } from 'vscode-uri';

const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);

export enum FileType {
  Unknown = 0,
  File = 1,
  Directory = 2,
  SymbolicLink = 64
}

export interface FileStat {
  type: FileType;
  ctime: number;
  mtime: number;
  size: number;
}

export interface FileService {
  readFile(uri: Uri): Promise<Uint8Array>;
  stat(uri: Uri): Promise<FileStat>;
}

export class NodeFileService implements FileService {
  async readFile(uri: Uri): Promise<Uint8Array> {
    const filePath = uri.fsPath;
    const buffer = await readFileAsync(filePath);
    return new Uint8Array(buffer);
  }

  async stat(uri: Uri): Promise<FileStat> {
    const filePath = uri.fsPath;

    try {
      const stats = await statAsync(filePath);

      let type = FileType.Unknown;
      if (stats.isFile()) {
        type = FileType.File;
      } else if (stats.isDirectory()) {
        type = FileType.Directory;
      } else if (stats.isSymbolicLink()) {
        type = FileType.SymbolicLink;
      }

      return {
        type,
        ctime: stats.ctimeMs,
        mtime: stats.mtimeMs,
        size: stats.size
      };
    } catch (err: any) {
      // If file doesn't exist, return Unknown type instead of throwing
      if (err.code === 'ENOENT') {
        return {
          type: FileType.Unknown,
          ctime: -1,
          mtime: -1,
          size: -1
        };
      }
      throw err;
    }
  }
}

export function resolvePath(basePath: string, relativePath: string): string {
  // Expand home directory
  if (relativePath.startsWith('~')) {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    relativePath = path.join(homeDir, relativePath.slice(1));
  }

  // If it's an absolute path, return it as-is
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }

  // Otherwise, resolve relative to basePath
  return path.resolve(basePath, relativePath);
}

export function pathExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
