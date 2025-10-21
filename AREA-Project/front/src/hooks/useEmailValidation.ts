import { useState, useEffect } from 'react';

export interface EmailValidation {
  isValid: boolean;
  hasAtSymbol: boolean;
  hasValidDomain: boolean;
  hasValidFormat: boolean;
  errorMessage?: string;
}

export const useEmailValidation = (email: string): EmailValidation => {
  const [validation, setValidation] = useState<EmailValidation>({
    isValid: false,
    hasAtSymbol: false,
    hasValidDomain: false,
    hasValidFormat: false,
  });

  useEffect(() => {
    // Regex plus stricte pour valider l'email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const hasAtSymbol = email.includes('@');
    const hasValidFormat = emailRegex.test(email);
    const emailParts = email.split('@');
    const hasValidDomain =
      hasAtSymbol &&
      emailParts.length === 2 &&
      !!emailParts[1] &&
      emailParts[1].includes('.');

    let errorMessage: string | undefined;

    if (email && !hasAtSymbol) {
      errorMessage = "L'adresse email doit contenir le symbole @";
    } else if (email && hasAtSymbol && !hasValidDomain) {
      errorMessage =
        "L'adresse email doit contenir un domaine valide (ex: gmail.com)";
    } else if (email && !hasValidFormat) {
      errorMessage = "Format d'email invalide";
    }

    const isValid = email.length > 0 && hasValidFormat;

    setValidation({
      isValid,
      hasAtSymbol,
      hasValidDomain,
      hasValidFormat,
      errorMessage,
    });
  }, [email]);

  return validation;
};

export default useEmailValidation;
