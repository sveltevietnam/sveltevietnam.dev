# Changelog

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
