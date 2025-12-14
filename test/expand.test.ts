import { describe, it, expect } from 'vitest';
import { expandCommand } from '../src/commands/expand';

describe('expand command', () => {
  describe('HTML expansion', () => {
    it('should expand simple tag', async () => {
      const result = await expandCommand({
        abbreviation: 'div',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div></div>');
    });

    it('should expand tag with class', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div class="container"></div>');
    });

    it('should expand tag with id', async () => {
      const result = await expandCommand({
        abbreviation: 'div#main',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div id="main"></div>');
    });

    it('should expand nested tags', async () => {
      const result = await expandCommand({
        abbreviation: 'div>ul>li',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<div>');
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>');
    });

    it('should expand sibling tags', async () => {
      const result = await expandCommand({
        abbreviation: 'div+p',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<div>');
      expect(result).toContain('<p>');
    });

    it('should expand with text content', async () => {
      const result = await expandCommand({
        abbreviation: 'h1{Hello World}',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<h1>Hello World</h1>');
    });

    it('should expand with attributes', async () => {
      const result = await expandCommand({
        abbreviation: 'a[href="#" title="Link"]',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('href="#"');
      expect(result).toContain('title="Link"');
    });

    it('should expand HTML5 boilerplate', async () => {
      const result = await expandCommand({
        abbreviation: '!',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain('<meta charset="UTF-8">');
    });

    it('should expand with tab stops enabled', async () => {
      const result = await expandCommand({
        abbreviation: 'div',
        syntax: 'html',
        tabStops: true
      });
      expect(result).toContain('$');
    });

    it('should resolve implicit tags', async () => {
      const result = await expandCommand({
        abbreviation: 'ul>.item',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<li class="item">');
    });
  });

  describe('CSS expansion', () => {
    it('should expand simple property', async () => {
      const result = await expandCommand({
        abbreviation: 'm10',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('margin: 10px;');
    });

    it('should expand with multiple values', async () => {
      const result = await expandCommand({
        abbreviation: 'm10-20',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('margin: 10px 20px;');
    });

    it('should expand flexbox properties', async () => {
      const result = await expandCommand({
        abbreviation: 'd:f',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('display: flex;');
    });

    it('should expand color values', async () => {
      const result = await expandCommand({
        abbreviation: 'c#fff',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('color: #fff;');
    });

    it('should expand important flag', async () => {
      const result = await expandCommand({
        abbreviation: 'd:n!',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toBe('display: none !important;');
    });
  });

  describe('JSX expansion', () => {
    it('should use className instead of class', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container',
        syntax: 'jsx',
        tabStops: false
      });
      expect(result).toContain('className="container"');
      expect(result).not.toContain('class=');
    });

    it('should use htmlFor instead of for', async () => {
      const result = await expandCommand({
        abbreviation: 'label[for="name"]',
        syntax: 'jsx',
        tabStops: false
      });
      expect(result).toContain('htmlFor="name"');
    });
  });

  describe('filters', () => {
    it('should apply BEM filter', async () => {
      const result = await expandCommand({
        abbreviation: 'div.block>div.block__element',
        syntax: 'html',
        filter: 'bem',
        tabStops: false
      });
      expect(result).toContain('class="block"');
      // BEM filter applies BEM naming convention
      expect(result).toContain('block_element');
    });

    it('should apply comment filter', async () => {
      const result = await expandCommand({
        abbreviation: 'div#main',
        syntax: 'html',
        filter: 'c',
        tabStops: false
      });
      expect(result).toContain('<!-- /#main -->');
    });

    it('should apply trim filter', async () => {
      const result = await expandCommand({
        abbreviation: 'div',
        syntax: 'html',
        filter: 't',
        tabStops: false
      });
      expect(result).toBe('<div></div>');
    });
  });

  describe('Lorem Ipsum', () => {
    it('should expand lorem', async () => {
      const result = await expandCommand({
        abbreviation: 'lorem',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('Lorem');
      expect(result.split(' ').length).toBeGreaterThan(20);
    });

    it('should expand lorem with word count', async () => {
      const result = await expandCommand({
        abbreviation: 'lorem5',
        syntax: 'html',
        tabStops: false
      });
      expect(result.split(' ').length).toBe(5);
    });
  });

  describe('syntax detection', () => {
    it('should use explicit HTML syntax', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<div class="container">');
    });

    it('should use explicit CSS syntax', async () => {
      const result = await expandCommand({
        abbreviation: 'm10',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toContain('margin:');
    });
  });

  describe('abbreviation input', () => {
    it('should accept abbreviation as parameter', async () => {
      const result = await expandCommand({
        abbreviation: 'div.test',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div class="test"></div>');
    });
  });

  describe('error handling', () => {
    it('should handle invalid syntax', async () => {
      await expect(expandCommand({
        abbreviation: 'div',
        syntax: 'invalid' as any,
        tabStops: false
      })).rejects.toThrow();
    });
  });
});
