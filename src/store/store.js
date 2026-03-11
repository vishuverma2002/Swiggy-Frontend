"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "foodiehub_user";

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const defaultContext = {
  user: null,
  login: () => {},
  logOut: () => {},
  notifications: [],
  setNotifications: () => {},
  updateTheme: () => {},
  setShowPortfolioList: () => {},
  setAddPortfolio: () => {},
  showMessage: (msg) => console.log(msg),
  investorId: null,
  setShowClientList: () => {},
  selectedLocation: null,
  setSelectedLocation: () => {},
  modelZindex: 1000,
  setModelZIndex: () => {},
};

export const Context = createContext(defaultContext);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showPortfolioList, setShowPortfolioList] = useState(false);
  const [addPortfolio, setAddPortfolio] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const [investorId, setInvestorId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modelZindex, setModelZIndex] = useState(1000);

  useEffect(() => {
    setUser(getStoredUser());
    setIsHydrated(true);
  }, []);

  // Fallback: ensure we never get stuck on loading (handles hydration edge cases)
  useEffect(() => {
    const timer = setTimeout(() => setIsHydrated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData, rememberMe = false) => {
    const userObj = { email: userData?.email || "", name: userData?.name || "User" };
    setUser(userObj);
    if (rememberMe && typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userObj));
    }
  };

  const logOut = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const value = {
    user,
    login,
    logOut,
    isHydrated,
    notifications,
    setNotifications,
    updateTheme: () => {},
    setShowPortfolioList,
    setAddPortfolio,
    showMessage: (msg) => console.log(msg),
    investorId,
    setShowClientList,
    setInvestorId,
    selectedLocation,
    setSelectedLocation,
    modelZindex,
    setModelZIndex,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
