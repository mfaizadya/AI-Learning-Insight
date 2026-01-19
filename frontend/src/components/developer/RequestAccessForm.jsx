import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Key, Send, CheckCircle, Loader2, Building2, Mail, BarChart, AlertCircle } from 'lucide-react';
import axios from 'axios';

/**
 * @fileoverview Request API Access Form
 * @description Form for users to request B2B API access from admin
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const USE_CASES = [
    { value: 'lms_integration', label: 'LMS Integration' },
    { value: 'research', label: 'Research / Academic' },
    { value: 'EdTech', label: 'EdTech Platform' },
    { value: 'corporate_training', label: 'Corporate Training' },
    { value: 'other', label: 'Other' },
];

const REQUEST_VOLUME = [
    { value: '1000', label: 'Up to 1,000 requests/month' },
    { value: '10000', label: '1,000 - 10,000 requests/month' },
    { value: '50000', label: '10,000 - 50,000 requests/month' },
    { value: '100000', label: '50,000+ requests/month' },
];

const RequestAccessForm = () => {
    const [formData, setFormData] = useState({
        organizationName: '',
        useCase: '',
        expectedRequests: '',
        description: '',
        contactEmail: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Anda harus login terlebih dahulu');
            }

            const response = await axios.post(
                `${API_BASE_URL}/api-access/request`,
                {
                    organizationName: formData.organizationName,
                    contactEmail: formData.contactEmail,
                    useCase: formData.useCase,
                    expectedRequests: formData.expectedRequests,
                    description: formData.description || null
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setIsSubmitted(true);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Terjadi kesalahan. Silakan coba lagi.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.organizationName.trim() !== '' &&
        formData.useCase !== '' &&
        formData.expectedRequests !== '' &&
        formData.contactEmail.trim() !== '';

    if (isSubmitted) {
        return (
            <Card className="border-border">
                <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Request Submitted!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Terima kasih! Permintaan akses API Anda telah diterima.
                        Tim kami akan meninjau dan menghubungi Anda dalam 1-2 hari kerja.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Submit Another Request
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Key size={24} className="text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Request API Access</CardTitle>
                        <CardDescription>
                            Isi form berikut untuk mengajukan akses ke B2B API CerdasKu.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                        <AlertCircle size={18} className="text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-destructive">Gagal mengirim request</p>
                            <p className="text-sm text-destructive/80">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Organization Name */}
                    <div className="space-y-2">
                        <Label htmlFor="organizationName" className="flex items-center gap-2">
                            <Building2 size={14} />
                            Nama Organisasi / Perusahaan
                        </Label>
                        <Input
                            id="organizationName"
                            placeholder="PT. Contoh Edukasi Indonesia"
                            value={formData.organizationName}
                            onChange={(e) => handleChange('organizationName', e.target.value)}
                            required
                        />
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="flex items-center gap-2">
                            <Mail size={14} />
                            Email Kontak
                        </Label>
                        <Input
                            id="contactEmail"
                            type="email"
                            placeholder="developer@company.com"
                            value={formData.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            required
                        />
                    </div>

                    {/* Use Case */}
                    <div className="space-y-2">
                        <Label htmlFor="useCase">Use Case</Label>
                        <Select
                            value={formData.useCase}
                            onValueChange={(value) => handleChange('useCase', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih jenis penggunaan" />
                            </SelectTrigger>
                            <SelectContent>
                                {USE_CASES.map((useCase) => (
                                    <SelectItem key={useCase.value} value={useCase.value}>
                                        {useCase.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Expected Requests */}
                    <div className="space-y-2">
                        <Label htmlFor="expectedRequests" className="flex items-center gap-2">
                            <BarChart size={14} />
                            Perkiraan Volume Requests
                        </Label>
                        <Select
                            value={formData.expectedRequests}
                            onValueChange={(value) => handleChange('expectedRequests', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih perkiraan volume" />
                            </SelectTrigger>
                            <SelectContent>
                                {REQUEST_VOLUME.map((volume) => (
                                    <SelectItem key={volume.value} value={volume.value}>
                                        {volume.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Deskripsi Penggunaan (Opsional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Jelaskan bagaimana Anda berencana menggunakan CerdasKu AI API..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h4 className="font-medium text-foreground mb-2">Apa yang Anda dapatkan?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• API Key untuk akses produksi</li>
                            <li>• Rate limit sesuai tier (Sandbox: 100 req/min)</li>
                            <li>• Akses ke endpoint /v1/predict dan /v1/usage</li>
                            <li>• Dashboard monitoring dan statistik</li>
                        </ul>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={16} className="mr-2" />
                                Submit Request
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default RequestAccessForm;
