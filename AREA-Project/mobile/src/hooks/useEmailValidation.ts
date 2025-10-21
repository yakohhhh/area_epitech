import { useState, useEffect } from 'react';

export interface EmailValidation {
  isValid: boolean;
  errorMessage?: string;
}

export const useEmailValidation = (email: string): EmailValidation => {
  const [validation, setValidation] = useState<EmailValidation>({
    isValid: true,
  });

  useEffect(() => {
    if (!email) {
      setValidation({ isValid: true });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    setValidation({
      isValid,
      errorMessage: !isValid
        ? "Format d'email invalide. Exemple: utilisateur@domaine.com"
        : undefined,
    });
  }, [email]);

  return validation;
};