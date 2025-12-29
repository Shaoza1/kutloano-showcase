import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ComprehensiveAdminDashboard from "./ComprehensiveAdminDashboard";

const ADMIN_PASSWORD = "kutloano2024";
const ADMIN_EMAIL = "kutloano.moshao111@gmail.com";
const AUTH_KEY = "portfolio_admin_auth";

export default function AdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password === ADMIN_PASSWORD) {
      try {
        // First try to sign in with existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Sign in to Supabase with admin credentials
          const { data, error } = await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          });

          if (error) {
            console.error('Supabase auth failed:', error);
            toast({
              title: "Supabase Authentication Failed",
              description: "Using local mode. Certificates will use localStorage.",
              variant: "destructive",
            });
          } else {
            console.log('Supabase auth successful:', data.user?.email);
            toast({ 
              title: "Full Access Enabled", 
              description: "Connected to Supabase. Certificates will be saved permanently." 
            });
          }
        }

        localStorage.setItem(AUTH_KEY, "authenticated");
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.setItem(AUTH_KEY, "authenticated");
        setIsAuthenticated(true);
        toast({ 
          title: "Local Access Only", 
          description: "Using offline mode. Save the JSON backup for permanent storage." 
        });
      }
    } else {
      toast({
        title: "Access denied",
        description: "Invalid password",
        variant: "destructive",
      });
    }
    setLoading(false);
    setPassword("");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    toast({ title: "Logged out", description: "You have been logged out" });
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-background/80 backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <ComprehensiveAdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter password to access portfolio management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}