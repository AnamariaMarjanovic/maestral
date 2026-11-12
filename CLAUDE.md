# Maestral

Accessible Angular component library on native elements, with forms and
theming at the core. Published to npm as `maestral`. Decisions and their
reasons live in `docs/decisions/`; read the relevant record before changing
architecture.

## Workspace

- `projects/maestral/`: the library (ng-packagr)
  - `<component>/`: one secondary entry point per component
    (`ng-package.json`, `public-api.ts`, sources), imported as
    `maestral/<component>`
  - `styles/tokens.css`: design tokens
  - `styles/components/<component>.css`: component styles
  - `styles/maestral.css`: stylesheet entry point and layer order
- `projects/docs/`: documentation site, showcase and future theme generator

## Commands

- `npx ng serve docs`: run the docs app (reads the library from source)
- `npx ng build maestral`: build the npm package into `dist/maestral`
- `npx ng test maestral`: run library tests (Vitest)

## Library rules

- Components that map to a native element are attribute directives on that
  element (`button[msButton]`, `input[msInput]`), never wrapper components.
  Restrict selectors to the elements that make sense. Use real components
  (`ms-field`) only when no native element exists for the job (ADR-0002).
- Directives add only a class and `data-*` / `aria-*` attributes through the
  `host` object. Directives and components in the library have no
  `styles` or `styleUrl`; all styling lives in plain CSS files (ADR-0003).
- Component CSS goes in `styles/components/<name>.css`, is imported in
  `styles/maestral.css` with `layer(maestral.components)`, and uses the class
  `.ms-<name>`. Variants and sizes use `data-variant` / `data-size`
  attribute selectors.
- Components use semantic tokens only (`--ms-color-*`, `--ms-radius-*`,
  `--ms-space-*`, ...). Never reference primitive tokens (`--ms-indigo-*`,
  `--ms-slate-*`) or hardcode colors, sizes or durations (ADR-0004).
  Component-private variables use the `--_` prefix.
- Interactive controls use the sail shape: `border-radius:
  var(--ms-radius-sail)` plus `border-end-start-radius:
  var(--ms-radius-tack)`. Use logical properties so layouts mirror in RTL
  (ADR-0011).
- Every new text/background color pair must pass WCAG 2.2 AA (4.5:1 for
  text, 3:1 for focus rings and UI boundaries) in both light and dark mode.
- Every interactive element has a visible `:focus-visible` style and a
  `forced-colors` fallback where borders or outlines carry meaning.
- Selector prefix is `ms` (`msButton`, `ms-field`); class names are
  `MsButton`, `MsField`, without a `Directive` or `Component` suffix.
- No Sass, Tailwind or CSS-in-JS in the library or the docs app.
- The docs app uses only Maestral's tokens and components. If something
  looks wrong in docs, fix the library, not the docs page.
- Each new entry point gets a page or section in the docs app showing all
  variants, sizes and states.
- Each new entry point ships with a spec next to its source
  (`<component>/<component>.spec.ts`). Test behaviour through a host
  component, the way an app uses the library, and assert on the DOM: text,
  ARIA attributes and `document.activeElement`. Name tests after what the
  user experiences (ADR-0015).

## Project documentation rules

- Every change that is committed must add an entry to `CHANGELOG.md` under
  `[Unreleased]`, in the same commit, using the Keep a Changelog sections
  (Added, Changed, Deprecated, Removed, Fixed, Security). Each entry states
  what changed and why. Changes that do not affect library users (tooling,
  `CLAUDE.md`, docs app layout) need no entry.
- Every architectural or product decision gets a new record in
  `docs/decisions/` using the template in `docs/decisions/README.md`, and a
  row in its index table. Never rewrite an accepted record; supersede it with
  a new one.
- Code, comments, commit messages and documentation are written in English.
- Commit messages follow Conventional Commits (`feat(scope): ...`,
  `fix(scope): ...`, `docs: ...`, `chore: ...`).

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection