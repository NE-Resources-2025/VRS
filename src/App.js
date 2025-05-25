import React from 'react';
import { AuthProvider } from './context/AuthContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => (
  <AuthProvider style={{ flex: 1 }}>
    <RootNavigator />
  </AuthProvider>
);

export default App;