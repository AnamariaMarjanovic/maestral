import { Component, input } from '@angular/core';

export interface ApiRow {
  readonly name: string;
  readonly type: string;
  readonly default?: string;
  readonly description: string;
}

/** Table of a component's inputs, attributes or exports. */
@Component({
  selector: 'docs-api-table',
  template: `
    <div class="wrapper" tabindex="0" role="region" [attr.aria-label]="caption()">
      <table>
        <caption>{{ caption() }}</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name) {
            <tr>
              <th scope="row"><code>{{ row.name }}</code></th>
              <td><code>{{ row.type }}</code></td>
              <td>
                @if (row.default) {
                  <code>{{ row.default }}</code>
                } @else {
                  <span aria-label="None">–</span>
                }
              </td>
              <td>{{ row.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .wrapper {
      margin: var(--ms-space-3) 0 var(--ms-space-6);
      overflow-x: auto;
      border: 1px solid var(--ms-color-border);
      border-radius: var(--ms-radius-md);
    }

    .wrapper:focus-visible {
      outline: 2px solid var(--ms-color-focus-ring);
      outline-offset: 2px;
    }

    table {
      inline-size: 100%;
      border-collapse: collapse;
      font-size: var(--ms-text-sm);
    }

    caption {
      padding: var(--ms-space-3) var(--ms-space-4);
      font-weight: 600;
      text-align: start;
      border-block-end: 1px solid var(--ms-color-border);
    }

    th,
    td {
      padding: var(--ms-space-2) var(--ms-space-4);
      text-align: start;
      vertical-align: top;
    }

    thead th {
      color: var(--ms-color-text-muted);
      font-weight: 600;
      background: var(--ms-color-surface);
    }

    tbody tr + tr {
      border-block-start: 1px solid var(--ms-color-border);
    }

    tbody th {
      font-weight: 400;
      white-space: nowrap;
    }
  `,
})
export class ApiTable {
  readonly caption = input.required<string>();
  readonly rows = input.required<readonly ApiRow[]>();
}
