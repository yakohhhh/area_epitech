/**
 * Format utilities
 */

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * String utilities
 */

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Validation utilities
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidUsername = (
  username: string
): { isValid: boolean; errorMessage?: string } => {
  if (!username || username.trim() === '') {
    return { isValid: false, errorMessage: "Le nom d'utilisateur est requis" };
  }

  // Vérifier si le username contient @, . ou des chiffres
  if (username.includes('@')) {
    return {
      isValid: false,
      errorMessage: "Le nom d'utilisateur ne peut pas contenir le caractère @",
    };
  }

  if (username.includes('.')) {
    return {
      isValid: false,
      errorMessage: "Le nom d'utilisateur ne peut pas contenir le caractère .",
    };
  }

  if (/\d/.test(username)) {
    return {
      isValid: false,
      errorMessage: "Le nom d'utilisateur ne peut pas contenir de chiffres",
    };
  }

  // Vérifier la longueur minimale
  if (username.length < 3) {
    return {
      isValid: false,
      errorMessage: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    };
  }

  // Vérifier qu'il ne contient que des lettres et des caractères autorisés (lettres, tirets, underscores)
  const usernameRegex = /^[a-zA-Z_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      errorMessage:
        "Le nom d'utilisateur ne peut contenir que des lettres, tirets (-) et underscores (_)",
    };
  }

  return { isValid: true };
};

/**
 * Storage utilities
 */

export const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};
