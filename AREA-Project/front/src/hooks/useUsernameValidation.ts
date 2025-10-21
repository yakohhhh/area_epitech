import { useState, useEffect } from 'react';
import { isValidUsername } from '../shared/utils/common';

export const useUsernameValidation = (username: string) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const validation = isValidUsername(username);
    setIsValid(validation.isValid);
    setErrorMessage(validation.errorMessage || '');
  }, [username]);

  return { isValid, errorMessage };
};
