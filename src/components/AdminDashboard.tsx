"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  Eye, 
  Users, 
  FileText, 
  Mail, 
  TrendingUp,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  summary: {
    totalPageViews: number;
    totalContacts: number;
    totalCVDownloads: number;
    totalProjectInteractions: number;
    uniqueVisitors: number;
  };
  projectInteractions: Record<string, {
    views: number;
    demoClicks: number;
    githubClicks: number;
    likes: number;
  }>;
  visitors: Array<{
    country: string;
    city: string;
    deviceType: string;
    browser: string;
    os: string;
    pageViews: number;
    timeOnSite: string;
    timestamp: string;
  }>;
  timeframe: string;
}

interface CVFile {
  id: string;
  filename: string;
  file_path: string;
  upload_date: string;
  is_active: boolean;
  version: number;
  file_size: number;
}

export default function AdminDashboard() {
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const { toast } = useToast();

  const ADMIN_KEY = 'portfolio_admin_2024'; // In production, use proper authentication

  useEffect(() => {
    if (isAuthenticated) {
      fetchCVFiles();
      fetchAnalytics(timeframe);
    }
  }, [isAuthenticated, timeframe]);

  const handleAuth = () => {
    if (authKey === ADMIN_KEY) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid admin key",
        variant: "destructive",
      });
    }
  };

  const fetchCVFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cv_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCvFiles(data || []);
    } catch (error) {
      console.error('Error fetching CV files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch CV files",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async (period: string) => {
    try {
      const response = await supabase.functions.invoke('analytics-dashboard', {
        body: { timeframe: period }
      });

      if (response.error) throw response.error;
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('makeActive', 'true');

      const response = await supabase.functions.invoke('cv-upload', {
        body: formData
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "CV uploaded successfully!",
      });

      fetchCVFiles();
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Error",
        description: "Failed to upload CV",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const setActiveCV = async (cvId: string) => {
    try {
      // Deactivate all CVs first
      await supabase
        .from('cv_management')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      // Activate selected CV
      const { error } = await supabase
        .from('cv_management')
        .update({ is_active: true })
        .eq('id', cvId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Active CV updated successfully!",
      });

      fetchCVFiles();
    } catch (error) {
      console.error('Error setting active CV:', error);
      toast({
        title: "Error",
        description: "Failed to update active CV",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
            <Button onClick={handleAuth} className="w-full">
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Portfolio Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="cv-management">CV Management</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-semibold">Analytics Overview</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalPageViews}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.uniqueVisitors}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalCVDownloads}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalContacts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Project Interactions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalProjectInteractions}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {analytics && Object.keys(analytics.projectInteractions).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.projectInteractions).map(([projectId, stats]) => (
                      <div key={projectId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{projectId}</span>
                          <div className="flex gap-2">
                            <Badge variant="secondary">{stats.views} views</Badge>
                            <Badge variant="outline">{stats.demoClicks} demos</Badge>
                            <Badge variant="outline">{stats.githubClicks} github</Badge>
                          </div>
                        </div>
                        <Progress value={(stats.views / Math.max(...Object.values(analytics.projectInteractions).map(s => s.views))) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cv-management" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">CV Management</h2>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="cv-upload"
                />
                <Button 
                  onClick={() => document.getElementById('cv-upload')?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload New CV'}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {cvFiles.map((cv) => (
                <Card key={cv.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{cv.filename}</h3>
                          {cv.is_active && (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Version {cv.version} • {Math.round(cv.file_size / 1024)} KB • 
                          Uploaded {new Date(cv.upload_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!cv.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveCV(cv.id)}
                          >
                            Set Active
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visitors" className="space-y-6">
            <h2 className="text-xl font-semibold">Visitor Insights</h2>
            
            {analytics && analytics.visitors.length > 0 && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Device & Browser Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Device Types</h4>
                        <div className="space-y-2">
                          {Object.entries(
                            analytics.visitors.reduce((acc, visitor) => {
                              acc[visitor.deviceType] = (acc[visitor.deviceType] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([device, count]) => (
                            <div key={device} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {device === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                <span className="capitalize">{device}</span>
                              </div>
                              <Badge variant="secondary">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Top Countries</h4>
                        <div className="space-y-2">
                          {Object.entries(
                            analytics.visitors.reduce((acc, visitor) => {
                              acc[visitor.country] = (acc[visitor.country] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).slice(0, 5).map(([country, count]) => (
                            <div key={country} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>{country}</span>
                              </div>
                              <Badge variant="secondary">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Top Browsers</h4>
                        <div className="space-y-2">
                          {Object.entries(
                            analytics.visitors.reduce((acc, visitor) => {
                              acc[visitor.browser] = (acc[visitor.browser] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>)
                          ).slice(0, 5).map(([browser, count]) => (
                            <div key={browser} className="flex items-center justify-between">
                              <span>{browser}</span>
                              <Badge variant="secondary">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}