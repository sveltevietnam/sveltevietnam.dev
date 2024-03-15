# @sveltevietnam/ui

## 1.0.0-next.22

### Patch Changes

- [`abe2fc6`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/abe2fc68f0bc6f09fec1fec0cd1599b770119e30) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `EnhancedCodeBlock` - avoid using crypto to cover more env

## 1.0.0-next.21

### Patch Changes

- [`c17a1d4`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/c17a1d4faffc33ac0a7fdc3e843e2306cbd24272) Thanks [@vnphanquang](https://github.com/vnphanquang)! - merge `current` and `initial` prop of `EnhancedCodeBlockGroup` to a single `title` prop to keep things simple and consistent

## 1.0.0-next.20

### Minor Changes

- [`b336319`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b336319c8505fe39f6782bc0db1baf455443f575) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add `--icon-question` variant to `c-callout`

## 1.0.0-next.19

### Minor Changes

- [`8e2638c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/8e2638c5345ac43a3015f265ba7f42fbdcc307d6) Thanks [@vnphanquang](https://github.com/vnphanquang)! - consolidate `filename` and `tab` prop of `EnhancedCodeBlock` to `title`

### Patch Changes

- [`bf33533`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/bf33533cc2f2ea7284cbe3e590ae00293a91e9fe) Thanks [@vnphanquang](https://github.com/vnphanquang)! - safelist `sr-only` TailwindCSS class (used `EnhancedCodeBlock`)

## 1.0.0-next.18

### Patch Changes

- [`ee3738e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/ee3738e7f3a60d6c5d398d13a81c733062545b58) Thanks [@vnphanquang](https://github.com/vnphanquang)! - fix media query gaps with the new [range syntax](https://web.dev/articles/media-query-range-syntax)

## 1.0.0-next.17

### Minor Changes

- [`7014fff`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/7014fffdded8d3f7f326a966396a257f39563213) Thanks [@vnphanquang](https://github.com/vnphanquang)! - allow `EnhancedCodeBlock` to be collapisble (no JS)

### Patch Changes

- [`7014fff`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/7014fffdded8d3f7f326a966396a257f39563213) Thanks [@vnphanquang](https://github.com/vnphanquang)! - prop accepted by `EnhancedCodeBlock` should be string (passed in by shiki transformer)

- [`7014fff`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/7014fffdded8d3f7f326a966396a257f39563213) Thanks [@vnphanquang](https://github.com/vnphanquang)! - adaptive line number `::before` pseudoelement's width depending on the total number of lines

## 1.0.0-next.16

### Minor Changes

- [`c6e6a10`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/c6e6a10ab9ea648972eb09c4e38e77b09592233a) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `shiki` - allow rendering the content of code block from a different file, via the `/// src=relative_path.ext` meta line (using custom built MDsveX from [vnphanquang/MDsveX](https://github.com/vnphanquang/MDsveX/))

- [`b72ff75`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b72ff7570eaccd32153dcd62c6e94391a3493fb3) Thanks [@vnphanquang](https://github.com/vnphanquang)! - rewrite `EnhancedCodeBlock` to make full screen button possible (#241)

- [`ef7951c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/ef7951c166eaf2446fc34f3783f736ab3427cf26) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki - allow skipping meta block processing (diff & highlight) via the `/// skipMetaBlock=true` meta line

### Patch Changes

- [`9f1c3ba`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9f1c3ba3cba2c06c7536ebed072d27ec21357d96) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki - render line number if there is only one applicable line but also one or more diff lines

- [`de5adf0`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/de5adf098141f09108d5c25d9d2dd5ff6feb513c) Thanks [@vnphanquang](https://github.com/vnphanquang)! - allow explicit `cols` prop for `enhanced-code-block` group

## 1.0.0-next.15

### Minor Changes

- [#239](https://github.com/sveltevietnam/sveltevietnam.dev/pull/239) [`c3b0e41`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/c3b0e411c108dd98e5f8a0915b2928c79695ee71) Thanks [@vnphanquang](https://github.com/vnphanquang)! - new c-callout--icon-megaphone variant

### Patch Changes

- [`5a5f5c0`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/5a5f5c0d8f3e2b1d29c9a47b81bc93022861c812) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki mdsvex - avoid infinite loop in `parseMetadata` if there is only one line

- [#239](https://github.com/sveltevietnam/sveltevietnam.dev/pull/239) [`2d23f88`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/2d23f887828fa7728721ae12effab5d6f516602b) Thanks [@vnphanquang](https://github.com/vnphanquang)! - deprecate cssnano, minifying should be done by vite

## 1.0.0-next.14

### Minor Changes

- [`277eeb0`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/277eeb0d8ccb578fec564a342c79da13da18f35f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - allow hiding line numbers via explicit `hideLineNumber` props

- [`0f5708c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/0f5708cf75eed3cf0ec9779dbea8b47c8e500484) Thanks [@vnphanquang](https://github.com/vnphanquang)! - shiki: hide line number if only one line

- [`18f2042`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/18f2042da44ff69d8132d5d140f28303c94a749d) Thanks [@vnphanquang](https://github.com/vnphanquang)! - enhanced code block group - two display modes, `tabs` and `files` (default)

### Patch Changes

- [`bb24026`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/bb24026158b0adf7577159ec0f7fedbf7c36e716) Thanks [@vnphanquang](https://github.com/vnphanquang)! - enhance-code-block: (group) change `id` prop to `name` for better consistency with html input, allow explicit declaration

- [`7daf879`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/7daf879013943fbffb0d2f1de4b5986e21fde32b) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `.first-row-last-col-fill` in `EnhancedCodeBlockGroup` should shift down 1px relatively to itself to align with lables on the left

## 1.0.0-next.13

### Patch Changes

- [`118dc47`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/118dc4760c44cc1734b5af27db2a64a0cb1961ad) Thanks [@vnphanquang](https://github.com/vnphanquang)! - safelisting `.shiki` class for typography preset

## 1.0.0-next.12

### Patch Changes

- [`3e64684`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/3e64684360009e042cfbca086fd1aee0920110e9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `EnhancedCodeBlock` - better lang overlay for non-filename block

## 1.0.0-next.11

### Minor Changes

- [`c874c26`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/c874c2670270f29ca06658545d922001580c5641) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add --icon-confetti and --icon-trophy variants to c-callout component

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
