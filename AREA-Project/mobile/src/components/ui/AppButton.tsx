import React from 'react';
import { IonButton } from '@ionic/react';

interface Props extends React.ComponentProps<typeof IonButton> { loading?: boolean; }

export const AppButton: React.FC<Props> = ({ children, loading, disabled, ...rest }) => (
  <IonButton disabled={disabled || loading} {...rest}>
    {loading ? '...' : children}
  </IonButton>
);
