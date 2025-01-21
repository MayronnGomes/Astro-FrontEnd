// contexts/SidebarContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

  const [activeItem, setActiveItem] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeItem') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeItem', activeItem);
    }
  }, [activeItem]);

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
