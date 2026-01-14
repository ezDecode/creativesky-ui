"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CraftPageContextType {
  showCode: boolean;
  setShowCode: (show: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (full: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CraftPageContext = createContext<CraftPageContextType | undefined>(undefined);

export function CraftPageProvider({ children }: { children: ReactNode }) {
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <CraftPageContext.Provider 
      value={{ 
        showCode, 
        setShowCode, 
        isFullscreen, 
        setIsFullscreen, 
        isDrawerOpen, 
        setIsDrawerOpen 
      }}
    >
      {children}
    </CraftPageContext.Provider>
  );
}

export function useCraftPage() {
  const context = useContext(CraftPageContext);
  if (context === undefined) {
    throw new Error("useCraftPage must be used within a CraftPageProvider");
  }
  return context;
}
