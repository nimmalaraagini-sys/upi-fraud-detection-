/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AuthScreens } from "./components/AuthScreens";
import { MainDashboard } from "./components/MainDashboard";

export default function App() {
  // Check if session is already active from local storage or previous login
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    mobile: string;
    email: string;
  } | null>(() => {
    try {
      const isSessionActive = localStorage.getItem("safeupi_session_logged_in");
      const savedUser = localStorage.getItem("safeupi_active_user");
      if (isSessionActive === "true" && savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn("Session check error", e);
    }
    return null;
  });

  const handleLoginSuccess = (userData: { name: string; mobile: string; email: string }) => {
    try {
      localStorage.setItem("safeupi_session_logged_in", "true");
      localStorage.setItem("safeupi_active_user", JSON.stringify(userData));
    } catch (e) {
      console.warn("Failed to persist user session", e);
    }
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("safeupi_session_logged_in");
      localStorage.removeItem("safeupi_active_user");
    } catch (e) {
      console.warn("Failed to clear user session", e);
    }
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {!currentUser ? (
        <AuthScreens onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MainDashboard
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
