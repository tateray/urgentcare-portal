
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"user" | "admin">("user");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Welcome Back",
          description: "You have successfully logged in",
        });
        
        // Redirect based on user type
        if (userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created",
          description: "Your account has been created successfully",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message || "An error occurred while sending reset email",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md apple-card">
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-2">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex justify-center">
              <Heart className="text-destructive h-10 w-10" />
            </div>
            <div className="w-8"></div> {/* Empty div for alignment */}
          </div>
          <CardTitle className="text-2xl sf-pro-text">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Access your emergency medical services account" 
              : "Join to access emergency medical services"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={userType} 
            onValueChange={(value) => setUserType(value as "user" | "admin")}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <p className="text-sm text-muted-foreground mb-4">
                Login as a standard user to access emergency services, medical history, and more.
              </p>
            </TabsContent>
            <TabsContent value="admin">
              <p className="text-sm text-muted-foreground mb-4">
                Admin access for emergency services management, ambulance tracking, and system administration.
              </p>
            </TabsContent>
          </Tabs>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 apple-input"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 apple-input"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="apple-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+263 71 234 5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-9 apple-input"
                    />
                  </div>
                </div>
              </>
            )}
            
            <Button
              type="submit"
              className="w-full apple-button"
              disabled={loading}
            >
              {isLogin ? (userType === "admin" ? "Admin Sign In" : "Sign In") : "Create Account"}
            </Button>
          </form>
          
          {isLogin && (
            <Button
              variant="link"
              className="mt-2 p-0 h-auto text-sm"
              onClick={handleResetPassword}
            >
              Forgot password?
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // This would be implemented with the Firebase Google Sign-In provider
                toast({
                  title: "Google Sign-In",
                  description: "Google authentication would be implemented here",
                });
              }}
            >
              Continue with Google
            </Button>
          </div>
          
          <div className="text-center w-full">
            <Button
              variant="link"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
          
          {userType === "admin" && isLogin && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                <span className="font-medium text-orange-600 dark:text-orange-500">Admin Access</span>
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-500">
                This area is restricted to authorized hospital and emergency service administrators only.
              </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
