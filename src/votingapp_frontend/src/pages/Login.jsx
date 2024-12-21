import React, { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import "../css/Login.scss";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        handleAuthSuccess(authClient);
      }
    };
    initAuth();
  }, []);

  const handleAuthSuccess = async (authClient) => {
    const identity = authClient.getIdentity();
    setPrincipal(identity.getPrincipal().toText());
    setIsAuthenticated(true);
  };

  const login = async () => {
    const authClient = await AuthClient.create();
    await authClient.login({
      identityProvider: "https://identity.ic0.app", // URL for Internet Identity
      onSuccess: () => handleAuthSuccess(authClient),
      onError: (err) => console.error("Authentication failed:", err),
    });
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
    setPrincipal(null);
  };

  return (
    <div className="login-container">
      {isAuthenticated ? (
        <div>
          <p>Welcome! Your Principal ID: {principal}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Internet Identity</button>
      )}
    </div>
  );
};

export default Login;