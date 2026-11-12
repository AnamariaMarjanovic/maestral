import {
  MS_DEFAULT_ERROR_MESSAGES,
  MS_FALLBACK_ERROR_MESSAGE,
  MsValidationError,
  msResolveErrorMessage,
} from './error-messages';

describe('msResolveErrorMessage', () => {
  const resolve = (error: MsValidationError) =>
    msResolveErrorMessage(error, MS_DEFAULT_ERROR_MESSAGES);

  it('prefers the message set on the error', () => {
    expect(resolve({ kind: 'required', message: 'Enter your name' })).toBe('Enter your name');
  });

  it('uses the configured message for the error kind', () => {
    expect(resolve({ kind: 'required' })).toBe('This field is required');
  });

  it('includes validator details in the message', () => {
    const error = { kind: 'minLength', minLength: 10 } as MsValidationError;
    expect(resolve(error)).toBe('Enter at least 10 characters');
  });

  it('falls back to a generic message for unknown kinds', () => {
    expect(resolve({ kind: 'somethingCustom' })).toBe(MS_FALLBACK_ERROR_MESSAGE);
  });
});
