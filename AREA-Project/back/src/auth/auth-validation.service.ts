import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthValidationService {
    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    isValidUsername(username: string): { isValid: boolean; errorMessage?: string } {
        if (!username || username.trim() === '') {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur est requis' };
        }
        if (username.includes('@')) {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur ne peut pas contenir le caractère @' };
        }
        if (username.includes('.')) {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur ne peut pas contenir le caractère .' };
        }
        if (/\d/.test(username)) {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur ne peut pas contenir de chiffres' };
        }
        if (username.length < 3) {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
        }
        const usernameRegex = /^[a-zA-Z_-]+$/;
        if (!usernameRegex.test(username)) {
            return { isValid: false, errorMessage: 'Le nom d\'utilisateur ne peut contenir que des lettres, tirets (-) et underscores (_)' };
        }
        return { isValid: true };
    }

    validateRegisterData(email: string, password: string, username?: string): void {
        if (!email || !password) {
            throw new BadRequestException('Email et mot de passe sont requis');
        }
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('Format d\'email invalide. L\'email doit contenir @ et un domaine valide (ex: utilisateur@domaine.com)');
        }
        if (username) {
            const usernameValidation = this.isValidUsername(username);
            if (!usernameValidation.isValid) {
                throw new BadRequestException(usernameValidation.errorMessage);
            }
        }
        if (password.length < 6) {
            throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères');
        }
    }

    validateLoginData(email: string, password: string): void {
        if (!email || !password) {
            throw new BadRequestException('Email et mot de passe sont requis');
        }
        if (!this.isValidEmail(email)) {
            throw new BadRequestException('Format d\'email invalide. L\'email doit contenir @ et un domaine valide (ex: utilisateur@domaine.com)');
        }
    }
}
