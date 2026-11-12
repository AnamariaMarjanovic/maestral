import { DOCUMENT, Component, effect, inject, signal } from '@angular/core';
import { MsButton } from 'maestral/button';

type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'maestral-docs-theme';

/** Lets visitors force light or dark mode, or follow the system setting. */
@Component({
  selector: 'docs-theme-toggle',
  imports: [MsButton],
  template: `
    <div class="toggle" role="group" aria-label="Color theme">
      @for (option of options; track option.value) {
        <button
          msButton
          type="button"
          variant="ghost"
          size="sm"
          [attr.aria-pressed]="theme() === option.value"
          (click)="theme.set(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .toggle {
      display: flex;
      gap: var(--ms-space-1);
    }
  `,
})
export class ThemeToggle {
  protected readonly options: { value: Theme; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  protected readonly theme = signal<Theme>(readStoredTheme());

  constructor() {
    const root = inject(DOCUMENT).documentElement;
    effect(() => {
      const theme = this.theme();
      if (theme === 'system') {
        root.removeAttribute('data-ms-theme');
      } else {
        root.setAttribute('data-ms-theme', theme);
      }
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Storage can be unavailable (private mode); the toggle still works.
      }
    });
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}
