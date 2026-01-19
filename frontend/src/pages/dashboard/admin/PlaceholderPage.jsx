import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const PlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-6">
                <Construction className="text-muted-foreground/50 w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground max-w-sm">
                Modul ini sedang dalam pengembangan akan segera tersedia untuk manajemen {title ? title.toLowerCase() : 'sistem'}.
            </p>
        </div>
    );
};

export default PlaceholderPage;
