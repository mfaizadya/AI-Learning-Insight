import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Key,
    Copy,
    Eye,
    EyeOff,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    Shield,
    Sparkles
} from 'lucide-react';

/**
 * @fileoverview Premium API Keys Manager Component
 * @description Displays and manages user's API keys with premium design
 */

const MOCK_API_KEYS = [
    {
        id: 1,
        name: 'Production Key',
        prefix: 'ck_live_',
        maskedKey: 'ck_live_••••••••••••••••abc123',
        fullKey: 'ck_live_a1b2c3d4e5f6g7h8abc123',
        scopes: ['predict', 'usage:read'],
        createdAt: '2026-01-15T10:30:00Z',
        lastUsedAt: '2026-01-18T02:15:00Z',
        isActive: true,
        tier: 'professional',
    },
    {
        id: 2,
        name: 'Sandbox Key',
        prefix: 'ck_sandbox_',
        maskedKey: 'ck_sandbox_••••••••••••def456',
        fullKey: 'ck_sandbox_x9y8z7w6v5u4def456',
        scopes: ['predict', 'usage:read'],
        createdAt: '2026-01-10T08:00:00Z',
        lastUsedAt: '2026-01-17T14:30:00Z',
        isActive: true,
        tier: 'sandbox',
    },
];

const ApiKeysManager = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [revealedKeys, setRevealedKeys] = useState({});
    const [copiedKey, setCopiedKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKeys = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setApiKeys(MOCK_API_KEYS);
            setLoading(false);
        };
        fetchKeys();
    }, []);

    const toggleReveal = (keyId) => {
        setRevealedKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
    };

    const copyToClipboard = async (key, keyId) => {
        try {
            await navigator.clipboard.writeText(key.fullKey);
            setCopiedKey(keyId);
            setTimeout(() => setCopiedKey(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateString);
    };

    const getTierColor = (tier) => {
        const colors = {
            sandbox: 'bg-gradient-to-r from-gray-400 to-gray-500',
            starter: 'bg-gradient-to-r from-blue-400 to-blue-500',
            professional: 'bg-gradient-to-r from-primary to-accent',
            enterprise: 'bg-gradient-to-r from-amber-400 to-orange-500',
        };
        return colors[tier] || colors.sandbox;
    };

    if (loading) {
        return (
            <Card className="border-border/50 shadow-lg">
                <CardContent className="py-16">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
                        <div className="h-24 bg-muted rounded"></div>
                        <div className="h-24 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (apiKeys.length === 0) {
        return (
            <Card className="border-border/50 shadow-lg">
                <CardContent className="py-20 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Key size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No API Keys</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Anda belum memiliki API key. Hubungi admin untuk mendapatkan API key.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-5">
            <Card className="border-border/50 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-secondary/50 to-background border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                            <Key size={20} className="text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">API Keys</CardTitle>
                            <CardDescription>Kelola API keys untuk akses B2B API</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className="relative p-5 bg-gradient-to-br from-background to-secondary/10 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            {/* Tier badge */}
                            <div className="absolute top-4 right-4">
                                <Badge className={`${getTierColor(key.tier)} text-white text-[10px] px-2 py-0.5 capitalize`}>
                                    {key.tier}
                                </Badge>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 group-hover:scale-105 transition-transform">
                                    {key.prefix.includes('live') ? (
                                        <Sparkles size={20} className="text-primary" />
                                    ) : (
                                        <Shield size={20} className="text-gray-500" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-foreground">{key.name}</h4>
                                        {key.isActive ? (
                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2">
                                                <CheckCircle size={10} className="mr-1" />
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="text-[10px] px-2">Revoked</Badge>
                                        )}
                                    </div>

                                    {/* Key display */}
                                    <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg font-mono text-sm overflow-x-auto">
                                        <code className="text-gray-300 whitespace-nowrap flex-1">
                                            {revealedKeys[key.id] ? key.fullKey : key.maskedKey}
                                        </code>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-gray-700"
                                                onClick={() => toggleReveal(key.id)}
                                            >
                                                {revealedKeys[key.id] ? (
                                                    <EyeOff size={14} className="text-gray-400" />
                                                ) : (
                                                    <Eye size={14} className="text-gray-400" />
                                                )}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 hover:bg-gray-700"
                                                onClick={() => copyToClipboard(key, key.id)}
                                            >
                                                {copiedKey === key.id ? (
                                                    <CheckCircle size={14} className="text-green-400" />
                                                ) : (
                                                    <Copy size={14} className="text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            <span>Created {formatDate(key.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            <span>Last used {formatTimeAgo(key.lastUsedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span>Scopes:</span>
                                            {key.scopes.map(scope => (
                                                <Badge key={scope} variant="outline" className="text-[10px] px-1.5 py-0">
                                                    {scope}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 shadow-lg">
                <CardContent className="py-4">
                    <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 shrink-0">
                            <AlertCircle size={18} className="text-amber-600" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-amber-800 dark:text-amber-200">
                                Keep your API keys secure
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 mt-1">
                                Jangan pernah commit API key ke repository publik. Gunakan environment variables.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ApiKeysManager;
