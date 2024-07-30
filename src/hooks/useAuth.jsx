// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextProvider';

// Custom hook to use the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
 