import React from 'react';
import { IonText, IonIcon } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import { PasswordValidation, getPasswordStrength } from '../hooks/usePasswordValidation';

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
    <div style={{ marginTop: '12px' }}>
      {/* Barre de force */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          height: '6px',
          backgroundColor: '#e2e8f0',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: strength.color,
              width: `${strength.percentage}%`,
              transition: 'all 0.3s ease'
            }}
          />
        </div>
        <IonText color="medium" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Force: <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
        </IonText>
      </div>

      {/* Critères */}
      <div style={{ fontSize: '12px' }}>
        {criteria.map((criterion) => (
          <div
            key={criterion.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              color: criterion.met ? '#10b981' : '#64748b'
            }}
          >
            <IonIcon
              icon={criterion.met ? checkmark : close}
              style={{
                color: criterion.met ? '#10b981' : '#ef4444',
                fontSize: '14px',
                marginRight: '6px'
              }}
            />
            <span>{criterion.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;