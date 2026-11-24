# Changelog

## [0.2.0](https://github.com/middag-io/middag-react/compare/ui-contracts-codegen-v0.1.1...ui-contracts-codegen-v0.2.0) (2026-11-24)


### Features

* **contracts-codegen:** refuse wire breaks only from a 2.0.0-rc.1 producer on ([baee0ed](https://github.com/middag-io/middag-react/commit/baee0edeca2ee2be74ae47bfbe1905a67cfd10af))


### Bug Fixes

* **contracts-codegen:** close the gaps in the release-candidate gate ([ba83a2f](https://github.com/middag-io/middag-react/commit/ba83a2fd8e05f91d9254d7316311609f05391e2e))

## [0.1.1](https://github.com/middag-io/middag-react/compare/ui-contracts-codegen-v0.1.0...ui-contracts-codegen-v0.1.1) (2026-11-23)


### Bug Fixes

* **ui-contracts:** replace the enum catch with open enums for presentational values ([65cdc00](https://github.com/middag-io/middag-react/commit/65cdc0052facc85f0bc77000a86d67a7820d278e))

## 0.1.0 (2026-11-19)


### Features

* **contracts-codegen:** add the @middag-io/ui-contracts-codegen package ([7b052a9](https://github.com/middag-io/middag-react/commit/7b052a9df782a1850a356bfea74ff0e77e603b70))
* **contracts-codegen:** add the @middag-io/ui-contracts-codegen package ([58a1329](https://github.com/middag-io/middag-react/commit/58a1329cb8d04725c403f07edc2a736f24b82c3a))

### Consumer impact

The generator reads an `openEnums` list from `contracts.config.json`; those enums emit a union of the strict enum and `z.string()`. Other enums are unchanged.
