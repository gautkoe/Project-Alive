import React, { createContext, useState, ReactNode } from 'react';

export interface AppState {
  companyName: string;
  analysisDate: string;
  currentPeriod: string;
  sector: string;
  currency: string;
}

export interface AppContextType {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
}

const defaultState: AppState = {
  companyName: 'ACME SAS',
  analysisDate: '2024-01-15',
  currentPeriod: 'LTM Décembre 2024',
  sector: 'Services B2B',
  currency: 'EUR'
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(defaultState);

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ appState, updateAppState }}>
      {children}
    </AppContext.Provider>
  );
};