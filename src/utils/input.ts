import { EmmetError, ErrorCodes } from '../types/cli';

/**
 * Read input from stdin
 */
export async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const { stdin } = process;

    // Check if stdin is a TTY (terminal)
    if (stdin.isTTY) {
      resolve('');
      return;
    }

    let data = '';
    stdin.setEncoding('utf8');

    stdin.on('readable', () => {
      let chunk;
      while ((chunk = stdin.read())) {
        data += chunk;
      }
    });

    stdin.on('end', () => {
      resolve(data.trim());
    });

    stdin.on('error', (err) => {
      reject(new EmmetError(
        `Failed to read stdin: ${err.message}`,
        ErrorCodes.MISSING_ARGUMENT
      ));
    });
  });
}

/**
 * Get input from argument or stdin
 * Priority: argument > stdin
 */
export async function getInput(
  argument?: string,
  requireInput: boolean = true
): Promise<string> {
  // If argument provided, use it
  if (argument) {
    return argument.trim();
  }

  // Otherwise try stdin
  const stdinData = await readStdin();
  if (stdinData) {
    return stdinData;
  }

  // No input found
  if (requireInput) {
    throw new EmmetError(
      'No input provided. Provide abbreviation as argument or via stdin.',
      ErrorCodes.MISSING_ARGUMENT,
      { example: 'emmet expand "ul>li*3" or echo "ul>li*3" | emmet expand' }
    );
  }

  return '';
}

/**
 * Check if stdin has data available
 */
export function hasStdinData(): boolean {
  return !process.stdin.isTTY;
}
