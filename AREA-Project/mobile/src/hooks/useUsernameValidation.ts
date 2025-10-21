import { useState, useEffect } from 'react';

export interface UsernameValidation {
  isValid: boolean;
  errorMessage?: string;
}

export const useUsernameValidation = (username: string): UsernameValidation => {
  const [validation, setValidation] = useState<UsernameValidation>({
    isValid: true,
  });

  useEffect(() => {
    if (!username) {
      setValidation({ isValid: true });
      return;
    }

    if (username.length < 3) {
      setValidation({
        isValid: false,
        errorMessage: "Le nom d'utilisateur doit contenir au moins 3 caractères",
      });
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      setValidation({
        isValid: false,
        errorMessage: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets (-) et underscores (_)",
      });
      return;
    }

    setValidation({ isValid: true });
  }, [username]);

  return validation;
};