# Changelog

## 1.0.0-next.6

### Minor Changes

- [`96c1b22`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/96c1b22ddb03ee043c507298b4bbbaa842e1cee9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - refactor to use ESM for postcss and tailwind

### Patch Changes

- [`5883cec`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/5883cecdb8b4f34f06ac0cc0d23e296b0d43d2a9) Thanks [@vnphanquang](https://github.com/vnphanquang)! - Switch to tabs for indentation

## 1.0.0-next.5

### Minor Changes

- [#146](https://github.com/sveltevietnam/sveltevietnam.dev/pull/146) [`cb3d0cb`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/cb3d0cba787a723cb3cbd351ae129a8ff0fa4f9b) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add `blog` as a new subscription domain

## 1.0.0-next.4

### Patch Changes

- [`29beb86`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/29beb868e893c4ec11206f38d95d460b5bf4809d) Thanks [@vnphanquang](https://github.com/vnphanquang)! - change logo to png for better support in email

## 1.0.0-next.3

### Patch Changes

- [`df1e78b`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/df1e78b4b03d2d1fdbea90152070f49212e697c3) Thanks [@vnphanquang](https://github.com/vnphanquang)! - change social icon to png for better support in email

## 1.0.0-next.2

### Minor Changes

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`5687242`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/5687242d589f4eede3323ac20f0fea3d51012b07) Thanks [@vnphanquang](https://github.com/vnphanquang)! - MJML workflow and `/send` API

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`e54f748`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/e54f74895f2ef20f7a1b02bffd7b630f6ec67f75) Thanks [@vnphanquang](https://github.com/vnphanquang)! - PATCH `/subscription` for updating domain subscription

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`b153d2e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b153d2e81166d5eca1728e5500a7bc8e8273027f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `/verify` API for token verification

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`538edd5`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/538edd510052dc72ff6ab9d8267091b783bd3b37) Thanks [@vnphanquang](https://github.com/vnphanquang)! - complete the `WELCOME` email template (with i18n support)

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`d7ab23c`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/d7ab23ca524c6562ab23e3021a28c4e39981f640) Thanks [@vnphanquang](https://github.com/vnphanquang)! - www `/subscriptions/[token]` route for managing user subscription

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`195dcb1`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/195dcb14f157313f1edb4d6d16c23307dd189e78) Thanks [@vnphanquang](https://github.com/vnphanquang)! - GET `/subscription` for getting domain subscription details

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`ce9167e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/ce9167e9acbac20161ef835e0e575956bfe5b6cd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - Bypass authentication if request is made internally

### Patch Changes

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`9b9ece1`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/9b9ece173c5aced2c35b93ffe3c97ca80a82316f) Thanks [@vnphanquang](https://github.com/vnphanquang)! - [breaking] let id be manually created during insertion (mails table). This commit edits a migration file, which is fine in this case but should be avoided in the future

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`90eb50d`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/90eb50db1c3004f7bc7acec1aafc33d92062c96c) Thanks [@vnphanquang](https://github.com/vnphanquang)! - move binding `locals.d1` (hooks) to top, apply to all routes, but accept for when building (otherwise svelte kit will fail with 500 when trying to render 404 page)

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`71bf13e`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/71bf13e2659d10417026c0c5569d814e267f4af0) Thanks [@vnphanquang](https://github.com/vnphanquang)! - throw svelte kit expected error and let svelte kit handle response

- [#136](https://github.com/sveltevietnam/sveltevietnam.dev/pull/136) [`3b05336`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/3b05336a477ee4232014399b3b174a3f8f526628) Thanks [@vnphanquang](https://github.com/vnphanquang)! - add `language` and `template_id` columns to `mails` table

## 1.0.0-next.1

### Patch Changes

- [`481ed89`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/481ed898c6e35c8c999464d9569be0429d1ba847) Thanks [@vnphanquang](https://github.com/vnphanquang)! - Add static social image svgs for use in email templates

## 1.0.0-next.0

### Major Changes

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`924f8e6`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/924f8e6bca243509de4da3c55f4924426f04f117) Thanks [@vnphanquang](https://github.com/vnphanquang)! - setup and preparation for initial release

### Minor Changes

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`eaa6bea`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/eaa6beabba84ad0703cd6ceb9dae7cca32e997b0) Thanks [@vnphanquang](https://github.com/vnphanquang)! - create initial migrations for `clients` and `subscriptions` tables

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`02254e6`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/02254e60ac7637f519a1b05e87ced064b21479c5) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `/healthz` route that returns `{ status: 'ok' }`

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`454e523`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/454e5238b5f915ed14c8b7d86d41b3910b6f09dd) Thanks [@vnphanquang](https://github.com/vnphanquang)! - provide DTO types for subscription endpoints

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`8faa5a7`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/8faa5a723fc56eb9ebf84d8f53e1918ea626fd70) Thanks [@vnphanquang](https://github.com/vnphanquang)! - reconciliation for `/subscribe` endpoint from mailer service

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`51f5dae`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/51f5daec9d14ee05b6272ea4f659c8621f3c9566) Thanks [@vnphanquang](https://github.com/vnphanquang)! - `/subscribe` endpoint

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`b13b5aa`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/b13b5aa3f910c11ab534b9856b57f2bf16204c04) Thanks [@vnphanquang](https://github.com/vnphanquang)! - basic authentication with client identitifcation (d1) and request signing

### Patch Changes

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`f3829b3`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/f3829b30f1ac069291f42869fa74f59b5b684ca6) Thanks [@vnphanquang](https://github.com/vnphanquang)! - calls to `verifyRequest` should be awaited

- [#131](https://github.com/sveltevietnam/sveltevietnam.dev/pull/131) [`93765c5`](https://github.com/sveltevietnam/sveltevietnam.dev/commit/93765c50adb73934090b6d94817965c1e9477123) Thanks [@vnphanquang](https://github.com/vnphanquang)! - d1 queries should return an object
