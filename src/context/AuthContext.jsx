import { useState, useEffect } from "react";
import { AuthContext } from "./useAuth";
import axios from 'axios';
import { Wifi, WifiOff, Moon } from 'lucide-react';

// Helper to set the authorization header for all axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['x-authorization'];
  }
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const API_URL = 'https://scraper.shopimo.cz/api/?method=userLogin';

  // Check for token on initial app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }

    // Add a response interceptor
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Check if the error is a 401 Unauthorized
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized, logging out.");
          doLogout(); // Automatically log out the user
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  
  const doLogin = async (email, password) => {
    try {
        const response = await axios.post(API_URL, {
            email: email,
            password: password,
        });

        // API vrací JSON objekt, např. {"result":"ok","ok":1}
        if (response.data.result === 'ok' && response.data.token) {
            const token = response.data.token;
            localStorage.setItem('authToken', token); // Save token
            setAuthToken(token); // Set axios header
            setIsLoggedIn(true);
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('Login API error:', err);
        throw new Error('Chyba komunikace se serverem.');
    }
  };

  const doLogout = () => {
    console.log("Odhlášení uživatele");
    localStorage.removeItem('authToken'); // Remove token
    setAuthToken(null); // Clear axios header
    setIsLoggedIn(false);
  };

  const getStatusIcon = (device) => {
    if (device && Number(device.active) === 0) {
      return <Moon className="w-8 h-8 text-gray-300" />;
    }

    const ago = device?.workedAgoSec ?? 0;
    const minutes = ago / 60;
    if (minutes <= 5) return <Wifi className="w-8 h-8 text-green-500" />;
    if (minutes > 5)  return <WifiOff className="w-8 h-8 text-gray-400" />;
    return <WifiOff className="w-8 h-8" />;
  };

  const formatAgo = (sec) => {
    const workedAgoSec = sec ?? 0;
    const minutes = Math.floor(workedAgoSec / 60);
    const seconds = workedAgoSec % 60;

    let timeAgo = '';
    if (minutes === 0) timeAgo = `${seconds}s`;
    else if (minutes < 60) timeAgo = `${minutes}m ${seconds}s`;
    else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours < 24) timeAgo = `${hours}h ${remainingMinutes}m`;
      else {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        timeAgo = `${days}d ${remainingHours}h`;
      }
    }
    
    return (
        <p>{timeAgo}</p>
    );
    
  };

  const formatEfficiency = (qty, estimatedSpeed) => {
    // percent = round(qty / ( estimatedSpeed / 100 ));
    let percent = Math.round(qty / ( estimatedSpeed / 100 ));
    //console.log( qty );
    //console.log( estimatedSpeed );
    let color;
         if(percent<50)  color="text-red-500";
    else if(percent<66)  color="text-orange-400";
    else if(percent<100) color="text-black-500";
    else                 color="text-green-600";
    return (
        <span className={`${color}`}>{percent}%</span>
    );
  }

  const getStatusText = (device, withSpeeds) => {
    // prepare numbers (safe defaults)
    const t1 = Math.round(device?.tasks_last_1_hour/1) ?? 0;
    const t3 = Math.round(device?.tasks_last_3_hour/3) ?? 0;
    const t8 = Math.round(device?.tasks_last_8_hour/8) ?? 0;

    const workedAgoSec = device?.workedAgoSec ?? 0;
    const minutes = Math.floor(workedAgoSec / 60);
    const seconds = workedAgoSec % 60;

    let timeAgo = '';
    if (minutes === 0) timeAgo = `${seconds}s`;
    else if (minutes < 60) timeAgo = `${minutes}m ${seconds}s`;
    else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours < 24) timeAgo = `${hours}h ${remainingMinutes}m`;
      else {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        timeAgo = `${days}d ${remainingHours}h`;
      }
    }

    if( withSpeeds )
    {
      return (
        <>
          <p>{timeAgo}</p>
          <p className="text-2xs">{t1} / {t3} / {t8}</p>
        </>
      );
    }
    else
    {
      return (
          <p>{timeAgo}</p>
      );
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, doLogin, doLogout, getStatusIcon, getStatusText, formatAgo, formatEfficiency }}>
      {children}
    </AuthContext.Provider>
  );
}


