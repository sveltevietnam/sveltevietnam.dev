# @sveltevietnam/ui

## 1.0.0-next.10

### Patch Changes

- [`1c0e2c5`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/1c0e2c59025b43bfca03b7937032c0d5ade7f724) Thanks [@vnphanquang](https://github.com/vnphanquang)! - rename c-callout modifier class names for icon to be more specific

- [`1b0d00f`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/1b0d00fef72dfdb461e22e9dcc3c24aa9fa4354f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - explicit width & height for `FileIcon` for better consistency (in reading mode, for example)

## 1.0.0-next.9

### Patch Changes

- [`31b7f3d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/31b7f3d8859943b42e691730b0df98e292964492) Thanks [@vnphanquang](https://github.com/vnphanquang)! - more resilient c-callout that allow placing on any background

## 1.0.0-next.8

### Patch Changes

- [`07f850a`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/07f850a5d9b2977b75327b923971d24691aa9f62) Thanks [@vnphanquang](https://github.com/vnphanquang)! - set fill to `currentcolor` for `FileIcon.svelte`

## 1.0.0-next.7

### Minor Changes

- [`0a2c3c6`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/0a2c3c63c5b9839627872c198a92a82e11eba047) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki - allow rendering separate filename header with `filename=""` meta prop

### Patch Changes

- [`9cd820e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9cd820e77fe1f23db04fc50381bec42d4abd0ab9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [BREAKING] shiki - change code block metadata syntax to separate line: `/// key=value;...`

## 1.0.0-next.6

### Patch Changes

- [`848024d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/848024de7ea8a09f4d7ebc7299ab0e02043d21b7) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki - should always include `data-lang` property in metadata

## 1.0.0-next.5

### Minor Changes

- [`173a818`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/173a818eadcae1d933183a7e2293a3f540a8fdf9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - set up dual theme Light Plus, Dark Plus for shiki

- [`b7f2c73`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b7f2c736156de4c5faec9d7984f43153c930b147) Thanks [@vnphanquang](https://github.com/vnphanquang)! - better UX for copy button on code block

- [`8184ec0`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/8184ec0aabab496d77a1d889e9461de78b377c8a) Thanks [@vnphanquang](https://github.com/vnphanquang)! - Support multi-tabbed code block with mdsvex & shiki (via `<enhanced-code-block group>`)

- [`b7f2c73`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b7f2c736156de4c5faec9d7984f43153c930b147) Thanks [@vnphanquang](https://github.com/vnphanquang)! - render for code block language at top right

- [`e046f3a`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/e046f3a12e97b49a9ac1257936599909bcc9d1c4) Thanks [@vnphanquang](https://github.com/vnphanquang)! - better predictability and consistency for `enhance-code-block` preprocessor to rely on explicit `<enhanced:codeblock>` element (added automatically by custom shiki transformer)

### Patch Changes

- [`0104d40`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/0104d4074ba3036cf0187adaa30731444127ba4a) Thanks [@vnphanquang](https://github.com/vnphanquang)! - negate "box-like" styling for inline `<code>` that is in an anchor tag

- [`77ac04c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/77ac04cfb8f6528fddbb42782d903da8000ccdce) Thanks [@vnphanquang](https://github.com/vnphanquang)! - fix shiki dual theme colors for highligting and diff lines

- [`4aef36f`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/4aef36f25de4ba9cda03810efbe6f700fab07b81) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki transformer - block regex closing tag should cover HTML comments

## 1.0.0-next.4

### Minor Changes

- [`dc2a188`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/dc2a188a8499f383ff9beae33aa9ff10152174c9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - extract typography base styles (under .prose)

- [`59d639f`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/59d639f5625083f42da90d5a1a2257d6f25039c0) Thanks [@vnphanquang](https://github.com/vnphanquang)! - restructure to better separate css of core & typography presets

### Patch Changes

- [`c8836a4`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/c8836a4a959f41760dc031be1de721dbe3c7f25c) Thanks [@vnphanquang](https://github.com/vnphanquang)! - increase c-callout left border width to 4px

## 1.0.0-next.3

### Minor Changes

- [`1e6d446`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/1e6d4469c5a0967f1715268f23fc01369023bbfd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - restructure for publishing (employ svelte-package)

## 1.0.0-next.2

### Minor Changes

- [`b099d2d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b099d2d0f77b0acb9ada670bf4b1b0617cc3d2b1) Thanks [@vnphanquang](https://github.com/vnphanquang)! - c-input for radio

### Patch Changes

- [`84a2ba3`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/84a2ba3c149c6a80195fd11f1d8a66c538ad0d13) Thanks [@vnphanquang](https://github.com/vnphanquang)! - basic hover & disabled styles for c-btn default & outlined variants

## 1.0.0-next.1

### Major Changes

- [#208](https://github.com/sveltevietnam/sveltevietnam.dev/pull/208) [`da0aa95`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/da0aa95281da20632a678b88d0a592990cf4d765) Thanks [@vnphanquang](https://github.com/vnphanquang)! - extract design system and CSS components to `@sveltevietnam/ui`
