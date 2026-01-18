import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Key,
  BarChart3,
  Lock,
  ExternalLink,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import './SwaggerCustom.css';
import ApiKeysManager from '@/components/developer/ApiKeysManager';
import UsageStats from '@/components/developer/UsageStats';
import RequestAccessForm from '@/components/developer/RequestAccessForm';
import AccessRequestStatus from '@/components/developer/AccessRequestStatus'; // Import new component
import axios from 'axios';

/**
 * @fileoverview Developer Portal Page
 * @description Premium dashboard developer portal with B2B API access
 */

const DeveloperPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('docs');
  const [requestData, setRequestData] = useState(null); // Full request data
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For forcing re-fetch

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${apiBaseUrl}/api-access/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setRequestData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch API status", err);
        // If 404 or other error, requestData remains null (which means show Form)
        setRequestData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user, refreshTrigger]);

  // Determine Access State
  // user.role === 'admin' bypasses everything
  const isAdmin = user?.role === 'admin';
  const isApproved = requestData?.status === 'approved';
  // If approved but we want to show the specific Tenant UI, we rely on isApproved.
  // Ideally, if approved, we assume they have keys.

  const hasApiAccess = isAdmin || isApproved;

  const features = [
    { icon: <Zap size={18} />, label: 'Fast Predictions', desc: '< 100ms' },
    { icon: <Shield size={18} />, label: 'Secure API', desc: 'HTTPS + Key' },
    { icon: <BarChart3 size={18} />, label: 'Analytics', desc: 'Real-time' },
  ];

  const handleRetry = () => {
    // Clear request data to show form again
    setRequestData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border/50 p-6 md:p-8 shadow-sm">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Developer Portal
                  </h1>
                  <p className="text-muted-foreground mt-0.5 font-medium">
                    B2B API Integration Hub
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {features.map((f) => (
                  <div key={f.label} className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 text-sm shadow-sm transition-hover hover:border-primary/30">
                    <span className="text-primary">{f.icon}</span>
                    <span className="font-medium text-foreground">{f.label}</span>
                    <span className="text-muted-foreground text-xs">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {loading ? (
                <Skeleton className="h-9 w-32 rounded-full bg-primary/10" />
              ) : hasApiAccess ? (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm shadow-md shadow-green-500/20 border-0">
                  <Key size={14} className="mr-2" />
                  API Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-secondary/50 px-4 py-2 text-sm border-border">
                  <Lock size={14} className="mr-2 text-muted-foreground" />
                  {requestData?.status === 'pending' ? 'Reviewing' : 'No Access'}
                </Badge>
              )}

              <a
                href={`${apiBaseUrl}/docs`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <ExternalLink size={14} />
                Full Docs
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto inline-flex bg-secondary/30 p-1 rounded-xl border border-border/50 backdrop-blur-sm">
            <TabsTrigger
              value="docs"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              <Book size={16} />
              <span>Documentation</span>
            </TabsTrigger>

            <TabsTrigger
              value="keys"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
            >
              <Key size={16} />
              <span>API Keys</span>
              {!hasApiAccess && (
                <Lock size={12} className="ml-1 opacity-60" />
              )}
            </TabsTrigger>

            <TabsTrigger
              value="usage"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              disabled={!hasApiAccess}
            >
              <BarChart3 size={16} />
              <span>Usage</span>
              {!hasApiAccess && (
                <Lock size={12} className="ml-1 opacity-60" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="mt-6 animate-in fade-in zoom-in-95 duration-300">
            <Card className="border-border/50 shadow-lg overflow-hidden bg-background">
              <CardHeader className="bg-secondary/10 border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Book size={20} className="text-primary" />
                      B2B API Reference
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Endpoint lengkap untuk integrasi learning pattern prediction
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono bg-background/50">v2.0 Beta</Badge>
                </div>
              </CardHeader>
              <CardContent className="py-10">
                <div className='h-7'></div>
                <SwaggerUI
                  url={`${apiBaseUrl}/docs/openapi.json`}
                  docExpansion="list"
                  filter={false}
                  persistAuthorization={true}
                  defaultModelsExpandDepth={0}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="keys" className="mt-6 animate-in fade-in zoom-in-95 duration-300">
            {loading ? (
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {hasApiAccess ? (
                  <ApiKeysManager />
                ) : (
                  <>
                    {requestData ? (
                      <AccessRequestStatus
                        request={requestData}
                        onRetry={handleRetry}
                      />
                    ) : (
                      <RequestAccessForm />
                    )}
                  </>
                )}
              </>
            )}
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="mt-8 animate-in fade-in zoom-in-95 duration-300">
            {hasApiAccess ? (
              <UsageStats />
            ) : (
              <Card className="border-border/50 shadow-lg pt-10">
                {/* Locked State */}
                <CardContent className="py-20 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Lock size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Usage Statistics Locked</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Anda memerlukan API access untuk melihat statistik penggunaan.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeveloperPage;
