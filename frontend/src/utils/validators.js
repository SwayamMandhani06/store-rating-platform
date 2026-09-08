const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]).{8,16}$/;

export function validateName(name) {
  const len = (name || '').trim().length;
  if (len < 20 || len > 60) return 'Name must be between 20 and 60 characters';
  return '';
}

export function validateAddress(address) {
  if (!address || !address.trim()) return 'Address is required';
  if (address.length > 400) return 'Address must be at most 400 characters';
  return '';
}

export function validateEmail(email) {
  if (!EMAIL_REGEX.test(email || '')) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!PASSWORD_REGEX.test(password || '')) {
    return '8-16 characters, at least one uppercase letter and one special character';
  }
  return '';
}
