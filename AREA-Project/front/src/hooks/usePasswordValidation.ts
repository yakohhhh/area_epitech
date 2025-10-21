import { useState, useEffect } from 'react';

export interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
  score: number;
}

export const usePasswordValidation = (password: string): PasswordValidation => {
  const [validation, setValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
    score: 0,
  });

  useEffect(() => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const criteria = [
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    ];
    const score = criteria.filter(Boolean).length;
    const isValid = score >= 4 && minLength; // Au moins 4 critères + longueur minimale

    setValidation({
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid,
      score,
    });
  }, [password]);

  return validation;
};

export const getPasswordStrength = (
  score: number
): { text: string; color: string; percentage: number } => {
  switch (score) {
    case 0:
    case 1:
      return { text: 'Très faible', color: '#ef4444', percentage: 20 };
    case 2:
      return { text: 'Faible', color: '#f97316', percentage: 40 };
    case 3:
      return { text: 'Moyen', color: '#eab308', percentage: 60 };
    case 4:
      return { text: 'Fort', color: '#22c55e', percentage: 80 };
    case 5:
      return { text: 'Très fort', color: '#16a34a', percentage: 100 };
    default:
      return { text: 'Très faible', color: '#ef4444', percentage: 20 };
  }
};

export default usePasswordValidation;
