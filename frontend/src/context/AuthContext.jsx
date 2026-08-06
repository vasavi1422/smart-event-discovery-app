import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check student email
  const isStudentEmail = (email) => {
    if (!email) return false;
    return email.endsWith(".edu") || email.endsWith(".ac.in");
  };

  // ✅ LOGIN (store full user + token)
  const login = (data) => {
    const userData = {
      token: data.token,
      name: data.user?.name,
      email: data.user?.email,
      id: data.user?._id || data.user?.id,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ AUTO LOAD USER
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");

      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.log("Auth load error:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isStudentEmail,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}