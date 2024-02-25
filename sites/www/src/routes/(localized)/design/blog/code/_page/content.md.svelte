# Svelte Vietnam - Enhanced Code Block

## One-liner Single Code Block

```javascript
console.log('Hello, world!');
```

## Single Code Block

```javascript
document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello, world!');
});
```

## Single Code Block With Filename

```javascript
/// filename=app.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello, world!');
});
```

## Group of Code Blocks with `tabs` Display Mode

<enhanced-code-block group name="installation" display="tabs">

```bash
/// tab=npm
/// hideLineNumber=true
npm install --save-dev tailwindcss postcss @sveltevietnam/ui
# something else to admire
```

```bash
/// tab=pnpm
pnpm add -D tailwindcss postcss @sveltevietnam/ui
```

```bash
/// tab=yarn
yarn add -D tailwindcss postcss @sveltevietnam/ui
```

</enhanced-code-block>

## Group of Code Blocks with `files` Display Mode

<enhanced-code-block group>

```html
/// filename=app.html
<!DOCTYPE html>
<head></head>
<body>
	<header></header>
	<main></main>
	<footer></footer>
</body>
```

```css
/// filename=app.css
@tailwindcss base;
@tailwindcss components;
@tailwindcss utilities;
```

```javascript
/// filename=app.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello, world!');
});
```

</enhanced-code-block>
