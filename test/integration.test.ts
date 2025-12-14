import { describe, it, expect } from 'vitest';
import { expandCommand } from '../src/commands/expand';

describe('integration tests', () => {
  describe('complex real-world scenarios', () => {
    it('should expand navigation menu', async () => {
      const result = await expandCommand({
        abbreviation: 'nav>ul.menu>li.menu-item*3>a[href="#"]',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<nav>');
      expect(result).toContain('<ul class="menu">');
      expect(result).toContain('<li class="menu-item">');
      expect(result).toContain('<a href="#">');
    });

    it('should expand form with inputs', async () => {
      const result = await expandCommand({
        abbreviation: 'form>div.form-group*3>label+input:text',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('form');
      expect(result).toContain('class="form-group"');
      expect(result).toContain('label');
      expect(result).toContain('type="text"');
    });

    it('should expand card component', async () => {
      const result = await expandCommand({
        abbreviation: 'div.card>img.card-img+div.card-body>h5.card-title{Card Title}+p.card-text{Card description}',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('class="card"');
      expect(result).toContain('class="card-img"');
      expect(result).toContain('class="card-body"');
      expect(result).toContain('Card Title');
      expect(result).toContain('Card description');
    });

    it('should expand table structure', async () => {
      const result = await expandCommand({
        abbreviation: 'table>thead>tr>th*3^^tbody>tr*2>td*3',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<table>');
      expect(result).toContain('<thead>');
      expect(result).toContain('<tbody>');
      expect(result).toContain('<th>');
      expect(result).toContain('<td>');
    });

    it('should expand grid layout', async () => {
      const result = await expandCommand({
        abbreviation: 'div.container>div.row>div.col-md-4*3',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('class="container"');
      expect(result).toContain('class="row"');
      expect(result).toContain('class="col-md-4"');
    });

    it('should expand CSS flexbox layout', async () => {
      const result = await expandCommand({
        abbreviation: 'd:f+jc:c+ai:c',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toContain('display: flex');
      expect(result).toContain('justify-content: center');
      expect(result).toContain('align-items: center');
    });

    it('should expand responsive CSS', async () => {
      const result = await expandCommand({
        abbreviation: 'w100p+h100vh+m0+p0',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toContain('width: 100%');
      expect(result).toContain('height: 100vh');
      expect(result).toContain('margin: 0');
      expect(result).toContain('padding: 0');
    });
  });

  describe('kakoune integration scenarios', () => {
    it('should expand abbreviations', async () => {
      const result = await expandCommand({
        abbreviation: 'div.test',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toBe('<div class="test"></div>');
    });

    it('should support JSX expansion for React', async () => {
      const result = await expandCommand({
        abbreviation: 'div.component>h1{Title}+p{Description}',
        syntax: 'jsx',
        tabStops: false
      });
      expect(result).toContain('className="component"');
      expect(result).toContain('Title');
      expect(result).toContain('Description');
    });
  });

  describe('edge cases', () => {
    it('should handle very long abbreviations', async () => {
      const result = await expandCommand({
        abbreviation: 'div>div>div>div>div>div>div>div>div>div',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('<div>');
      expect((result.match(/<div>/g) || []).length).toBeGreaterThanOrEqual(10);
    });

    it('should handle special characters in text', async () => {
      const result = await expandCommand({
        abbreviation: 'p{Text with "quotes" and \'apostrophes\'}',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('Text with');
    });

    it('should handle mixed case in class names', async () => {
      const result = await expandCommand({
        abbreviation: 'div.MyComponent',
        syntax: 'html',
        tabStops: false
      });
      expect(result).toContain('class="MyComponent"');
    });

    it('should handle numeric values in CSS', async () => {
      const result = await expandCommand({
        abbreviation: 'm-10',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toContain('margin: -10px');
    });

    it('should handle percentage values', async () => {
      const result = await expandCommand({
        abbreviation: 'w50p',
        syntax: 'css',
        tabStops: false
      });
      expect(result).toContain('width: 50%');
    });
  });

  describe('performance', () => {
    it('should handle rapid successive expansions', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(expandCommand({
          abbreviation: 'div.test' + i,
          syntax: 'html',
          tabStops: false
        }));
      }
      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach((result, i) => {
        expect(result).toContain('class="test' + i + '"');
      });
    });
  });
});
