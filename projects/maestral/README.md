<p align="center">
  <img src="https://raw.githubusercontent.com/AnamariaMarjanovic/maestral/main/docs/assets/logo.svg" width="72" height="72" alt="">
</p>

<h1 align="center">Maestral</h1>

<p align="center">
  Accessible Angular components on native elements, with forms and theming at the core.
</p>

<p align="center">
  <a href="https://maestral.anamaria.dev"><strong>Documentation and live examples</strong></a>
</p>

---

The maestral is the steady summer wind of the Adriatic: reliable, pleasant and
never in the way. That is the goal for this library too.

- **Native elements first.** `<button msButton>` is a real button, so keyboard
  support, forms and screen readers work without extra code.
- **Forms that help people.** Labels, hints and errors are wired up for you.
  Errors appear when the user leaves a field, never while they are typing,
  and an error summary takes them to each problem after a failed submit.
- **Theming through tokens.** Every color, radius and spacing value is a CSS
  custom property. Light and dark mode are built in, and every color pair
  meets WCAG 2.2 AA.

## Requirements

Angular 22.2 or later, with Signal Forms (`@angular/forms/signals`) for
automatic validation errors.

## Installation

```bash
npm install maestral
```

Add the stylesheet to your app's global styles in `angular.json`:

```json
"styles": [
  "node_modules/maestral/styles/maestral.css",
  "src/styles.css"
]
```

## Usage

Each component has its own entry point, so your app only ships what it uses.

```ts
import { MsButton } from 'maestral/button';
import { MsErrorSummary } from 'maestral/error-summary';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';
```

A complete accessible form:

```ts
readonly contact = signal({ name: '', email: '' });

readonly contactForm = form(this.contact, (path) => {
  required(path.name, { message: 'Enter your full name' });
  required(path.email);
  email(path.email);
});
```

```html
<form novalidate (submit)="onSubmit($event)">
  <ms-error-summary [form]="contactForm" />

  <ms-field label="Full name" hint="As it appears on your ID.">
    <input msInput [formField]="contactForm.name" autocomplete="name" />
  </ms-field>

  <ms-field label="Email">
    <input msInput type="email" [formField]="contactForm.email" autocomplete="email" />
  </ms-field>

  <button msButton type="submit">Send</button>
</form>
```

Labels, `aria-describedby`, `aria-invalid`, `aria-required`, error messages,
the error summary and focus management all follow from this markup.

## Components

| Entry point             | Exports                                         |
| ----------------------- | ----------------------------------------------- |
| `maestral/button`       | `MsButton`                                      |
| `maestral/field`        | `MsField`, `MsFieldset`, `provideMsErrorMessages()` |
| `maestral/input`        | `MsInput` for inputs, text areas and selects    |
| `maestral/choice`       | `MsCheckbox`, `MsRadio`, `MsChoice`             |
| `maestral/error-summary`| `MsErrorSummary`                                |
| `maestral/dialog`       | `MsDialog`, `MsDialogTitle`, `MsDialogClose`, `MsDialogActions` |

## Theming

Override any semantic token. Maestral's styles live in cascade layers, so your
styles always win without `!important`:

```css
:root {
  --ms-color-primary: oklch(52% 0.14 160);
}
```

Because your styles always win, broad element rules such as `a { color: … }`
or `h2 { margin: … }` also restyle links and headings inside Maestral
components, like the error summary and the dialog. Scope them, for example to
`a:not([class])`, or put them in a cascade layer.

Dark mode follows the operating system. Force a scheme with
`data-ms-theme="light"` or `data-ms-theme="dark"` on any element.

## Translating error messages

```ts
providers: [
  provideMsErrorMessages({
    required: () => 'Polje je obavezno',
  }),
];
```

## Links

- [Documentation and live examples](https://maestral.anamaria.dev)
- [Source and documentation](https://github.com/AnamariaMarjanovic/maestral)
- [Changelog](https://github.com/AnamariaMarjanovic/maestral/blob/main/CHANGELOG.md)
- [Design decisions](https://github.com/AnamariaMarjanovic/maestral/tree/main/docs/decisions)

## License

MIT © Anamaria Oršulić
