# Emmet CLI

A powerful command-line interface for Emmet abbreviation expansion, powered by the same library that VSCode uses (`@vscode/emmet-helper`).

## Features

- **Full VSCode Emmet Support**: All filters (BEM, comment, trim), wrapping, custom snippets, and configuration options
- **15+ Languages**: HTML, CSS, JSX, Vue, SCSS, LESS, Sass, Pug, HAML, Slim, and more
- **Flexible Configuration**: Load custom snippets, variables, and syntax profiles from `.emmet/` directory
- **Standard I/O**: Read from stdin, write to stdout for easy piping and integration
- **Subcommands**: `expand`, `wrap`, `extract`, and `validate`

## Installation

```bash
# Install globally
npm install -g @saifulapm/emmet-cli

# Or install locally in your project
npm install --save-dev @saifulapm/emmet-cli
```

### Development Setup

```bash
# Clone the repository
git clone https://github.com/saifulapm/emmet-cli.git
cd emmet-cli

# Install dependencies
npm install

# Build
npm run build

# Link globally for testing
npm link
```

## Quick Start

```bash
# Expand HTML abbreviation
emmet expand "ul>li*3" --syntax html

# From stdin
echo "div.container>p" | emmet expand --syntax html

# CSS abbreviation
emmet expand "m10+p5" --syntax css

# Wrap text with abbreviation
echo "Hello World" | emmet wrap "div.greeting" --syntax html

# Extract abbreviation from text
emmet extract "div.test" --syntax html
```

## Commands

### `emmet expand [abbreviation]`

Expand Emmet abbreviation to code.

**Options:**
- `-s, --syntax <lang>` - Language/syntax (html, css, jsx, etc.)
- `-f, --filter <filters>` - Filters: bem, c, t (comma-separated)
- `-c, --config <path>` - Custom config directory
- `-i, --indent <chars>` - Indentation string (default: tab)
- `-t, --tab-stops` - Include tab stops (default: true)
- `-n, --no-tab-stops` - Disable tab stops
- `--var-<name>=<value>` - Set template variables

**Examples:**

```bash
# Basic expansion
emmet expand "ul>li*3" --syntax html
# Output:
# <ul>
#   <li></li>
#   <li></li>
#   <li></li>
# </ul>

# Without tab stops
emmet expand "div.container>p" --syntax html --no-tab-stops

# CSS abbreviation
emmet expand "m10+p5" --syntax css
# Output: margin: 10px; padding: 5px;

# JSX with custom attributes
emmet expand "button[onClick={handleClick}]" --syntax jsx

# Custom indentation (2 spaces)
emmet expand "ul>li*2" --syntax html --indent "  " --no-tab-stops
# Or using short options:
emmet expand "ul>li*2" -s html -i "  " -n

# Set template variables
emmet expand "!" --syntax html --var-lang=en --var-charset=UTF-8

# Using short options for quick commands
emmet expand "div#app>header.header" -s html -f c -n
```

### `emmet wrap <abbreviation>`

Wrap text/selection with Emmet abbreviation (text from stdin).

**Options:**
- `-s, --syntax <lang>` - Language/syntax
- `--multi-line` - Each line becomes a separate item

**Examples:**

```bash
# Wrap single text
echo "Hello World" | emmet wrap "div.greeting" --syntax html
# Output: <div class="greeting">Hello World</div>

# Wrap multiple lines
echo -e "Item 1\nItem 2\nItem 3" | emmet wrap "ul>li*" --syntax html --multi-line
# Output:
# <ul>
#   <li>Item 1</li>
#   <li>Item 2</li>
#   <li>Item 3</li>
# </ul>

# Wrap with nested structure
echo "Content" | emmet wrap "div.container>article" --syntax html
```

### `emmet extract [text]`

Extract abbreviation from text (useful for autocomplete).

**Examples:**

```bash
# Extract from text
emmet extract "div.container" --syntax html

# From stdin
echo "ul>li*3" | emmet extract --syntax html
```

### `emmet validate <abbreviation>`

Validate Emmet abbreviation syntax.

**Examples:**

```bash
# Valid abbreviation
emmet validate "div.container>p*3" --syntax html
# Output: valid

# Invalid abbreviation
emmet validate "div.>>>" --syntax html
# Output: invalid
```

## Supported Languages

### Markup Languages
- `html` - HTML
- `xml` - XML
- `xsl` - XSL
- `jsx` - React JSX
- `tsx` - TypeScript JSX
- `vue` - Vue.js templates
- `svelte` - Svelte components
- `pug` - Pug (Jade)
- `slim` - Slim
- `haml` - HAML

### Stylesheet Languages
- `css` - CSS
- `scss` - Sass SCSS
- `sass` - Sass (indented)
- `less` - LESS
- `stylus` - Stylus
- `sss` - SugarSS

## Configuration

The CLI supports loading custom configuration from multiple locations with the following priority (lowest to highest):

1. Built-in defaults from `@vscode/emmet-helper`
2. User home: `~/.emmet/snippets.json` + `~/.emmet/syntaxProfiles.json` + `~/.emmet/config.json`
3. Project root: `.emmet/snippets.json` + `.emmet/syntaxProfiles.json` + `.emmet/config.json`
4. Custom path via `--config <dir>` flag
5. CLI flags (--var-*, etc.)

### Configuration Files Overview

All configuration files live in the `.emmet/` directory:

- **`snippets.json`** - Custom snippets and template variables per syntax
- **`syntaxProfiles.json`** - Output formatting per syntax (tag case, quotes, self-closing style)
- **`config.json`** - Advanced preferences (BEM separators, CSS units, comment triggers, etc.)

### snippets.json

Define custom snippets and template variables:

```json
{
  "variables": {
    "lang": "en",
    "charset": "UTF-8",
    "author": "Your Name"
  },
  "html": {
    "snippets": {
      "hero": "section.hero>div.container>h1{Hero Title}+p{Hero description}",
      "card": "div.card>img+div.card-body>h3.card-title{Title}+p.card-text{Text}"
    }
  },
  "css": {
    "snippets": {
      "fx": "display: flex;",
      "fxc": "display: flex; align-items: center; justify-content: center;"
    }
  }
}
```

**Usage:**
```bash
emmet expand "hero" --syntax html
emmet expand "fx" --syntax css
```

**Important:** Snippets must be valid Emmet abbreviation syntax (tags, classes, IDs, nesting operators like `>`, `+`, `^`, etc.). Plain text or code won't work - it will be treated as a tag name.

### syntaxProfiles.json

Customize output formatting per syntax:

```json
{
  "html": {
    "tag_case": "lower",
    "attr_case": "lower",
    "attr_quotes": "double",
    "self_closing_tag": "html"
  },
  "jsx": {
    "self_closing_tag": "xhtml"
  }
}
```

### config.json

Advanced preferences and variables:

```json
{
  "variables": {
    "lang": "en",
    "charset": "UTF-8"
  },
  "preferences": {
    "css.intUnit": "rem",
    "css.floatUnit": "rem",
    "bem.elementSeparator": "__",
    "bem.modifierSeparator": "--",
    "profile.allowCompactBoolean": true
  }
}
```

**Available Preferences:**

**CSS Preferences:**
- `css.color.short` - Use short color format (#fff vs #ffffff)
- `css.intUnit` - Unit for integers (default: "px")
- `css.floatUnit` - Unit for floats (default: "em")
- `css.fuzzySearchMinScore` - Fuzzy search threshold 0-1 (default: 0.3)
- `css.valueSeparator` - Between property and value (default: ": ")
- `css.propertyEnd` - After each property (default: ";")

**HTML Formatting:**
- `format.noIndentTags` - Tags to not indent (comma-separated)
- `format.forceIndentationForTags` - Force indentation for tags
- `output.inlineBreak` - Inline elements before line break (default: 3)
- `output.reverseAttributes` - Reverse attribute order
- `output.selfClosingStyle` - "html" | "xhtml" | "xml"

**Boolean Attributes:**
- `profile.allowCompactBoolean` - `<input disabled>` vs `<input disabled="disabled">`

**Comment Filter:**
- Note: Comment filter settings use special defaults from vscode-emmet-helper
- Only override `filter.commentTrigger`, `filter.commentBefore`, `filter.commentAfter` if you need custom comment templates

**BEM:**
- `bem.elementSeparator` - Element separator (default: "__")
- `bem.modifierSeparator` - Modifier separator (default: "_")

## Filters

Emmet filters modify the output of abbreviations. Chain multiple filters with `|`:

### BEM Filter (`|bem`)

Expands BEM (Block Element Modifier) notation:

```bash
emmet expand "ul.nav>li.nav__item*2" --syntax html --filter bem
```

### Comment Filter (`|c`)

Adds HTML comments to elements with ID or class:

```bash
emmet expand "div#app>header.header+main.content" --syntax html --filter c
```

Output:
```html
<div id="app">
  <header class="header"></header>
  <!-- /.header -->
  <main class="content"></main>
  <!-- /.content -->
</div>
<!-- /#app -->
```

### Trim Filter (`|t`)

Removes extra whitespace:

```bash
emmet expand "ul>li*3" --syntax html --filter t
```

### Combined Filters

```bash
emmet expand "div.block>div.block__element" --syntax html --filter "bem,c"
```

## Example Workflows

### React Component Snippets

Create `.emmet/snippets.json`:
```json
{
  "jsx": {
    "snippets": {
      "card": "div.card>div.card-header>h3{Title}^div.card-body>p{Content}",
      "modal": "div.modal>div.modal-content>div.modal-header>h2{Modal Title}^div.modal-body>p{Modal content}^div.modal-footer>button{Close}",
      "form": "form>div.form-group>label{Name}+input[type=text name=username]^button[type=submit]{Submit}"
    }
  }
}
```

Usage:
```bash
emmet expand "card" --syntax jsx --no-tab-stops
# Output: <div className="card">...</div>

emmet expand "form" --syntax jsx --no-tab-stops
# Generates complete form structure with JSX syntax
```

**Note:** Emmet snippets must use Emmet abbreviation syntax (tags, classes, nesting). They cannot contain arbitrary JavaScript code.

### CSS Utility Classes

Create `.emmet/snippets.json`:
```json
{
  "css": {
    "snippets": {
      "flex-center": "display: flex; align-items: center; justify-content: center;",
      "abs-center": "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    }
  }
}
```

Usage:
```bash
emmet expand "flex-center" --syntax css
```

### Team Configuration

Commit `.emmet/` directory to your repository:

```
your-project/
├── .emmet/
│   ├── snippets.json       # Team snippets
│   ├── syntaxProfiles.json # Output formatting
│   └── config.json         # Preferences
├── src/
└── package.json
```

All team members will use the same Emmet configuration!

## Environment Variables

- `DEBUG_EMMET=1` - Enable debug logging

```bash
DEBUG_EMMET=1 emmet expand "div.test" --syntax html
```

## API Usage

```typescript
import { expandCommand, wrapCommand, extractCommand, validateCommand } from '@saifulapm/emmet-cli';

// Expand abbreviation
const html = await expandCommand({
  abbreviation: 'div.container>p*3',
  syntax: 'html',
  tabStops: false
});

// Wrap text
const wrapped = await wrapCommand({
  abbreviation: 'div.wrapper',
  text: 'Hello World',
  syntax: 'html'
});

// Extract abbreviation
const result = await extractCommand({
  text: 'div.test',
  syntax: 'html'
});

// Validate abbreviation
const result = await validateCommand({
  abbreviation: 'ul>li*3',
  syntax: 'html'
});
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or pull request.

## Credits

Built with:
- [@vscode/emmet-helper](https://github.com/microsoft/vscode-emmet-helper) - VSCode's Emmet library
- [emmet](https://github.com/emmetio/emmet) - Emmet core library
