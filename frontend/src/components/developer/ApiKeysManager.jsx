import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Key,
    Copy,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    Shield,
    Sparkles,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ApiKeysManager = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newKey, setNewKey] = useState(null); // For displaying newly generated key
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiBaseUrl}/api-access/keys`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setApiKeys(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch keys:', error);
            // toast.error('Gagal memuat API Keys');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleRegenerate = async () => {
        if (!confirm('Apakah Anda yakin ingin mengganti API Key? Key lama hangus.')) return;

        try {
            setRegenerating(true);
            const token = localStorage.getItem('token');
            const res = await axios.post(`${apiBaseUrl}/api-access/keys/regenerate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setNewKey(res.data.data.apiKey);
                setIsModalOpen(true);
                toast.success('API Key berhasil diperbarui!');
                fetchKeys();
            }
        } catch (error) {
            toast.error('Gagal regenerate key: ' + (error.response?.data?.message || 'Error'));
        } finally {
            setRegenerating(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Key disalin ke clipboard');
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
        if (!dateString) return 'Never';
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
                    <h3 className="text-xl font-semibold mb-2">No API Keys Found</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Anda belum memiliki active API key. Pastikan request Anda sudah disetujui.
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
                            <CardTitle className="text-lg">My API Keys</CardTitle>
                            <CardDescription>Kelola kredensial akses Anda</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {apiKeys.map((key) => (
                        <div
                            key={key.id}
                            className="relative p-5 bg-gradient-to-br from-background to-secondary/10 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group"
                        >
                            {/* Tier Badge */}
                            <div className="absolute top-4 right-4">
                                <Badge className={`${getTierColor(key.tier)} text-white text-[10px] px-2 py-0.5 capitalize`}>
                                    {key.tier || 'Standard'}
                                </Badge>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 group-hover:scale-105 transition-transform">
                                    <Sparkles size={20} className="text-primary" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-foreground">{key.name}</h4>
                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-2">
                                                Active
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Key display (Masked) */}
                                    <div className="flex items-center gap-2 p-3 bg-gray-900 rounded-lg font-mono text-sm overflow-x-auto">
                                        <code className="text-gray-300 whitespace-nowrap flex-1">
                                            {key.maskedKey}
                                        </code>

                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 px-3 text-xs gap-1 hover:bg-white/10 hover:text-white transition-colors"
                                            onClick={handleRegenerate}
                                            disabled={regenerating}
                                        >
                                            <RefreshCw size={12} className={regenerating ? "animate-spin" : ""} />
                                            Roll Key
                                        </Button>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            <span>Created {formatDate(key.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={12} />
                                            <span>Last used {formatTimeAgo(key.last_used_at)}</span>
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
                                Perhatian
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 mt-1">
                                Jika Anda melakukan "Roll Key", key lama akan langsung hangus. Pastikan Anda update aplikasi yang menggunakan key lama.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* New Key Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>API Key Baru Anda</DialogTitle>
                        <DialogDescription>
                            Simpan key ini sekarang. Anda tidak akan bisa melihatnya lagi setelah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Input
                                id="link"
                                value={newKey || ''}
                                readOnly
                                className="font-mono bg-muted"
                            />
                        </div>
                        <Button size="sm" className="px-3" onClick={() => copyToClipboard(newKey)}>
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ApiKeysManager;
