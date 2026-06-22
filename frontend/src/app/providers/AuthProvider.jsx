import { createContext, useContext, useEffect, useState } from "react";

import { api } from "../../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const response = await api.get("/auth/status");

        setUser(response.data.user);

        setSetupRequired(response.data.setupRequired);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        setupRequired,
        setSetupRequired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
