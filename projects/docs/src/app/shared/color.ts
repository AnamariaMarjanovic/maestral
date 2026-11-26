/**
 * Small color toolkit for the theme builder: sRGB and OKLCH conversion,
 * gamut mapping and WCAG 2 contrast. OKLCH is used because its lightness is
 * perceptual, so a palette can be built by moving one number.
 */

export interface Oklch {
  /** Lightness, 0 to 1 */
  readonly l: number;
  /** Chroma, 0 to about 0.37 */
  readonly c: number;
  /** Hue in degrees */
  readonly h: number;
}

type Rgb = readonly [number, number, number];

export function parseHex(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) {
    return null;
  }
  const value = parseInt(match[1], 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export function toHex([r, g, b]: Rgb): string {
  const channel = (value: number) =>
    Math.round(Math.min(1, Math.max(0, value)) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

export function rgbToOklch(rgb: Rgb): Oklch {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.hypot(A, B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/** Converts to sRGB without clamping; channels outside 0..1 mean out of gamut. */
function oklchToRawRgb({ l: L, c, h }: Oklch): Rgb {
  const radians = (h * Math.PI) / 180;
  const A = c * Math.cos(radians);
  const B = c * Math.sin(radians);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/**
 * Brings a color into the sRGB gamut by lowering its chroma, keeping
 * lightness and hue. This is what a screen can actually show, so contrast is
 * measured on the same color the user will see.
 */
export function toGamut(color: Oklch): Oklch {
  const l = Math.min(1, Math.max(0, color.l));
  if (inGamut(oklchToRawRgb({ ...color, l }))) {
    return { ...color, l };
  }
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToRawRgb({ l, c: mid, h: color.h }))) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return { l, c: low, h: color.h };
}

export function oklchToRgb(color: Oklch): Rgb {
  return oklchToRawRgb(toGamut(color)).map((v) => Math.min(1, Math.max(0, v))) as unknown as Rgb;
}

export function oklchToHex(color: Oklch): string {
  return toHex(oklchToRgb(color));
}

/** CSS text, rounded so the output stays readable. */
export function formatOklch(color: Oklch): string {
  const { l, c, h } = toGamut(color);
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

function luminance(color: Oklch): number {
  const [r, g, b] = oklchToRgb(color).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio, 1 to 21. */
export function contrast(a: Oklch, b: Oklch): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
