import { InjectionToken, Provider } from '@angular/core';

/** The parts of a validation error that Maestral needs to describe it. */
export interface MsValidationError {
  readonly kind: string;
  readonly message?: string;
}

/** Reads a detail such as `minLength` from a built-in validation error. */
function detail(error: MsValidationError, key: string): unknown {
  return (error as unknown as Record<string, unknown>)[key];
}

/** Builds a human-readable message for one kind of validation error. */
export type MsErrorMessageFn = (error: MsValidationError) => string;

/** Messages keyed by validation error kind (`required`, `email`, ...). */
export type MsErrorMessages = Readonly<Record<string, MsErrorMessageFn>>;

/**
 * Default English messages for Angular's built-in validators. Wording follows
 * plain-language guidance: say what to do, not what went wrong.
 */
export const MS_DEFAULT_ERROR_MESSAGES: MsErrorMessages = {
  required: () => 'This field is required',
  email: () => 'Enter an email address in the correct format, like name@example.com',
  minLength: (e) => `Enter at least ${detail(e, 'minLength')} characters`,
  maxLength: (e) => `Enter ${detail(e, 'maxLength')} characters or fewer`,
  min: (e) => `Enter a value of ${detail(e, 'min')} or more`,
  max: (e) => `Enter a value of ${detail(e, 'max')} or less`,
  pattern: () => 'Enter a value in the correct format',
};

/** Fallback when no message exists for an error kind. */
export const MS_FALLBACK_ERROR_MESSAGE = 'Check this field';

export const MS_ERROR_MESSAGES = new InjectionToken<MsErrorMessages>('MS_ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => MS_DEFAULT_ERROR_MESSAGES,
});

/**
 * Overrides or translates error messages. Messages not listed keep their
 * defaults.
 *
 * ```ts
 * providers: [provideMsErrorMessages({ required: () => 'Polje je obavezno' })]
 * ```
 */
export function provideMsErrorMessages(messages: MsErrorMessages): Provider {
  return {
    provide: MS_ERROR_MESSAGES,
    useValue: { ...MS_DEFAULT_ERROR_MESSAGES, ...messages },
  };
}

/**
 * Resolves the text for an error. A message set in the form schema wins over
 * the configured messages.
 */
export function msResolveErrorMessage(error: MsValidationError, messages: MsErrorMessages): string {
  return error.message ?? messages[error.kind]?.(error) ?? MS_FALLBACK_ERROR_MESSAGE;
}
