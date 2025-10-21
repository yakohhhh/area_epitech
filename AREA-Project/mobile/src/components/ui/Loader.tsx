import React from 'react';
import { IonSpinner } from '@ionic/react';

export const Loader: React.FC<{ inline?: boolean }> = ({ inline }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: inline ? 4 : 24 }}>
    <IonSpinner name="crescent" />
  </div>
);
