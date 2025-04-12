import { createContext, useContext, useState, useEffect } from "react";

const authContextObj = createContext();

export const useAuth = () => useContext(authContextObj);

function AuthContext({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <authContextObj.Provider value={{ user, login, logout }}>
      {children}
    </authContextObj.Provider>
  );
}

export default AuthContext;
