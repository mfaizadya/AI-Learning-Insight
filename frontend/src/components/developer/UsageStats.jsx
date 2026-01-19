import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    BarChart3,
    TrendingUp,
    Activity,
    Zap,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

/**
 * @fileoverview Premium Usage Statistics Component
 * @description Displays API usage with beautiful charts and modern design
 */

const generateMockDailyData = () => {
    const data = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            requests: Math.floor(Math.random() * 150) + 50 + (30 - i) * 2,
            tokens: Math.floor(Math.random() * 500) + 100,
        });
    }

    return data;
};

const MOCK_ENDPOINT_DATA = [
    { endpoint: '/v1/predict', requests: 1234, percentage: 78, color: 'from-primary to-accent' },
    { endpoint: '/v1/health', requests: 234, percentage: 15, color: 'from-green-400 to-emerald-500' },
    { endpoint: '/v1/usage', requests: 112, percentage: 7, color: 'from-amber-400 to-orange-500' },
];

const MOCK_RATE_LIMIT = {
    limit: 2000,
    remaining: 1915,
    resetAt: new Date(Date.now() + 45000).toISOString(),
};

const StatCard = ({ icon: Icon, label, value, subValue, trend, trendUp, gradient }) => (
    <Card className="border-border/50 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
        <CardContent className="p-5">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
                    <div className="flex items-center gap-2">
                        {trend && (
                            <span className={`flex items-center gap-0.5 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'
                                }`}>
                                {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {trend}
                            </span>
                        )}
                        <span className="text-xs text-muted-foreground">{subValue}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const UsageStats = () => {
    const [dailyData, setDailyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setDailyData(generateMockDailyData());
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalRequests = dailyData.reduce((sum, d) => sum + d.requests, 0);
    const totalTokens = dailyData.reduce((sum, d) => sum + d.tokens, 0);
    const avgDailyRequests = Math.round(totalRequests / 30);
    const rateLimitPercentage = Math.round((MOCK_RATE_LIMIT.remaining / MOCK_RATE_LIMIT.limit) * 100);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-border/50 shadow-lg">
                        <CardContent className="py-8">
                            <div className="animate-pulse space-y-3">
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                <div className="h-8 bg-muted rounded w-3/4"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={BarChart3}
                    label="Total Requests"
                    value={totalRequests.toLocaleString()}
                    subValue="Last 30 days"
                    trend="+12.5%"
                    trendUp={true}
                    gradient="from-primary to-accent"
                />
                <StatCard
                    icon={Zap}
                    label="Tokens Used"
                    value={totalTokens.toLocaleString()}
                    subValue="Billing units"
                    trend="+8.2%"
                    trendUp={true}
                    gradient="from-green-500 to-emerald-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Avg Daily"
                    value={avgDailyRequests.toString()}
                    subValue="Requests/day"
                    trend="+5.1%"
                    trendUp={true}
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    icon={Activity}
                    label="Rate Limit"
                    value={`${rateLimitPercentage}%`}
                    subValue={`${MOCK_RATE_LIMIT.remaining}/${MOCK_RATE_LIMIT.limit} remaining`}
                    gradient="from-amber-500 to-orange-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Main Chart - 3 columns */}
                <Card className="lg:col-span-3 border-border/50 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-secondary/30 to-background border-b border-border/50 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp size={18} className="text-primary" />
                                    Request Trend
                                </CardTitle>
                                <CardDescription>Daily API requests over time</CardDescription>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1.5">
                                <Calendar size={12} />
                                30 days
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData}>
                                    <defs>
                                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(262 40% 42%)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(262 40% 42%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                        tickLine={false}
                                        axisLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={40}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }}
                                        labelStyle={{ fontWeight: 600 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="hsl(262 40% 42%)"
                                        strokeWidth={2.5}
                                        fill="url(#colorRequests)"
                                        dot={false}
                                        activeDot={{ r: 5, fill: 'hsl(262 40% 42%)', strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Endpoint Breakdown - 2 columns */}
                <Card className="lg:col-span-2 border-border/50 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-secondary/30 to-background border-b border-border/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 size={18} className="text-primary" />
                            By Endpoint
                        </CardTitle>
                        <CardDescription>Request distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5">
                        {MOCK_ENDPOINT_DATA.map((item, index) => (
                            <div key={item.endpoint} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <code className="text-muted-foreground bg-muted px-2 py-1 rounded text-xs font-medium">
                                        {item.endpoint}
                                    </code>
                                    <span className="font-semibold">{item.requests.toLocaleString()}</span>
                                </div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total this period</span>
                                <span className="font-bold text-lg">
                                    {MOCK_ENDPOINT_DATA.reduce((sum, e) => sum + e.requests, 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rate Limit Status */}
            <Card className="border-border/50 shadow-lg overflow-hidden">
                <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Rate Limit Status</p>
                                <p className="text-sm text-muted-foreground">
                                    {MOCK_RATE_LIMIT.remaining} of {MOCK_RATE_LIMIT.limit} requests remaining this minute
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                    style={{ width: `${rateLimitPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5">Resets in ~45s</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UsageStats;
