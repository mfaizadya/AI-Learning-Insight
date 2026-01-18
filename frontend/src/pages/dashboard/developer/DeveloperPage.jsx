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
    ArrowRight
} from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import ApiKeysManager from '@/components/developer/ApiKeysManager';
import UsageStats from '@/components/developer/UsageStats';
import RequestAccessForm from '@/components/developer/RequestAccessForm';

/**
 * @fileoverview Developer Portal Page
 * @description Premium dashboard developer portal with B2B API access
 */

const swaggerDashboardCss = `
  .swagger-ui .topbar { display: none !important; }
  .swagger-ui .info { margin: 0 !important; padding: 1rem !important; }
  .swagger-ui .info .title { 
    font-size: 1.25rem !important; 
    font-weight: 600 !important;
    color: hsl(262 40% 32%) !important;
  }
  .swagger-ui .opblock-tag { 
    color: hsl(262 40% 32%) !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
  }
  .swagger-ui .opblock {
    border-radius: 10px !important;
    margin: 0.5rem 0 !important;
    border: 1px solid hsl(262 20% 88%) !important;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: linear-gradient(135deg, hsl(262 40% 42%) 0%, hsl(262 50% 55%) 100%) !important;
    border-radius: 6px !important;
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: linear-gradient(135deg, hsl(142 70% 40%) 0%, hsl(142 60% 50%) 100%) !important;
    border-radius: 6px !important;
  }
  .swagger-ui .btn.execute {
    background: linear-gradient(135deg, hsl(262 40% 42%) 0%, hsl(262 50% 55%) 100%) !important;
    border: none !important;
    border-radius: 8px !important;
  }
  .swagger-ui .scheme-container {
    background: hsl(262 35% 98%) !important;
    border-radius: 10px !important;
    border: 1px solid hsl(262 20% 88%) !important;
    box-shadow: none !important;
  }
  .swagger-ui section.models {
    border-radius: 10px !important;
    border: 1px solid hsl(262 20% 88%) !important;
  }
`;

const DeveloperPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('docs');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // Admin always has access, or user with apiAccessApproved
    const hasApiAccess = user?.role === 'admin' || user?.apiAccessApproved === true;

    useEffect(() => {
        const styleId = 'cerdasku-swagger-dashboard';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = swaggerDashboardCss;
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) existingStyle.remove();
        };
    }, []);

    const features = [
        { icon: <Zap size={18} />, label: 'Fast Predictions', desc: '< 100ms' },
        { icon: <Shield size={18} />, label: 'Secure API', desc: 'HTTPS + Key' },
        { icon: <BarChart3 size={18} />, label: 'Analytics', desc: 'Real-time' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border/50 p-6 md:p-8">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                        Developer Portal
                                    </h1>
                                    <p className="text-muted-foreground mt-0.5">
                                        B2B API Integration Hub
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                {features.map((f) => (
                                    <div key={f.label} className="flex items-center gap-2 px-3 py-1.5 bg-background/80 rounded-lg border border-border/50 text-sm">
                                        <span className="text-primary">{f.icon}</span>
                                        <span className="font-medium">{f.label}</span>
                                        <span className="text-muted-foreground text-xs">{f.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {hasApiAccess ? (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
                                    <Key size={14} className="mr-2" />
                                    API Active
                                </Badge>
                            ) : (
                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 text-sm">
                                    <Lock size={14} className="mr-2" />
                                    Request Access
                                </Badge>
                            )}

                            <a
                                href="/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                <ExternalLink size={14} />
                                Full Docs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full md:w-auto inline-flex bg-secondary/30 p-1 rounded-xl border border-border/50">
                        <TabsTrigger
                            value="docs"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                        >
                            <Book size={16} />
                            <span>Documentation</span>
                        </TabsTrigger>

                        <TabsTrigger
                            value="keys"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                        >
                            <Key size={16} />
                            <span>API Keys</span>
                            {!hasApiAccess && (
                                <Lock size={12} className="ml-1 opacity-60" />
                            )}
                        </TabsTrigger>

                        <TabsTrigger
                            value="usage"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
                        >
                            <BarChart3 size={16} />
                            <span>Usage</span>
                            {!hasApiAccess && (
                                <Lock size={12} className="ml-1 opacity-60" />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* Documentation Tab */}
                    <TabsContent value="docs" className="mt-6">
                        <Card className="border-border/50 shadow-lg overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-secondary/50 to-background border-b border-border/50 pb-4">
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
                                    <Badge variant="outline" className="font-mono">v2.0</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
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

                    {/* API Keys Tab */}
                    <TabsContent value="keys" className="mt-6">
                        {hasApiAccess ? (
                            <ApiKeysManager />
                        ) : (
                            <RequestAccessForm />
                        )}
                    </TabsContent>

                    {/* Usage Tab */}
                    <TabsContent value="usage" className="mt-6">
                        {hasApiAccess ? (
                            <UsageStats />
                        ) : (
                            <Card className="border-border/50 shadow-lg">
                                <CardContent className="py-20 text-center">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                        <Lock size={32} className="text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Usage Statistics Locked</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                        Anda memerlukan API access untuk melihat statistik penggunaan.
                                        Request access terlebih dahulu di tab API Keys.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('keys')}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                                    >
                                        Request Access
                                        <ArrowRight size={16} />
                                    </button>
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
