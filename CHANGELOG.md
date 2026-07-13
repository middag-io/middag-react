# Changelog

## [0.38.0](https://github.com/middag-io/middag-react/compare/v0.37.1...v0.38.0) (2026-07-13)


### ⚠ BREAKING CHANGES

* **blocks:** the tabbed_panel block is renamed to tabs (tab item key -> id), and workflow_progress is no longer registered by the free package (moved to @middag-io/react-pro).

### Features

* **blocks:** rename tabbed_panel to tabs, add chart, move workflow_progress to pro ([d9a21fe](https://github.com/middag-io/middag-react/commit/d9a21feee7d190484472bf085ff5eb0e70d65660))
* **blocks:** rename tabbed_panel to tabs, add chart, move workflow_progress to pro ([4c41b61](https://github.com/middag-io/middag-react/commit/4c41b61f62bdc3c16c6ad9eb4264240f52aaa7bd))


### Refactoring

* **engine:** rename src/app to src/engine ([0963b85](https://github.com/middag-io/middag-react/commit/0963b85c797b55581d2be9ea11c1593b26afd01f))
* group vendored primitives, gallery and icons under src/primitives/ ([e689608](https://github.com/middag-io/middag-react/commit/e6896088e654891a798ab49aaebe5c9538ca67da))
* move example gallery out of src into repo-root examples/ ([a2a7e0d](https://github.com/middag-io/middag-react/commit/a2a7e0dc2c692ab98f87e1d55986eb0e31cbf249))


### Documentation

* **schemas:** rename tabbed_panel to tabs and add chart block manifest ([be2f3d9](https://github.com/middag-io/middag-react/commit/be2f3d9fc6f5f2446346cbab2afafa84fef11e86))

## [0.37.1](https://github.com/middag-io/middag-react/compare/v0.37.0...v0.37.1) (2026-07-09)


### Bug Fixes

* **form:** space collapsible section content and stop toggle submitting ([16fcf26](https://github.com/middag-io/middag-react/commit/16fcf26a11d13fed61c485e7f45441cfc4568178))
* **theme:** default bare border utility to --color-border token ([567907b](https://github.com/middag-io/middag-react/commit/567907b7c22e1116aacca6941da87c8e30ab0428))

## [0.37.0](https://github.com/middag-io/middag-react/compare/v0.36.2...v0.37.0) (2026-07-09)


### Features

* **form:** export FormField + multiselect combobox variant ([c96018a](https://github.com/middag-io/middag-react/commit/c96018a697eb000975f5594e51ca345b6ed58294))
* **form:** export FormField and add multiselect combobox variant ([186894c](https://github.com/middag-io/middag-react/commit/186894c1598305bdb84b41967f18e04dcf879e7b))

## [0.36.2](https://github.com/middag-io/middag-react/compare/v0.36.1...v0.36.2) (2026-07-09)


### Bug Fixes

* **form:** space collapsible section content and stop toggle submitting ([4688d9e](https://github.com/middag-io/middag-react/commit/4688d9ec3de3f62cfd99a73c0abee128046381af))

## [0.36.1](https://github.com/middag-io/middag-react/compare/v0.36.0...v0.36.1) (2026-07-08)


### Bug Fixes

* **theme:** default bare border utility to --color-border token ([b0fc1f2](https://github.com/middag-io/middag-react/commit/b0fc1f22183a2fa6a5ace2b4d87f40c2cf05567c))
* **theme:** default bare border utility to --color-border token ([af5ccf4](https://github.com/middag-io/middag-react/commit/af5ccf47d440920e44ec844906de695bbce28f54))

## [0.36.0](https://github.com/middag-io/middag-react/compare/v0.35.3...v0.36.0) (2026-07-06)


### Features

* **app:** add content-only shell mode to ContractPage ([cf291bd](https://github.com/middag-io/middag-react/commit/cf291bd64ef0bcced908ad4cf7793eb43beb273c))

## [0.35.3](https://github.com/middag-io/middag-react/compare/v0.35.2...v0.35.3) (2026-07-06)


### Bug Fixes

* **build:** externalize react-i18next to dedupe consumer copy ([474de60](https://github.com/middag-io/middag-react/commit/474de60e46d28da65d2bf80b2f3b0e673bf18b9f))

## [0.35.2](https://github.com/middag-io/middag-react/compare/v0.35.1...v0.35.2) (2026-07-05)


### Bug Fixes

* **contracts:** sync generated contracts with the TableDisplayOptions schema rename ([998c182](https://github.com/middag-io/middag-react/commit/998c1823e86649b9c47809efffd7997bb5b6a63e))

## @middag-io/react

Releases up to and including `0.35.1` were cut from the original private
monorepo (now `middag-io/middag-react-pro`); their changelog history lives
there. This file starts fresh with the first release from this repository.
