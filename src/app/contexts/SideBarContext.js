// contexts/SidebarContext.js
import { createContext, useState, useContext } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState('');

  return (
    <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
