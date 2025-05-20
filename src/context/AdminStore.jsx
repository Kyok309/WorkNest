"use client";
import React, { useState } from "react";

const AdminContext = React.createContext();

export const AdminStore = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const logout = () => {
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, setAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;