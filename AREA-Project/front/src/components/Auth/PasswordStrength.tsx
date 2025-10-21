import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import {
  PasswordValidation,
  getPasswordStrength,
} from '../../hooks/usePasswordValidation';

interface PasswordStrengthProps {
  validation: PasswordValidation;
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  validation,
  password,
}) => {
  if (!password) return null;

  const strength = getPasswordStrength(validation.score);

  const criteria = [
    {
      key: 'minLength',
      label: 'Au moins 8 caractères',
      met: validation.minLength,
    },
    {
      key: 'hasUppercase',
      label: 'Une lettre majuscule',
      met: validation.hasUppercase,
    },
    {
      key: 'hasLowercase',
      label: 'Une lettre minuscule',
      met: validation.hasLowercase,
    },
    { key: 'hasNumber', label: 'Un chiffre', met: validation.hasNumber },
    {
      key: 'hasSpecialChar',
      label: 'Un caractère spécial (!@#$%...)',
      met: validation.hasSpecialChar,
    },
  ];

  return (
    <div className="password-strength">
      {/* Barre de force */}
      <div className="strength-bar-container">
        <div
          className="strength-bar"
          style={{
            width: `${strength.percentage}%`,
            backgroundColor: strength.color,
          }}
        />
      </div>
      <div className="strength-text" style={{ color: strength.color }}>
        Force du mot de passe : {strength.text}
      </div>

      {/* Critères RGPD */}
      <div className="password-criteria">
        <div className="criteria-title">Exigences de sécurité :</div>
        {criteria.map(criterion => (
          <div
            key={criterion.key}
            className={`criterion ${criterion.met ? 'met' : 'unmet'}`}
          >
            {criterion.met ? (
              <FaCheck className="criterion-icon success" />
            ) : (
              <FaTimes className="criterion-icon error" />
            )}
            <span className="criterion-text">{criterion.label}</span>
          </div>
        ))}
      </div>

      {validation.isValid && (
        <div className="password-valid">
          ✅ Votre mot de passe respecte les exigences de sécurité RGPD
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
