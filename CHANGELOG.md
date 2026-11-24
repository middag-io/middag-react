# Changelog

## [0.50.1](https://github.com/middag-io/middag-react/compare/v0.50.0...v0.50.1) (2026-11-24)


### Bug Fixes

* preserve page query params in server-mode table requests ([3e4c596](https://github.com/middag-io/middag-react/commit/3e4c596d88201fc0cc71ab65258914f3b3a292e6))


### Build System

* **deps:** bump i18next from 26.3.1 to 26.3.4 ([099f687](https://github.com/middag-io/middag-react/commit/099f6870fc9cf1077dceeac7a14b7d374c503ea9))

## [0.50.0](https://github.com/middag-io/middag-react/compare/v0.49.0...v0.50.0) (2026-11-24)


### ⚠ BREAKING CHANGES

* **contracts:** 'PageResources' is no longer exported and the page contract has no 'resources'. 'FormErrors' now accepts rich messages inside lists and 'errors' may be a 'FormErrorBags' map.

### Features

* **contracts-codegen:** refuse wire breaks only from a 2.0.0-rc.1 producer on ([baee0ed](https://github.com/middag-io/middag-react/commit/baee0edeca2ee2be74ae47bfbe1905a67cfd10af))
* **contracts:** adopt the middag-php-ui 1.14.0 contract ([0dfebb7](https://github.com/middag-io/middag-react/commit/0dfebb7a5c263ea98c47006a0473fc1a6115918d))
* **shell:** render external and targeted nav links as plain anchors ([ff573b4](https://github.com/middag-io/middag-react/commit/ff573b4ee470b3c3e0790b16991ad4ddef9d4df1))


### Bug Fixes

* **contracts-codegen:** close the gaps in the release-candidate gate ([ba83a2f](https://github.com/middag-io/middag-react/commit/ba83a2fd8e05f91d9254d7316311609f05391e2e))
* stop tracking the node_modules symlink ([70ab4b0](https://github.com/middag-io/middag-react/commit/70ab4b0417432325d14ceead79b6a5f26f26291c))

## [0.49.0](https://github.com/middag-io/middag-react/compare/v0.48.0...v0.49.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **contracts:** 'ConnectorStatus', 'CredentialField', 'HealthCheckResult', 'ConnectorListItem', 'ConnectorDetail' and 'ConnectorTypeInfo' are no longer exported, and the 'connectors' schema is gone from the published schemas.

### Features

* **contracts:** drop the connector types from the public API ([e86ec44](https://github.com/middag-io/middag-react/commit/e86ec4474c595842c11a11d6be1a1fb2c7b75478))

## [0.48.0](https://github.com/middag-io/middag-react/compare/v0.47.0...v0.48.0) (2026-11-23)


### ⚠ BREAKING CHANGES

* **contracts:** the page contract version is '2'. 'PageResources' no longer has 'user', 'capabilities' or 'preferences'. 'SharedPropsAuth', 'SharedPropsTheme', 'SharedPropsFlash' and 'NavigationTreePayload' are now 'SharedAuth', 'SharedTheme', 'FlashMessages' and 'NavigationTree', with no alias. 'NavigationEntityType' is gone and 'registerEntityIcon' takes a string. 'auth.id' is a string, 'email', 'theme', 'locale' and 'navigation' are optional, 'flash.toast', 'version', 'theme.brandColor', 'theme.inherit' and 'drilldownStack' are gone. 'useAuth().user.id' is a string.

### Features

* **contracts:** adopt the middag-php-ui 1.13.0 contract ([cadddcd](https://github.com/middag-io/middag-react/commit/cadddcdaefda90b6bf7bdaa469cb27bd67e7ff14))


### Bug Fixes

* **githooks:** accept the breaking-change marker in commit messages ([0117dbd](https://github.com/middag-io/middag-react/commit/0117dbd1c1a6b56ad6e87ca009f2f61bbebad268))

## [0.47.0](https://github.com/middag-io/middag-react/compare/v0.46.1...v0.47.0) (2026-11-23)


### Features

* **ui-contracts:** accept richtext, time, autocomplete and translatable or null section labels ([25f8d72](https://github.com/middag-io/middag-react/commit/25f8d72a236659a565fadbf51f49d566222176b3))


### Bug Fixes

* **ui-contracts:** mirror the released middag-php-ui v1.11.0 schemas ([4b01e47](https://github.com/middag-io/middag-react/commit/4b01e47011470c81b8eb83b8c46c2fff196a442c))
* **ui-contracts:** replace the enum catch with open enums for presentational values ([65cdc00](https://github.com/middag-io/middag-react/commit/65cdc0052facc85f0bc77000a86d67a7820d278e))


### Documentation

* add consumer impact to the changelog ([534ed21](https://github.com/middag-io/middag-react/commit/534ed2172b474421190ec7dbdf301055ae627b56))

### Consumer impact

An unknown `ActionIntent` renders with danger styling, an unknown theme preference resolves like `system`, and `FilterBar` skips filters of an unknown type. The contracts mirror and the new form components come from `ui-contracts` 0.2.0.

## [0.46.1](https://github.com/middag-io/middag-react/compare/v0.46.0...v0.46.1) (2026-11-19)


### Refactoring

* **contracts:** generate the engine contract through @middag-io/ui-contracts ([2ad809b](https://github.com/middag-io/middag-react/commit/2ad809bdca07ba2e95a0e76694c92dd3582a2919))
* **contracts:** generate the wire contract through @middag-io/ui-contracts ([a77f9ff](https://github.com/middag-io/middag-react/commit/a77f9ff4588489534f617b7594ff89042c132b59))


### Documentation

* describe the contracts mirror and packages ([001fd2a](https://github.com/middag-io/middag-react/commit/001fd2a801d4779160d2a628c5909e4f49d9b67e))

## [0.46.0](https://github.com/middag-io/middag-react/compare/v0.45.4...v0.46.0) (2026-11-19)


### Features

* **contracts-codegen:** add the @middag-io/ui-contracts-codegen package ([7b052a9](https://github.com/middag-io/middag-react/commit/7b052a9df782a1850a356bfea74ff0e77e603b70))

## [0.45.4](https://github.com/middag-io/middag-react/compare/v0.45.3...v0.45.4) (2026-11-16)


### Bug Fixes

* keep the full query and reload the contract in server tables ([eb695fd](https://github.com/middag-io/middag-react/commit/eb695fddabd86bf73a6b0d4c9d33aebe91e58d32))

## [0.45.3](https://github.com/middag-io/middag-react/compare/v0.45.2...v0.45.3) (2026-11-16)


### Documentation

* translate the remaining Portuguese text and complete Help and status ([7f87370](https://github.com/middag-io/middag-react/commit/7f87370d344e54c9c782f0be72553c1ae3ab2744))

## [0.45.2](https://github.com/middag-io/middag-react/compare/v0.45.1...v0.45.2) (2026-11-16)


### Bug Fixes

* **publish:** find the packed tarball on disk in the npm guard, so the package ships with its `dependencies` ([fab3e1c](https://github.com/middag-io/middag-react/commit/fab3e1c9fdf1e1dedcc1a3ae44a3d8748f61d0cb))
* **publish:** pin the next release to 0.45.2 ([097b2af](https://github.com/middag-io/middag-react/commit/097b2afa012677f3a63879c6754ea847c80b12f6))

## [0.45.1](https://github.com/middag-io/middag-react/compare/v0.45.0...v0.45.1) (2026-11-16)


### Bug Fixes

* **publish:** keep dependencies in the public npm package ([a751d98](https://github.com/middag-io/middag-react/commit/a751d9856dc6917d9d0742c5dd312563ed50bd73))

## [0.45.0](https://github.com/middag-io/middag-react/compare/v0.44.1...v0.45.0) (2026-11-16)


### Features

* **blocks:** cap a dense table column and let it map its own status colours ([960c4c8](https://github.com/middag-io/middag-react/commit/960c4c8b0c5fae37025615f3b61cd821ce9de745))
* **blocks:** give link list rows a right side, a selected state and a dense mode ([a812024](https://github.com/middag-io/middag-react/commit/a812024b444309842c3a3560570800fd80ad1bef))
* carry the file value's pending upload as an opaque uploadToken ([6b51743](https://github.com/middag-io/middag-react/commit/6b51743ba28f6823605dd5dbab3607afb45f4222))
* **partials:** draw the date range filter the contract already declared ([06cc70c](https://github.com/middag-io/middag-react/commit/06cc70c73ba30112c551bebdf5ab6886f188c483))
* **partials:** draw the multiselect filter the contract already declared ([9abaf35](https://github.com/middag-io/middag-react/commit/9abaf3544f0dbbd75c93c7ac29b3207126bbcbf5))
* **partials:** make the table toolbar's two dead controls work ([b2ec625](https://github.com/middag-io/middag-react/commit/b2ec6259d04dab6aba8e35ffe7bf96249a45eba5))


### Bug Fixes

* **blocks:** navigate internal link list items through Inertia ([2fa482d](https://github.com/middag-io/middag-react/commit/2fa482d5d9617bfd3e40b84eb6f0f2b176b15fd7))
* **form:** actually read the field registry when routing a field ([59346d9](https://github.com/middag-io/middag-react/commit/59346d98187fddd4776ecbc87bf2ab81918b5024))
* **layout:** keep the dashboard aside on screen, and let a page size it ([786bfaa](https://github.com/middag-io/middag-react/commit/786bfaa8d8b3c5c1c0614b3ed3a1cceb2e6692c2))
* **partials:** hold the column cap on the column, not on the text ([e308ebe](https://github.com/middag-io/middag-react/commit/e308ebed09ca768e54d529e9104ad72d265f628a))
* **partials:** match statusMap keys case-insensitively ([cd15c47](https://github.com/middag-io/middag-react/commit/cd15c47acbc3f9257e266b777347f5847c0e6a42))
* **partials:** render the confirmation message as text, not HTML ([cad4508](https://github.com/middag-io/middag-react/commit/cad4508f2db8bd2b3ac95047ed0485c13895b239))
* **partials:** sanitize html cells and chart colour styles ([304a606](https://github.com/middag-io/middag-react/commit/304a60679883e96ff782f12fb890a4f3ea94971a))
* **shell:** draw the icon a page action declares ([7dd4f5d](https://github.com/middag-io/middag-react/commit/7dd4f5d06f170fd5fbd72a1a64021acb7bd61ef4))


### Documentation

* add help and status to the README ([859f461](https://github.com/middag-io/middag-react/commit/859f461565f46efde0e4b819845fa1463025a81b))
* **partials:** translate the DataTable column width comment to English ([19b4088](https://github.com/middag-io/middag-react/commit/19b4088e63afb8342df37cb530438ff2cec2c5bc))

## [0.44.1](https://github.com/middag-io/middag-react/compare/v0.44.0...v0.44.1) (2026-11-14)


### Bug Fixes

* disabled PageActionButton navigation renders a locked button without href ([1903b87](https://github.com/middag-io/middag-react/commit/1903b8789c149573b1c755f238b456b7a71e61af))
* disabled PageActionButton navigation renders a locked button without href ([20ae7c6](https://github.com/middag-io/middag-react/commit/20ae7c6d06c6d573009202840ea38ee104d23874))

## [0.44.0](https://github.com/middag-io/middag-react/compare/v0.43.0...v0.44.0) (2026-11-11)


### Features

* **test:** stable data-testid on blocks, actions, fields, rows and dialogs ([b13ce8b](https://github.com/middag-io/middag-react/commit/b13ce8bbd0257a09405054fdbed289374ebccc83))
* **test:** stable data-testid on blocks, actions, fields, rows and dialogs ([6190a4d](https://github.com/middag-io/middag-react/commit/6190a4dd0986ef0b922437fe5c4e9ecb529d3b74))

## [0.43.0](https://github.com/middag-io/middag-react/compare/v0.42.0...v0.43.0) (2026-11-10)


### Features

* **lib:** let the host track pending fetch side-calls ([a70ade2](https://github.com/middag-io/middag-react/commit/a70ade2f44500877f6b57399ef7ff0e759467160))
* **lib:** let the host track pending fetch side-calls ([8389b27](https://github.com/middag-io/middag-react/commit/8389b27fced0473990074b9e165ea3697bf3086f))


### Bug Fixes

* **deps:** bump vitest to ^4.1.12 ([a4019da](https://github.com/middag-io/middag-react/commit/a4019daa887a9dcaa34c6a9340160b9dc593e5ef))
* **deps:** bump vitest to ^4.1.12 ([d2c38ab](https://github.com/middag-io/middag-react/commit/d2c38abdd799afa3d76b48172623bc4569423cb5))
* **deps:** override happy-dom to 21.0.4 ([f0e967e](https://github.com/middag-io/middag-react/commit/f0e967e650f6b21576a9d463cefc2c7fa156447c))
* **deps:** update vite to 8.1.6 ([7d4e217](https://github.com/middag-io/middag-react/commit/7d4e217d431dd0439212044350f252c414ba2be2))
* **deps:** update vulnerable transitive dependencies with npm audit fix ([655c075](https://github.com/middag-io/middag-react/commit/655c075003b9df31f3e22608a9b1ee3aa7bc5681))

## [0.42.0](https://github.com/middag-io/middag-react/compare/v0.41.1...v0.42.0) (2026-09-16)


### Features

* **blocks:** TabsBlock disables a tab trigger when Tab.disabled is set ([4941735](https://github.com/middag-io/middag-react/commit/494173576d8b6074462dee87eb7edfa655a28620))
* **blocks:** TabsBlock disables a tab trigger when Tab.disabled is set ([90601e3](https://github.com/middag-io/middag-react/commit/90601e3626eace04ff70cda944f5268081921923))

## [0.41.1](https://github.com/middag-io/middag-react/compare/v0.41.0...v0.41.1) (2026-09-16)


### Bug Fixes

* **blocks:** CardGrid status badges translate instead of showing the raw value ([9e33ce0](https://github.com/middag-io/middag-react/commit/9e33ce0fbf128b0267126272f2821085445d4159))
* **blocks:** DenseTable statusMap passthrough, CardGrid row actions, barrel exports InspectorContext ([6656506](https://github.com/middag-io/middag-react/commit/6656506fefcdb5e577b5fafdd8e80c0af89f1b2d))
* **blocks:** DenseTable statusMap, CardGrid row actions, InspectorContext barrel export ([bac21e9](https://github.com/middag-io/middag-react/commit/bac21e9a90392fc065cfc14674a6f0b6a618994c))
* **blocks:** inspector drawer's close button no longer reopens itself ([219adcb](https://github.com/middag-io/middag-react/commit/219adcba4c11e5ef02558017a7cec19d4565f31e))
* **form:** Save button loading state now persists through the actual request ([366e35e](https://github.com/middag-io/middag-react/commit/366e35e3e3477254013c96333eae7dfeef67f764))

## [0.41.0](https://github.com/middag-io/middag-react/compare/v0.40.1...v0.41.0) (2026-08-05)


### ⚠ BREAKING CHANGES

* **blocks:** o parâmetro `page` enviado ao servidor passa a ser 1-based. Consumidores que compensavam a assimetria — recebendo 0-based na borda HTTP e devolvendo 1-based no contrato — devem remover essa adaptação e tratar `page` como 1-based nas duas direções.

### Bug Fixes

* **blocks:** ActionGrid respeita loading e disabled do contrato Action ([4e6ac99](https://github.com/middag-io/middag-react/commit/4e6ac99c043cf316785996eb550b1198de142ab6))
* **blocks:** DenseTable emite a página em 1-based, como o contrato declara ([642f75d](https://github.com/middag-io/middag-react/commit/642f75d2b8b9bad334296d3a6341848e1cda833c))
* **blocks:** paginação 1-based no DenseTable e loading/disabled no ActionGrid ([853a086](https://github.com/middag-io/middag-react/commit/853a086ee925b7a7fcd30a4986a8d8bf4977f881))

## [0.40.1](https://github.com/middag-io/middag-react/compare/v0.40.0...v0.40.1) (2026-07-29)


### Bug Fixes

* **form:** menu do select abre abaixo do campo, nao sobre ele ([4220b21](https://github.com/middag-io/middag-react/commit/4220b212d1796688015e5004ebce91fe9156d3b2))
* **form:** menu do select abre abaixo do campo, não sobre ele ([a0f0890](https://github.com/middag-io/middag-react/commit/a0f0890798adb3a8a2a31ff4b8dd5576d26ed9bb))

## [0.40.0](https://github.com/middag-io/middag-react/compare/v0.39.1...v0.40.0) (2026-07-27)


### Features

* **schemas:** registrar o bloco customform_render no contrato de IA ([71e4b7e](https://github.com/middag-io/middag-react/commit/71e4b7ef01f5bba469afd086e8277b114ef10ad5))
* **schemas:** registrar o bloco customform_render no contrato de IA ([e5fc8c7](https://github.com/middag-io/middag-react/commit/e5fc8c7f17d2d80d35c4ba5a4ed16db52105898b))

## [0.39.1](https://github.com/middag-io/middag-react/compare/v0.39.0...v0.39.1) (2026-07-24)


### Bug Fixes

* **icons:** keep the icon registry a singleton across barrel and subpaths ([#19](https://github.com/middag-io/middag-react/issues/19)) ([cf5bd2c](https://github.com/middag-io/middag-react/commit/cf5bd2c4a15a78b4bd7f7ab47200f9709cec7fc4))

## [0.39.0](https://github.com/middag-io/middag-react/compare/v0.38.0...v0.39.0) (2026-07-24)


### Features

* **shell:** add editable_panel primitive (contract-driven side drawer) ([97505b6](https://github.com/middag-io/middag-react/commit/97505b6e8e039d8331a3e9c464f49de8c04d9b65))
* **shell:** editable_panel primitive (contract-driven side drawer) ([5be166d](https://github.com/middag-io/middag-react/commit/5be166db89e762d74ab1f2ab463f75e42dbc8031))


### Bug Fixes

* **ci:** use GitHub App client-id for dispatch bot token minting ([b0c123d](https://github.com/middag-io/middag-react/commit/b0c123dcc69f54b5f06fe838788ad19eaf976cdd))


### Documentation

* canonical AGENTS.md via scaffold BL-P1-06 (+ CLAUDE.md symlink) ([f79ecd8](https://github.com/middag-io/middag-react/commit/f79ecd81a49a0ef5c40944460588db58a4fb03b9))

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
