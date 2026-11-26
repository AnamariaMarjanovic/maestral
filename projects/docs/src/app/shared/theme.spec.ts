import { contrast, parseHex, rgbToOklch, toHex } from './color';
import { buildTheme } from './theme';

describe('color', () => {
  it('measures the extremes of WCAG contrast', () => {
    const white = rgbToOklch(parseHex('#ffffff')!);
    const black = rgbToOklch(parseHex('#000000')!);
    expect(contrast(white, black)).toBeCloseTo(21, 1);
    expect(contrast(white, white)).toBeCloseTo(1, 5);
  });

  it('rejects anything that is not a six-digit hex color', () => {
    expect(parseHex('#354faa')).not.toBeNull();
    expect(parseHex('354FAA')).not.toBeNull();
    expect(parseHex('#35f')).toBeNull();
    expect(parseHex('indigo')).toBeNull();
  });

  it('round-trips hex through OKLCH', () => {
    for (const hex of ['#354faa', '#ff0000', '#00a36c', '#123456', '#fafafa']) {
      const back = buildTheme({ primary: hex, shape: 'sail', density: 'comfortable' });
      expect(back).not.toBeNull();
      expect(toHex(parseHex(hex)!)).toBe(hex);
    }
  });
});

describe('buildTheme', () => {
  const theme = (primary: string) => buildTheme({ primary, shape: 'sail', density: 'comfortable' })!;

  it('keeps a color that already passes', () => {
    const result = theme('#354faa');
    expect(result.adjustedFrom).toBeNull();
    expect(result.lightPrimaryHex).toBe('#354faa');
  });

  it('darkens a color that is too light for white text, and says so', () => {
    const result = theme('#ffd700');
    expect(result.adjustedFrom).toBe('#ffd700');
    expect(result.lightPrimaryHex).not.toBe('#ffd700');
  });

  it('passes every contrast check for any hue and lightness', () => {
    const failures: string[] = [];
    for (let hue = 0; hue < 360; hue += 30) {
      for (const lightness of [30, 50, 70, 90]) {
        const primary = `hsl-${hue}-${lightness}`;
        const hex = hslToHex(hue, 80, lightness);
        for (const check of theme(hex).checks) {
          if (!check.pass) {
            failures.push(`${primary} ${hex} ${check.mode} ${check.label} ${check.ratio.toFixed(2)}`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('turns shape and density into tokens', () => {
    const result = buildTheme({ primary: '#354faa', shape: 'pill', density: 'compact' })!;
    expect(result.tokens['--ms-radius-sail']).toBe('9999px');
    expect(result.tokens['--ms-radius-tack']).toBe('9999px');
    expect(result.tokens['--ms-control-height']).toBe('2rem');
    expect(result.css).toContain('--ms-control-height: 2rem;');
  });

  it('returns nothing for an invalid color', () => {
    expect(buildTheme({ primary: 'nope', shape: 'sail', density: 'comfortable' })).toBeNull();
  });
});

function hslToHex(h: number, s: number, l: number): string {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return toHex([f(0), f(8), f(4)]);
}
