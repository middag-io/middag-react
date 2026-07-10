# src/ — Library Source

Código-fonte publicado como `@middag-io/react`.

## Estrutura

| Directório             | Conteúdo                                                                     |
|------------------------|------------------------------------------------------------------------------|
| `app/`                 | ContractPage, registries, providers, register-defaults                       |
| `base/blocks/`         | block components (several lazy-loaded)                                       |
| `base/form/`           | FormField router, form-schema-builder (Zod), the registered field components |
| `base/layout/`         | StackLayout, SidebarLayout, DashboardLayout, WizardLayout                    |
| `base/shell/`          | BasicShell, ImmersiveShell, partials (sidebar, header, command palette)      |
| `base/theme/`          | Tokens, 4 temas CSS, theme-bridge, ThemeContext                              |
| `components/reui/`     | ReUI primitives (Radix/Base UI) — **NÃO MODIFICAR**                          |
| `contracts/`           | TypeScript types (PageContract, BlockData, SharedProps, Navigation)          |
| `lib/`                 | Hooks e utils genéricos (cn, formatDate, etc.)                               |
| `assets/`              | Fonts (Figtree), Lottie animations                                           |
| `index.ts`             | Barrel export — API pública da lib                                           |

## Regras

- `src/` nunca importa de `mock/`
- Alterações em `contracts/` são breaking changes — confirmar impacto
- Remover export de `index.ts` é breaking change
- Imports usam alias `@/` → `src/`
- Novos componentes devem ter testes
