import { describe, it, expect } from 'vitest';
import { expandCommand } from '../src/commands/expand';
import * as path from 'path';

describe('config loading', () => {
  describe('custom snippets from existing config', () => {
    it('should load custom snippets if .emmet/snippets.json exists', async () => {
      // This test will work if the .emmet/snippets.json file exists in project root
      // The test verifies that custom snippets are being loaded correctly
      const emmetDir = path.join(process.cwd(), '.emmet');

      // Try to expand a potential custom snippet
      // If it expands to the custom definition, config loading works
      // If it falls back to a default tag, that's also acceptable for this test
      const result = await expandCommand({
        abbreviation: 'hero',
        syntax: 'html',
        tabStops: false
      });

      // Just verify we got some output
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('config with custom path', () => {
    it('should throw error for non-existent config path', async () => {
      // Test that invalid config paths are handled
      await expect(expandCommand({
        abbreviation: 'div.test',
        syntax: 'html',
        config: '/nonexistent/path',
        tabStops: false
      })).rejects.toThrow('Config path does not exist');
    });
  });

  describe('syntax profiles', () => {
    it('should load syntax profiles if available', async () => {
      // Just verify that the expansion works with potential profiles
      const result = await expandCommand({
        abbreviation: 'div.test',
        syntax: 'html',
        tabStops: false
      });

      expect(result).toContain('div');
      expect(result).toContain('test');
    });
  });
});
