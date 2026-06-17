export function validateName(name) {
  if (!name) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters';
  if (name.length > 60) return 'Name must not exceed 60 characters';
  return '';
}

export function validateEmail(email) {
  if (!email) return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return 'Please enter a valid email address';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 16) return 'Password must not exceed 16 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Password must include at least one special character';
  return '';
}

export function validateAddress(address) {
  if (!address) return 'Address is required';
  if (address.length > 400) return 'Address must not exceed 400 characters';
  return '';
}
