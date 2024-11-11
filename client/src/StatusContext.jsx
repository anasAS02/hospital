import { createContext, useState, useContext } from 'react';

const StatusContext = createContext();

// eslint-disable-next-line react/prop-types
export const StatusProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <StatusContext.Provider value={{ isLoading, setIsLoading, isLoggedIn, setIsLoggedIn, userData, setUserData }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext);
