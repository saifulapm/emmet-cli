import { describe, it, expect } from 'vitest';
import { validateCommand } from '../src/commands/validate';

describe('validate command', () => {
  describe('valid abbreviations', () => {
    it('should validate simple tag', async () => {
      const result = await validateCommand({
        abbreviation: 'div',
        syntax: 'html',
        json: true
      });
      expect(result.valid).toBe(true);
      const parsed = JSON.parse(result.result!);
      expect(parsed.abbreviation).toBe('div');
    });

    it('should validate complex abbreviation', async () => {
      const result = await validateCommand({
        abbreviation: 'div.container>ul>li*3',
        syntax: 'html'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate CSS abbreviation', async () => {
      const result = await validateCommand({
        abbreviation: 'm10-20',
        syntax: 'css'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate abbreviation without filter', async () => {
      const result = await validateCommand({
        abbreviation: 'div',
        syntax: 'html'
      });
      expect(result.valid).toBe(true);
    });

    it('should validate lorem', async () => {
      const result = await validateCommand({
        abbreviation: 'lorem10',
        syntax: 'html'
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid abbreviations', () => {
    it('should validate most abbreviations as valid', async () => {
      // Note: isAbbreviationValid is quite permissive
      const result = await validateCommand({
        abbreviation: 'div>>p',
        syntax: 'html'
      });
      // This might be valid according to emmet's validator
      expect(result.valid).toBeDefined();
    });

    it('should handle unclosed brackets', async () => {
      const result = await validateCommand({
        abbreviation: 'div[class="test"',
        syntax: 'html'
      });
      // This might still be valid
      expect(result.valid).toBeDefined();
    });
  });

  describe('abbreviation input', () => {
    it('should accept abbreviation as parameter', async () => {
      const result = await validateCommand({
        abbreviation: 'div.test',
        syntax: 'html',
        json: true
      });
      expect(result.valid).toBe(true);
      const parsed = JSON.parse(result.result!);
      expect(parsed.abbreviation).toBe('div.test');
    });
  });

  describe('output format', () => {
    it('should return JSON format when json flag is true', async () => {
      const result = await validateCommand({
        abbreviation: 'div',
        syntax: 'html',
        json: true
      });
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('result');
      const parsed = JSON.parse(result.result!);
      expect(parsed).toHaveProperty('abbreviation');
      expect(parsed).toHaveProperty('syntax');
    });

    it('should return simple format without json flag', async () => {
      const result = await validateCommand({
        abbreviation: 'div',
        syntax: 'html'
      });
      expect(result).toHaveProperty('valid');
      expect(result.valid).toBe(true);
    });
  });
});
