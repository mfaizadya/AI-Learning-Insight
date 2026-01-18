import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Clock,
    XCircle,
    CheckCircle2,
    Building2,
    Mail,
    FileText,
    RefreshCcw,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

const StatusTimeline = ({ status }) => {
    const steps = [
        { id: 'submitted', label: 'Form Submitted', done: true },
        { id: 'review', label: 'Under Review', done: true, current: status === 'pending' },
        { id: 'approval', label: 'Decision', done: status === 'approved' || status === 'rejected', current: false } // Final state
    ];

    return (
        <div className="flex items-center justify-between w-full max-w-sm mx-auto mb-8 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>

            {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center bg-background px-2 z-10">
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                        ${step.done ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'}
                        ${step.current ? 'ring-4 ring-primary/20' : ''}
                    `}>
                        {step.done ? <CheckCircle2 size={14} /> : (index + 1)}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step.done || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const AccessRequestStatus = ({ request, onRetry }) => {
    if (!request) return null;

    const isPending = request.status === 'pending';
    const isRejected = request.status === 'rejected';
    const isApproved = request.status === 'approved';

    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border shadow-lg overflow-hidden relative">
                {/* Status Header Strip */}
                <div className={`h-2 w-full absolute top-0 left-0 
                    ${isPending ? 'bg-amber-500' : ''}
                    ${isRejected ? 'bg-destructive' : ''}
                    ${isApproved ? 'bg-green-500' : ''}
                `} />

                <CardContent className="pt-10 pb-8 px-6 md:px-10 text-center">
                    {/* Icon & Title */}
                    <div className="mb-6">
                        {isPending && (
                            <div className="w-20 h-20 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-500/5 animate-pulse">
                                <Clock size={40} className="text-amber-500" />
                            </div>
                        )}
                        {isRejected && (
                            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4 ring-8 ring-destructive/5">
                                <XCircle size={40} className="text-destructive" />
                            </div>
                        )}
                        {isApproved && (
                            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4 ring-8 ring-green-500/5">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                        )}

                        <h2 className="text-2xl font-bold tracking-tight mb-2">
                            {isPending && 'Application Under Review'}
                            {isRejected && 'Application Rejected'}
                            {isApproved && 'Application Approved'}
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {isPending && 'Tim kami sedang meninjau permintaan API Access Anda. Estimasi waktu review adalah 1-2 hari kerja.'}
                            {isRejected && 'Mohon maaf, permintaan Anda belum dapat kami setujui saat ini.'}
                            {isApproved && 'Selamat! Permintaan Anda telah disetujui. Anda sekarang memiliki akses penuh.'}
                        </p>
                    </div>

                    {/* Timeline (Only for pending) */}
                    {isPending && <StatusTimeline status="pending" />}

                    {/* Request Details Card */}
                    <div className="bg-secondary/30 rounded-xl p-6 text-left mb-8 border border-border/50">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Request Details</h4>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Building2 size={16} className="mt-1 text-primary" />
                                <div>
                                    <span className="text-xs text-muted-foreground block">Organization</span>
                                    <span className="text-sm font-medium">{request.organization_name}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Mail size={16} className="mt-1 text-primary" />
                                <div>
                                    <span className="text-xs text-muted-foreground block">Contact Email</span>
                                    <span className="text-sm font-medium">{request.contact_email}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock size={16} className="mt-1 text-primary" />
                                <div>
                                    <span className="text-xs text-muted-foreground block">Submitted At</span>
                                    <span className="text-sm font-medium">
                                        {new Date(request.created_at).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {isRejected && request.rejection_reason && (
                                <div className="mt-4 pt-4 border-t border-border/50">
                                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-3">
                                        <AlertCircle size={18} className="text-destructive shrink-0" />
                                        <div>
                                            <span className="text-xs font-bold text-destructive block uppercase mb-1">Reason for Rejection</span>
                                            <p className="text-sm text-destructive/90">{request.rejection_reason}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4">
                        {isPending && (
                            <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
                                <RefreshCcw size={16} />
                                Refresh Status
                            </Button>
                        )}

                        {isRejected && (
                            <Button onClick={onRetry} className="gap-2">
                                <ArrowRight size={16} />
                                Submit New Request
                            </Button>
                        )}

                        {isApproved && (
                            <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 gap-2">
                                Access Dashboard
                                <ArrowRight size={16} />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                    Need help? <a href="mailto:support@cerdasku.id" className="text-primary hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default AccessRequestStatus;
