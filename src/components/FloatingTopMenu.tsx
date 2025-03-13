
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Home, 
  Hospital, 
  Ambulance, 
  MessageCircle, 
  User,
  Watch,
  ArrowLeft,
  Menu
} from "lucide-react";

const FloatingTopMenu = () => {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      // Show the menu when scrolling down past a threshold
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      
      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}>
      <div className="bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border py-2 px-4 flex items-center gap-2">
        <Link to="/">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/') ? 'text-blue-500' : ''}`}>
              <Home className="h-5 w-5" />
            </Button>
            {isActive('/') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
        
        <Link to="/hospital-locator">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/hospital-locator') ? 'text-blue-500' : ''}`}>
              <Hospital className="h-5 w-5" />
            </Button>
            {isActive('/hospital-locator') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
        
        <Link to="/ambulance">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/ambulance') ? 'text-blue-500' : ''}`}>
              <Ambulance className="h-5 w-5" />
            </Button>
            {isActive('/ambulance') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
        
        <Link to="/chat">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/chat') ? 'text-blue-500' : ''}`}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            {isActive('/chat') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
        
        <Link to="/wearables">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/wearables') ? 'text-blue-500' : ''}`}>
              <Watch className="h-5 w-5" />
            </Button>
            {isActive('/wearables') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
        
        <Link to="/user-dashboard">
          <div className="relative">
            <Button variant="ghost" size="icon" className={`rounded-full ${isActive('/user-dashboard') ? 'text-blue-500' : ''}`}>
              <User className="h-5 w-5" />
            </Button>
            {isActive('/user-dashboard') && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-5 bg-blue-500 rounded-full" />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FloatingTopMenu;
