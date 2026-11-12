import { Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { ThemeToggle } from './shared/theme-toggle';

interface NavItem {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly gettingStarted: NavItem[] = [
    { label: 'Introduction', path: '/' },
    { label: 'Design tokens', path: '/tokens' },
  ];

  protected readonly components: NavItem[] = [
    { label: 'Button', path: '/components/button' },
    { label: 'Field and input', path: '/components/field' },
    { label: 'Error summary', path: '/components/error-summary' },
  ];

  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    // After client-side navigation, move focus to the new page's heading so
    // keyboard and screen reader users start reading the new content, the
    // same as after a full page load. The first navigation is skipped.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => {
        setTimeout(() => {
          const heading = this.main().nativeElement.querySelector<HTMLElement>('h1');
          heading?.setAttribute('tabindex', '-1');
          heading?.focus();
        });
      });
  }
}
