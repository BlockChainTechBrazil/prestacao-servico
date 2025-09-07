// src/App.tsx 
import React from 'react'; 
import { BrowserRouter } from 'react-router-dom'; 
import { AppProvider } from './context/AppContext'; 
import { Navbar } from './components/Navbar'; 
import { AppRoutes } from './routes'; 
 
function App() { 
  return ( 
    <AppProvider> 
      <BrowserRouter> 
        <Navbar /> 
        <main className="py-8"> 
          <AppRoutes /> 
        </main> 
      </BrowserRouter> 
    </AppProvider> 
  ); 
} 
 
export default App; 
