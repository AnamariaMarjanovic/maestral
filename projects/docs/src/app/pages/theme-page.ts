import { DecimalPipe } from '@angular/common';
import { Component, linkedSignal, signal } from '@angular/core';
import { FormField, form, pattern, required } from '@angular/forms/signals';
import { MsButton } from 'maestral/button';
import { MsCheckbox, MsChoice, MsRadio } from 'maestral/choice';
import { MsField, MsFieldset } from 'maestral/field';
import { MsInput } from 'maestral/input';
import { Theme, ThemeDensity, ThemeInput, ThemeShape, buildTheme } from '../shared/theme';

const DEFAULTS: ThemeInput = { primary: '#354faa', shape: 'sail', density: 'comfortable' };

@Component({
  selector: 'docs-theme-page',
  imports: [
    DecimalPipe,
    FormField,
    MsButton,
    MsCheckbox,
    MsChoice,
    MsField,
    MsFieldset,
    MsInput,
    MsRadio,
  ],
  templateUrl: './theme-page.html',
  styleUrl: './theme-page.css',
})
export default class ThemePage {
  protected readonly shapes: { value: ThemeShape; label: string }[] = [
    { value: 'sail', label: 'Sail' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'square', label: 'Square' },
    { value: 'pill', label: 'Pill' },
  ];

  protected readonly densities: { value: ThemeDensity; label: string }[] = [
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'spacious', label: 'Spacious' },
  ];

  protected readonly modes = ['light', 'dark'] as const;

  protected readonly settings = signal<ThemeInput>({ ...DEFAULTS });

  protected readonly settingsForm = form(this.settings, (path) => {
    required(path.primary, { message: 'Enter a color' });
    pattern(path.primary, /^#[0-9a-fA-F]{6}$/, {
      message: 'Enter a color as # followed by six hex digits, like #354faa',
    });
  });

  /**
   * The theme follows the settings, but keeps the last valid result while
   * the color field holds something that is not a color yet.
   */
  protected readonly theme = linkedSignal<ThemeInput, Theme>({
    source: this.settings,
    computation: (settings, previous) =>
      buildTheme(settings) ?? previous?.value ?? buildTheme(DEFAULTS)!,
  });

  protected readonly copied = signal(false);

  protected reset(): void {
    this.settings.set({ ...DEFAULTS });
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.theme().css);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard can be blocked; the code stays selectable by hand.
    }
  }
}
