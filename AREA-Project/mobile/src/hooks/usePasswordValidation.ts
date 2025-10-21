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

export const getPasswordStrength = (score: number) => {
  switch (score) {
    case 0:
    case 1:
    case 2:
      return { label: 'Très faible', color: '#ef4444', percentage: 20 + score * 10 };
    case 3:
      return { label: 'Moyen', color: '#f59e0b', percentage: 60 };
    case 4:
      return { label: 'Fort', color: '#10b981', percentage: 80 };
    case 5:
      return { label: 'Très fort', color: '#059669', percentage: 100 };
    default:
      return { label: 'Très faible', color: '#ef4444', percentage: 20 };
  }
};