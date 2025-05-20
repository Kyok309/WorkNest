"use client";
import React, { useState } from "react";

const UserContext = React.createContext();

export const UserStore = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;