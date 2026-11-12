import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactForm } from '../examples/contact-form/contact-form';

@Component({
  selector: 'docs-home',
  imports: [RouterLink, ContactForm],
  template: `
    <h1>Maestral</h1>
    <p class="lead">
      Accessible Angular components on native elements, with forms and theming at the core.
    </p>
    <p>
      The maestral is the steady summer wind of the Adriatic: reliable, pleasant and never in the
      way. That is the goal for this library too.
    </p>

    <h2>Principles</h2>
    <ul>
      <li>
        <strong>Native elements first.</strong> <code>&lt;button msButton&gt;</code> is a real
        button, so keyboard support, forms and screen readers work without extra code.
      </li>
      <li>
        <strong>Forms that help people.</strong> Labels, hints and errors are wired up for you.
        Errors appear when the user leaves a field, and an error summary takes them to each
        problem.
      </li>
      <li>
        <strong>Theming through tokens.</strong> Every color, radius and spacing is a CSS custom
        property. Light and dark mode come built in, and every color pair meets WCAG 2.2 AA.
      </li>
    </ul>

    <h2>Try it</h2>
    <p>
      Press <strong>Send</strong> without filling in the form, then use the links in the summary.
      Try it with a keyboard or a screen reader too.
    </p>
    <docs-contact-form />

    <h2>Installation</h2>
    <pre><code>npm install maestral</code></pre>

    <p>Add the stylesheet to your app's global styles in <code>angular.json</code>:</p>
    <pre><code>{{ stylesConfig }}</code></pre>

    <p>Then import the components you need. Each one has its own entry point:</p>
    <pre><code>{{ importExample }}</code></pre>

    <h2>Next steps</h2>
    <ul>
      <li><a routerLink="/components/field">Build a form with fields and inputs</a></li>
      <li><a routerLink="/tokens">See the design tokens</a></li>
      <li>
        <a href="https://github.com/AnamariaMarjanovic/maestral/tree/main/docs/decisions"
          >Read why things are the way they are</a
        >
      </li>
    </ul>
  `,
})
export default class Home {
  protected readonly stylesConfig = `"styles": [
  "node_modules/maestral/styles/maestral.css",
  "src/styles.css"
]`;

  protected readonly importExample = `import { MsButton } from 'maestral/button';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';`;
}
