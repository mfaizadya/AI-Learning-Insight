import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Database,
    RefreshCw,
    Shield,
    Sparkles,
    Search,
    Filter,
    Activity,
    Copy,
    ChevronLeft,
    ChevronRight
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

// --- Components ---

const StatCard = ({ label, value, icon, colorClass, borderClass }) => (
    <Card className={`border shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md bg-white py-6 rounded-md ${borderClass}`}>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h4 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h4>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorClass}`}>
                {icon}
            </div>
            {/* Decorative bottom fade */}
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r rounded-b-xl opacity-30 ${colorClass.replace('bg-', 'from-').replace('/10', '').replace('/20', '')} to-transparent`} />
        </CardContent>
    </Card>
);

const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
        approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100',
        rejected: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100',
    };

    const icons = {
        pending: <Clock size={12} className="mr-1.5" />,
        approved: <CheckCircle2 size={12} className="mr-1.5" />,
        rejected: <XCircle size={12} className="mr-1.5" />
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ring-1 ring-inset transition-colors duration-200 ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
            {icons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// --- Page ---

const ApiRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Artificial delay for smoother UX transition (prevent instant flicker)
            const [res] = await Promise.all([
                axios.get(`${apiBaseUrl}/api-access/requests`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { status: filter === 'all' ? undefined : filter }
                }),
                new Promise(resolve => setTimeout(resolve, 300))
            ]);

            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const [newApiKey, setNewApiKey] = useState(null);
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

    const handleAction = async (id, action, reason = null) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${apiBaseUrl}/api-access/requests/${id}/${action}`;

            const res = await axios.post(url, { reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if ((action === 'approve' || action === 'regenerate') && res.data?.data?.apiKey) {
                setNewApiKey(res.data.data.apiKey);
                setIsKeyModalOpen(true);
            }

            toast.success(`Request ${action} successful`);
            fetchRequests();
        } catch (error) {
            toast.error(`Action failed: ${error.response?.data?.message || 'Error'}`);
        }
    };

    const copyToClipboard = () => {
        if (newApiKey) {
            navigator.clipboard.writeText(newApiKey);
            toast.success("Copied to clipboard!");
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const activeCount = requests.filter(r => r.status === 'approved').length;

    // Loading Skeleton Row Component
    const TableSkeletonRow = () => (
        <tr className="border-b border-slate-50 last:border-0">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full bg-slate-100" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-slate-100" />
                        <Skeleton className="h-3 w-20 bg-slate-100" />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full bg-slate-100" /></td>
            <td className="px-6 py-4"><Skeleton className="h-5 w-20 bg-slate-100" /></td>
            <td className="px-6 py-4"><Skeleton className="h-5 w-24 bg-slate-100" /></td>
            <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto bg-slate-100" /></td>
        </tr>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FC] py-8 px-6 sm:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                <Shield className="text-indigo-600" size={24} />
                            </div>
                            Access Management
                        </h1>
                        <p className="text-slate-500 mt-2 text-base max-w-2xl px-1">
                            Manage API credentials and monitor partner integration requests.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 h-10 px-4">
                            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : 'text-slate-400'}`} />
                            Sync
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm h-10 px-4">
                            <Filter size={16} className="mr-2" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* KPI Cards Row (Symmetrical Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Pending Reviews"
                        value={loading ? '-' : pendingCount}
                        icon={<Clock size={22} />}
                        colorClass="bg-amber-100/50 text-amber-600"
                        borderClass="border-amber-100"
                    />
                    <StatCard
                        label="Active Partners"
                        value={loading ? '-' : activeCount}
                        icon={<Activity size={22} />}
                        colorClass="bg-emerald-100/50 text-emerald-600"
                        borderClass="border-emerald-100"
                    />
                    <StatCard
                        label="Total Requests"
                        value={loading ? '-' : requests.length}
                        icon={<Database size={22} />}
                        colorClass="bg-blue-100/50 text-blue-600"
                        borderClass="border-blue-100"
                    />
                    <StatCard
                        label="System Global"
                        value="Healthy"
                        icon={<CheckCircle2 size={22} />}
                        colorClass="bg-indigo-50 text-indigo-600"
                        borderClass="border-indigo-100"
                    />
                </div>

                {/* Main Content Area */}
                <Card className="border shadow-sm bg-white overflow-hidden rounded-xl">
                    {/* Controls Toolbar */}
                    <div className="border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="flex bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50">
                                {['pending', 'approved', 'rejected', 'all'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`
                                            px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize duration-200
                                            ${filter === f
                                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5 scale-[1.02]'
                                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                            }
                                        `}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                placeholder="Search organization..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/30 focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-[35%]">Organization</th>
                                    <th className="px-6 py-4 w-[15%]">Use Case</th>
                                    <th className="px-6 py-4 w-[15%]">Tier / Limit</th>
                                    <th className="px-6 py-4 w-[15%]">Status</th>
                                    <th className="px-6 py-4 w-[20%] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    // Skeletons replace ROWS, ensuring header stays fixed
                                    [1, 2, 3, 4, 5].map(i => <TableSkeletonRow key={i} />)
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-2">
                                                    <Search className="text-slate-300" size={28} />
                                                </div>
                                                <h3 className="text-slate-900 font-medium text-lg">No requests found</h3>
                                                <p className="text-slate-500 max-w-sm mx-auto">
                                                    There are no {filter !== 'all' ? filter : ''} requests at the moment.
                                                </p>
                                                {filter !== 'all' && (
                                                    <Button variant="link" onClick={() => setFilter('all')} className="text-indigo-600 mt-2">
                                                        Clear filters
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors animate-in fade-in duration-300">
                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100/50 shrink-0 shadow-sm">
                                                        {req.organization_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{req.organization_name}</div>
                                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            {req.contact_email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <Badge variant="secondary" className="bg-white text-slate-700 border border-slate-200/60 font-medium capitalize shadow-sm px-2.5 py-1">
                                                    {req.use_case.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <span className="font-mono text-slate-600 text-xs bg-slate-100/80 px-2 py-1 rounded border border-slate-200/80">
                                                    {parseInt(req.expected_requests).toLocaleString()} <span className="text-slate-400">/mo</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-6 py-4 align-middle text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                                title="Reject"
                                                                onClick={() => handleAction(req.id, 'reject')}
                                                            >
                                                                <XCircle size={18} />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm rounded-lg transition-all active:scale-95"
                                                                title="Approve"
                                                                onClick={() => handleAction(req.id, 'approve')}
                                                            >
                                                                <CheckCircle2 size={16} />
                                                                <span>Approve</span>
                                                            </Button>
                                                        </>
                                                    )}
                                                    {req.status === 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 gap-2 text-xs rounded-lg transition-colors"
                                                            title="Regenerate Key"
                                                            onClick={() => handleAction(req.id, 'regenerate')}
                                                        >
                                                            <RefreshCw size={12} />
                                                            Roll Key
                                                        </Button>
                                                    )}
                                                    {req.status === 'rejected' && (
                                                        <span className="text-xs text-slate-400 italic pr-2">Rejected</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination - Aligned with symmetry */}
                    <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">Page 1 of 1</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white">
                                <ChevronLeft size={16} className="text-slate-400" />
                            </Button>
                            <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white">
                                <ChevronRight size={16} className="text-slate-400" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Secure Credential Modal */}
                <Dialog open={isKeyModalOpen} onOpenChange={setIsKeyModalOpen}>
                    <DialogContent className="sm:max-w-md bg-white border-slate-200 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-indigo-900">
                                <Shield className="text-indigo-600" size={20} />
                                Access Credential
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                                The B2B API Key has been generated securely.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 mt-2">
                            <div className="flex justify-between items-center">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">API Key</p>
                                <Badge variant="outline" className="text-[10px] bg-white text-emerald-600 border-emerald-200 px-1.5 py-0">LIVE NOW</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="link"
                                    value={newApiKey || ''}
                                    readOnly
                                    className="font-mono bg-white text-sm text-slate-700 border-slate-200 focus-visible:ring-indigo-500 rounded-lg h-10"
                                />
                                <Button size="sm" className="h-10 w-10 p-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm rounded-lg" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-start gap-2 pt-1">
                                <Sparkles size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-slate-500 leading-tight">
                                    Copy instantly. For security, this key won't be displayed again.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-end mt-2">
                            <Button
                                type="button"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full shadow-md rounded-lg h-10 font-medium"
                                onClick={() => setIsKeyModalOpen(false)}
                            >
                                Done, I have it
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ApiRequestsPage;
