<p align="center">
  <img src="docs/assets/logo.svg" width="72" height="72" alt="">
</p>

<h1 align="center">Maestral</h1>

<p align="center">
  Accessible Angular components on native elements, with forms and theming at the core.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/maestral"><img src="https://img.shields.io/npm/v/maestral" alt="npm version"></a>
  <a href="https://github.com/AnamariaMarjanovic/maestral/actions/workflows/ci.yml"><img src="https://github.com/AnamariaMarjanovic/maestral/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
</p>

---

Maestral is an Angular component library built around two ideas: forms that
help people, and theming through design tokens. Components are attribute
directives on native elements, so the browser's own accessibility comes for
free.

For installation and usage, see the
[package README](projects/maestral/README.md).

## What makes it different

- **Forms as the core.** `<ms-field>` wires labels, hints and errors to the
  control. With Signal Forms, errors appear once the user leaves a field.
  `<ms-error-summary>` lists all problems after a failed submit and moves
  focus to them.
- **The sail.** Controls round three corners and keep one sharp, like a sail
  filled by the wind. The shape is two tokens, so themes can change it.
- **Decisions on record.** Every significant choice is documented with its
  alternatives in [`docs/decisions/`](docs/decisions/README.md).

## Repository

```
projects/
  maestral/        the library, one entry point per component
  docs/            documentation site and examples
docs/decisions/    architecture decision records
CHANGELOG.md       every change and why it was made
```

## Development

Requires Node 22.14 or later.

```bash
npm install
npx ng serve docs                    # documentation site at localhost:4200
npx ng test maestral --watch=false   # library tests
npx ng build maestral                # npm package in dist/maestral
```

Project conventions are in [`CLAUDE.md`](CLAUDE.md): native elements, plain
CSS in cascade layers, semantic tokens only, WCAG 2.2 AA in both color
schemes, a test next to every entry point, and a changelog entry with every
user-facing change.

## Releasing

Versions are tagged `vX.Y.Z`. The release workflow stages the package on npm
through trusted publishing, and it goes live after approval with 2FA. See
[ADR-0017](docs/decisions/0017-release-process.md).

## License

[MIT](LICENSE) © Anamaria Oršulić
