
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      // Hide on scroll down, show on scroll up
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
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

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}>
      <div className="bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border py-2 px-4 flex items-center gap-2">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/hospital-locator">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Hospital className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/ambulance">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Ambulance className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/chat">
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/wearables">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Watch className="h-5 w-5" />
          </Button>
        </Link>
        
        <Link to="/user-dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FloatingTopMenu;
