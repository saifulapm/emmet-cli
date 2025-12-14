import { describe, it, expect } from 'vitest';
import { expandCommand } from '../src/commands/expand';

describe('multi-language support', () => {
  describe('HTML', () => {
    it('should expand HTML abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div class="container"></div>');
    });
  });

  describe('CSS', () => {
    it('should expand CSS abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'm10',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('margin: 10px;');
    });
  });

  describe('JSX', () => {
    it('should expand JSX with className', async () => {
      const result = await expandCommand({
        abbreviation: 'div.wrapper',
        syntax: 'jsx',
        tabStops: false
      });
      expect(result).toContain('className="wrapper"');
    });
  });

  describe('SCSS', () => {
    it('should expand SCSS abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'p10',
        syntax: 'scss',
        tabStops: false
      });
      expect(result).toContain('padding:');
    });
  });

  describe('LESS', () => {
    it('should expand LESS abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'w100',
        syntax: 'less',
        tabStops: false
      });
      expect(result).toContain('width:');
    });
  });

  describe('Sass', () => {
    it('should expand Sass abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'h50',
        syntax: 'sass',
        tabStops: false
      });
      expect(result).toContain('height');
    });
  });

  describe('XML', () => {
    it('should expand XML abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'root>item',
        syntax: 'xml',
        tabStops: false
      });
      expect(result).toContain('<root>');
      expect(result).toContain('<item>');
    });
  });

  describe('XSL', () => {
    it('should expand XSL abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'template',
        syntax: 'xsl',
        tabStops: false
      });
      expect(result).toContain('template');
    });
  });

  describe('Pug/Jade', () => {
    it('should expand Pug abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container',
        syntax: 'pug',
        tabStops: false
      });
      // Pug uses indentation-based syntax
      expect(result).toContain('container');
    });
  });

  describe('HAML', () => {
    it('should expand HAML abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'div#main',
        syntax: 'haml',
        tabStops: false
      });
      // HAML uses different syntax
      expect(result).toContain('main');
    });
  });

  describe('Slim', () => {
    it('should expand Slim abbreviation', async () => {
      const result = await expandCommand({
        abbreviation: 'div.wrapper',
        syntax: 'slim',
        tabStops: false
      });
      // Slim uses different syntax
      expect(result).toContain('wrapper');
    });
  });

  describe('Vue', () => {
    it('should expand Vue template', async () => {
      const result = await expandCommand({
        abbreviation: 'div.component',
        syntax: 'vue',
        tabStops: false
      });
      expect(result).toContain('<div class="component">');
    });
  });

  describe('TypeScript JSX', () => {
    it('should expand TSX with className', async () => {
      const result = await expandCommand({
        abbreviation: 'div.tsx-component',
        syntax: 'tsx',
        tabStops: false
      });
      expect(result).toContain('className="tsx-component"');
    });
  });
});
