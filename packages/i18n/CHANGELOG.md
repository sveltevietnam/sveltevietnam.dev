# Changelog

## 0.2.4

### Patch Changes

- [`e49bbd5`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/e49bbd5d718bd4eb9e9aa65382e240b1c5025fd1) Thanks [@vnphanquang](https://github.com/vnphanquang)! - bump yaml to 2.8.2

- [`5efacdf`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/5efacdfb7d53faae647b996a5568a222b94aada3) Thanks [@vnphanquang](https://github.com/vnphanquang)! - bump dedent to 1.7.1

- [`9d46b07`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9d46b07f5eb6c083f1456b17713328b6fccb76b1) Thanks [@vnphanquang](https://github.com/vnphanquang)! - bump valibot to 1.2.0 and @valibot/to-json-schema to 1.5.0

## 0.2.3

### Patch Changes

- [#360](https://github.com/sveltevietnam/sveltevietnam.dev/pull/360) [`edd9859`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/edd98595efa8edb38980fdefb8b5e5151c4d5e97) Thanks [@vnphanquang](https://github.com/vnphanquang)! - (internal) be more explicit in type import paths to support `dts-buddy` on windows

- [#360](https://github.com/sveltevietnam/sveltevietnam.dev/pull/360) [`e6f9b0f`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/e6f9b0f78e0d4a8f042b30e619da6963477e857f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - resolve paths correctly on windows

## 0.2.2

### Patch Changes

- [`73a50b3`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/73a50b32a89ac33e713be7867938621e5a31d22c) Thanks [@vnphanquang](https://github.com/vnphanquang)! - revert #1f366dbb2f11fc12dfac71f986e302b59a49f5b6, keep `MaybeHtml` proxy for now, otherwise cause another kind of destructive issue at runtime

## 0.2.1

### Patch Changes

- [`1f366db`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/1f366dbb2f11fc12dfac71f986e302b59a49f5b6) Thanks [@vnphanquang](https://github.com/vnphanquang)! - remove `MaybeHtml` proxy, await directly in script tag, avoid hydration mismatch issue in production build

## 0.2.0

### Minor Changes

- [`0d9a18e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/0d9a18e41b4289df4715f7da4bdc0aee3192dca8) Thanks [@vnphanquang](https://github.com/vnphanquang)! - flatten `options` input field in `t` to better align with `T` prop interface

- [`86b69d5`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/86b69d530bc3064d7a4c717223d3ff1423f354d3) Thanks [@vnphanquang](https://github.com/vnphanquang)! - generate `prerender` remote function

- [`20d705f`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/20d705fe383da32279a13fcc33041761108f5d4b) Thanks [@vnphanquang](https://github.com/vnphanquang)! - support custom remote function via `remote` prop / input option to `Provider`, `Context`, `T`, `t`

- [`9b4ba0d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9b4ba0d7e73dc0515a09e80eec9fcfd302d41def) Thanks [@vnphanquang](https://github.com/vnphanquang)! - allow importing generated messages, constants, and remote module via `@sveltevietnam/i18n/*`

- [`e1252bd`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/e1252bd7d6fe15069e33ad4c5e51ca58d8c8706a) Thanks [@vnphanquang](https://github.com/vnphanquang)! - switch default remote fuction to `prerender`

### Patch Changes

- [`33009fb`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/33009fb60d74dc4a3c056b610a4847bb45692401) Thanks [@vnphanquang](https://github.com/vnphanquang)! - rename generated remote function `t` to `query` for clarity, and leave room for other potential functions in the future

- [`9f7fb0a`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9f7fb0a408f298a9edf5a1379dc1c2fb47264459) Thanks [@vnphanquang](https://github.com/vnphanquang)! - better type inference support for `query` remote function when imported from `@sveltevietnam/i18n/generated/t.remote`

- [`9ff68f6`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9ff68f6d25a147d63a7f86eeead26c7c4fc4dc0f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - improve type inference for `RemoteTranslate` and `StaticTranslate` from context.t

- [`7005d8d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/7005d8deba5440b727ab23859e625c7d040c3fc7) Thanks [@vnphanquang](https://github.com/vnphanquang)! - make remote prop mandatory for ContextInit and Provider

## 0.1.2

### Patch Changes

- [`4d010d0`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/4d010d03f3ca26ee23d500cbb77d2ddaae0636e1) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add missing svelte export conditions

- [`cc3cf9c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/cc3cf9c9eee30b821e8dceff2d0b57771d8f2282) Thanks [@vnphanquang](https://github.com/vnphanquang)! - exclude '$i18n/\*' imports from being prebundling

## 0.1.1

### Patch Changes

- [`6032aca`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/6032aca4ccb0747f105066a91d72cc35b8a08dba) Thanks [@vnphanquang](https://github.com/vnphanquang)! - remove commander and clack prompt dependencies (cli was removed)

- [`6574854`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/657485494efdafd6fb6330149ca756f7eaf78da1) Thanks [@vnphanquang](https://github.com/vnphanquang)! - normalize lang identifier (support lang with subtag, e.g. de-AT)

## 0.1.0

### Minor Changes

- [#352](https://github.com/sveltevietnam/sveltevietnam.dev/pull/352) [`5a4f681`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/5a4f681f39fb5b9ea7aea2acea57e18d77d4a065) Thanks [@vnphanquang](https://github.com/vnphanquang)! - a revised implemention, now with better typing, public API, tests, and most important of all, remote function integration; here be dragon!
