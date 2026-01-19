import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import {
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Code2,
  Zap,
  Shield,
  BarChart3,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  BookOpen,
  Menu,
  X,
  Heart,
  Cpu,
  GitBranch,
  Clock
} from 'lucide-react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * @fileoverview Professional API Documentation Page
 * @description B2B API docs with sidebar navigation, refined hero, and polished UI
 */

// Swagger UI Custom Styles - Focus on Schema/Models (70%)
const swaggerStyles = `
  /* ============================================ */
  /* BASE & TYPOGRAPHY                            */
  /* ============================================ */
  .swagger-ui {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  .swagger-ui .topbar { display: none !important; }
  .swagger-ui .wrapper { padding: 0 !important; }
  
  /* ============================================ */
  /* INFO SECTION                                 */
  /* ============================================ */
  .swagger-ui .info { 
    margin: 0 !important; 
    padding: 1.5rem !important; 
    background: transparent !important; 
  }
  .swagger-ui .info .title { 
    font-size: 1.4rem !important; 
    font-weight: 700 !important; 
    color: hsl(262 40% 25%) !important; 
  }
  .swagger-ui .info hgroup.main { margin: 0 !important; }
  .swagger-ui .info .description { margin-top: 1rem !important; line-height: 1.7 !important; }
  .swagger-ui .info .description h1,
  .swagger-ui .info .description h2 { 
    color: hsl(262 40% 28%) !important; 
    font-size: 1.15rem !important; 
    margin-top: 1.5rem !important;
    font-weight: 600 !important;
  }
  .swagger-ui .info .description p { margin: 0.75rem 0 !important; }
  .swagger-ui .info .description table { 
    border-collapse: collapse !important; 
    margin: 1rem 0 !important; 
    width: 100% !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  .swagger-ui .info .description table th,
  .swagger-ui .info .description table td { 
    border: 1px solid hsl(262 20% 88%) !important; 
    padding: 0.6rem 0.9rem !important; 
    text-align: left !important;
    font-size: 0.85rem !important;
  }
  .swagger-ui .info .description table th { 
    background: hsl(262 30% 96%) !important; 
    font-weight: 600 !important;
    color: hsl(262 40% 30%) !important;
  }
  
  /* ============================================ */
  /* OPERATION TAGS & BLOCKS                      */
  /* ============================================ */
  .swagger-ui .opblock-tag-section { margin-top: 0.5rem !important; }
  .swagger-ui .opblock-tag { 
    font-size: 1rem !important; 
    font-weight: 600 !important; 
    color: hsl(262 40% 25%) !important; 
    border-bottom: 1px solid hsl(262 25% 90%) !important; 
    padding: 0.9rem 0 !important;
    margin: 0 !important;
  }
  .swagger-ui .opblock-tag:hover { background: hsl(262 30% 98%) !important; }
  .swagger-ui .opblock-tag small { font-size: 0.8rem !important; color: hsl(262 20% 55%) !important; }
  
  .swagger-ui .opblock { 
    border-radius: 10px !important; 
    border: 1px solid hsl(262 20% 88%) !important; 
    margin: 0.6rem 0 !important; 
    overflow: hidden !important; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important; 
  }
  .swagger-ui .opblock .opblock-summary { padding: 12px 14px !important; }
  .swagger-ui .opblock.opblock-get { 
    background: linear-gradient(135deg, hsl(262 35% 98%) 0%, hsl(262 25% 99%) 100%) !important; 
    border-color: hsl(262 35% 82%) !important; 
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method { 
    background: hsl(262 45% 48%) !important; 
    border-radius: 5px !important; 
    font-weight: 600 !important; 
    font-size: 0.7rem !important;
    padding: 6px 10px !important;
  }
  .swagger-ui .opblock.opblock-post { 
    background: linear-gradient(135deg, hsl(150 35% 97%) 0%, hsl(150 25% 99%) 100%) !important; 
    border-color: hsl(150 45% 72%) !important; 
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method { 
    background: hsl(150 55% 40%) !important; 
    border-radius: 5px !important; 
    font-weight: 600 !important;
    font-size: 0.7rem !important;
    padding: 6px 10px !important;
  }
  .swagger-ui .opblock .opblock-summary-path { 
    font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace !important; 
    font-size: 0.85rem !important; 
    font-weight: 500 !important; 
  }
  .swagger-ui .opblock .opblock-summary-description { 
    font-size: 0.8rem !important; 
    color: hsl(262 15% 50%) !important; 
  }
  
  /* ============================================ */
  /* BUTTONS                                      */
  /* ============================================ */
  .swagger-ui .btn { 
    border-radius: 6px !important; 
    font-weight: 500 !important; 
    font-size: 0.8rem !important;
    transition: all 0.15s ease !important; 
  }
  .swagger-ui .btn.execute { 
    background: hsl(262 45% 48%) !important; 
    border: none !important;
    padding: 8px 16px !important;
  }
  .swagger-ui .btn.execute:hover { background: hsl(262 45% 40%) !important; }
  .swagger-ui .btn.cancel { border-radius: 6px !important; }
  .swagger-ui .btn.authorize { 
    color: hsl(262 45% 48%) !important; 
    border: 1.5px solid hsl(262 45% 48%) !important; 
    background: transparent !important; 
    padding: 6px 12px !important;
  }
  .swagger-ui .btn.authorize:hover { 
    background: hsl(262 45% 48%) !important; 
    color: white !important; 
  }
  .swagger-ui .btn.authorize svg { fill: currentColor !important; }
  .swagger-ui .try-out__btn { 
    border-radius: 6px !important; 
    font-size: 0.75rem !important;
    padding: 4px 10px !important;
  }
  
  /* ============================================ */
  /* AUTHORIZATION SCHEME                         */
  /* ============================================ */
  .swagger-ui .scheme-container { 
    background: hsl(262 28% 97%) !important; 
    border: 1px solid hsl(262 20% 90%) !important; 
    border-radius: 10px !important; 
    box-shadow: none !important; 
    padding: 1rem 1.25rem !important;
    margin: 0 !important;
  }
  .swagger-ui .scheme-container .schemes > label { font-size: 0.85rem !important; }
  
  /* ============================================ */
  /* PARAMETERS TABLE                             */
  /* ============================================ */
  .swagger-ui .parameters-container { padding: 1rem !important; }
  .swagger-ui .opblock-section-header { 
    background: hsl(262 25% 97%) !important; 
    padding: 0.6rem 1rem !important;
    border-radius: 6px 6px 0 0 !important;
  }
  .swagger-ui .opblock-section-header h4 { 
    font-size: 0.85rem !important; 
    font-weight: 600 !important;
    color: hsl(262 35% 35%) !important;
  }
  .swagger-ui table.parameters { border-collapse: separate !important; border-spacing: 0 !important; }
  .swagger-ui table.parameters > tbody > tr > td { 
    padding: 10px 12px !important; 
    vertical-align: top !important;
    border-bottom: 1px solid hsl(262 15% 92%) !important;
  }
  .swagger-ui table.parameters > tbody > tr:last-child > td { border-bottom: none !important; }
  .swagger-ui .parameter__name { 
    font-family: 'JetBrains Mono', monospace !important; 
    font-weight: 600 !important; 
    font-size: 0.8rem !important;
    color: hsl(262 45% 35%) !important; 
  }
  .swagger-ui .parameter__name.required::after { 
    color: hsl(0 70% 50%) !important;
    font-size: 0.85rem !important;
  }
  .swagger-ui .parameter__type { 
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.75rem !important;
    color: hsl(262 25% 55%) !important;
    background: hsl(262 25% 95%) !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
  }
  .swagger-ui .parameter__in { 
    font-size: 0.7rem !important;
    color: hsl(262 20% 60%) !important;
    font-style: italic !important;
  }
  .swagger-ui .parameters-col_description { width: 55% !important; }
  .swagger-ui .parameters-col_description p { 
    font-size: 0.8rem !important;
    line-height: 1.5 !important;
    color: hsl(262 15% 40%) !important;
  }
  
  /* ============================================ */
  /* REQUEST BODY                                 */
  /* ============================================ */
  .swagger-ui .opblock-body { padding: 0 !important; }
  .swagger-ui .opblock-description-wrapper { padding: 1rem !important; }
  .swagger-ui .opblock-description-wrapper p { 
    font-size: 0.85rem !important; 
    line-height: 1.6 !important;
  }
  .swagger-ui .body-param__text { 
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.8rem !important;
    border-radius: 6px !important;
    border: 1px solid hsl(262 20% 88%) !important;
  }
  
  /* ============================================ */
  /* MODELS / SCHEMA SECTION (70% FOCUS)          */
  /* ============================================ */
  .swagger-ui section.models { 
    border: 1px solid hsl(262 20% 88%) !important; 
    border-radius: 10px !important; 
    overflow: hidden !important;
    margin-top: 1rem !important;
  }
  .swagger-ui section.models h4 { 
    background: linear-gradient(135deg, hsl(262 28% 96%) 0%, hsl(262 22% 98%) 100%) !important; 
    color: hsl(262 40% 28%) !important; 
    padding: 0.9rem 1.2rem !important; 
    margin: 0 !important; 
    font-weight: 600 !important;
    font-size: 0.95rem !important;
    border-bottom: 1px solid hsl(262 20% 90%) !important;
  }
  .swagger-ui section.models h4 svg { fill: hsl(262 40% 50%) !important; }
  .swagger-ui section.models .model-container { 
    margin: 0 !important;
    background: white !important;
  }
  
  /* Model Box */
  .swagger-ui .model-box { 
    padding: 0 !important;
    background: transparent !important;
  }
  .swagger-ui .models-control { padding: 0.5rem 1rem !important; }
  
  /* Model Title */
  .swagger-ui section.models .model-box .model-title { 
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    color: hsl(262 45% 40%) !important;
    background: hsl(262 30% 97%) !important;
    padding: 0.7rem 1rem !important;
    border-bottom: 1px solid hsl(262 20% 92%) !important;
  }
  
  /* Model Toggle */
  .swagger-ui .model-toggle { 
    margin-right: 8px !important;
  }
  .swagger-ui .model-toggle::after { 
    background: hsl(262 40% 50%) !important;
  }
  
  /* Inner Model / Properties */
  .swagger-ui .model { 
    font-size: 0.8rem !important;
    color: hsl(262 20% 35%) !important;
  }
  .swagger-ui .model-title { 
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 600 !important;
  }
  
  /* Property Rows */
  .swagger-ui table.model tbody tr { 
    border-bottom: 1px solid hsl(262 15% 94%) !important;
  }
  .swagger-ui table.model tbody tr:last-child { border-bottom: none !important; }
  .swagger-ui table.model tbody tr td { 
    padding: 8px 12px !important;
    vertical-align: top !important;
  }
  .swagger-ui table.model tbody tr td:first-child { 
    width: 180px !important;
    min-width: 180px !important;
  }
  
  /* Property Name */
  .swagger-ui .model .property.primitive { 
    color: hsl(262 45% 40%) !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 600 !important;
    font-size: 0.8rem !important;
  }
  
  /* Property Type Badge */
  .swagger-ui .prop-type { 
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.7rem !important;
    color: hsl(200 65% 45%) !important;
    background: hsl(200 50% 95%) !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
  }
  
  /* Property Format */
  .swagger-ui .prop-format { 
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.65rem !important;
    color: hsl(280 50% 55%) !important;
    background: hsl(280 40% 95%) !important;
    padding: 1px 5px !important;
    border-radius: 3px !important;
    margin-left: 4px !important;
  }
  
  /* Enum Values */
  .swagger-ui .model .property-row .renderedMarkdown p { 
    font-size: 0.78rem !important;
    color: hsl(262 15% 45%) !important;
    line-height: 1.5 !important;
    margin: 4px 0 !important;
  }
  
  /* Required Star */
  .swagger-ui span.model-title__required { 
    color: hsl(0 70% 50%) !important;
    font-size: 0.85rem !important;
  }
  
  /* Expand Arrow */
  .swagger-ui .model-box-control .model-box-control:focus,
  .swagger-ui .models-control .models-control:focus { outline: none !important; }
  
  /* Array Brackets */
  .swagger-ui .model .brace-open, 
  .swagger-ui .model .brace-close { 
    color: hsl(262 30% 60%) !important;
    font-weight: 400 !important;
  }
  
  /* Inner Model Wrapper */
  .swagger-ui .inner-object { 
    padding-left: 1rem !important;
    border-left: 2px solid hsl(262 25% 90%) !important;
    margin-left: 0.5rem !important;
  }
  
  /* Model Example */
  .swagger-ui .model-example { 
    padding: 1rem !important;
  }
  
  /* Property Description */
  .swagger-ui table.model .property-row td:last-child { 
    font-size: 0.78rem !important;
    color: hsl(262 15% 50%) !important;
    line-height: 1.5 !important;
  }
  
  /* ============================================ */
  /* RESPONSES SECTION                            */
  /* ============================================ */
  .swagger-ui .responses-wrapper { padding: 0 !important; }
  .swagger-ui .responses-inner { padding: 1rem !important; }
  .swagger-ui .response { border-radius: 8px !important; margin: 0.5rem 0 !important; }
  .swagger-ui .response-col_status { 
    font-weight: 600 !important;
    font-size: 0.85rem !important;
    padding: 0.5rem 0.75rem !important;
    border-radius: 5px !important;
  }
  .swagger-ui .response-col_status .response-undocumented { font-size: 0.75rem !important; }
  .swagger-ui .response-col_description { padding: 0.5rem !important; }
  .swagger-ui .response-col_description__inner { padding: 0.5rem !important; }
  
  /* Response Headers */
  .swagger-ui .response-headers { 
    font-size: 0.8rem !important;
  }
  .swagger-ui .response-headers td { padding: 6px 10px !important; }
  
  /* ============================================ */
  /* CODE BLOCKS & EXAMPLES                       */
  /* ============================================ */
  .swagger-ui .opblock-body pre.microlight,
  .swagger-ui .highlight-code > .microlight { 
    background: hsl(262 15% 10%) !important; 
    border-radius: 8px !important; 
    font-family: 'JetBrains Mono', 'Fira Code', monospace !important; 
    font-size: 0.78rem !important;
    padding: 1rem !important;
    line-height: 1.5 !important;
  }
  .swagger-ui .highlight-code { border-radius: 8px !important; overflow: hidden !important; }
  .swagger-ui .example { margin: 0.5rem 0 !important; }
  
  /* Example Select */
  .swagger-ui .examples-select { 
    border-radius: 5px !important;
    font-size: 0.8rem !important;
    border-color: hsl(262 20% 85%) !important;
    padding: 4px 8px !important;
  }
  .swagger-ui .examples-select-element { font-size: 0.8rem !important; }
  
  /* Copy Button */
  .swagger-ui .copy-to-clipboard { 
    right: 8px !important;
    top: 8px !important;
    background: hsl(262 30% 25%) !important;
    border-radius: 4px !important;
    width: 24px !important;
    height: 24px !important;
  }
  .swagger-ui .copy-to-clipboard button { padding: 4px !important; }
  
  /* ============================================ */
  /* MISC POLISH                                  */
  /* ============================================ */
  .swagger-ui select { border-radius: 5px !important; font-size: 0.85rem !important; }
  .swagger-ui input[type=text] { border-radius: 5px !important; font-size: 0.85rem !important; }
  .swagger-ui textarea { border-radius: 6px !important; font-size: 0.85rem !important; }
  .swagger-ui .loading-container { padding: 2rem !important; }
  .swagger-ui .loading-container .loading::before { border-color: hsl(262 40% 50%) !important; }
  
  /* Markdown in descriptions */
  .swagger-ui .markdown p { margin: 0.5rem 0 !important; }
  .swagger-ui .markdown code { 
    background: hsl(262 25% 94%) !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.8rem !important;
    color: hsl(262 45% 40%) !important;
  }
  .swagger-ui .markdown ul, .swagger-ui .markdown ol { 
    padding-left: 1.25rem !important;
    margin: 0.5rem 0 !important;
  }
  .swagger-ui .markdown li { margin: 0.25rem 0 !important; font-size: 0.85rem !important; }
`;

// Navigation items
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'quick-start', label: 'Quick Start', icon: Zap },
  { id: 'authentication', label: 'Authentication', icon: Shield },
  { id: 'rate-limits', label: 'Rate Limits', icon: Clock },
  { id: 'endpoints', label: 'Endpoints', icon: GitBranch },
];

// Quick start code
const QUICK_START_CODE = `const axios = require('axios');

const API_KEY = 'ck_live_your_api_key_here';
const BASE_URL = 'https://cerdasku-api.my.id/api/v1';

// Predict learning pattern
async function predictPattern(features) {
  const { data } = await axios.post(\`\${BASE_URL}/predict\`, {
    features,
    student_external_id: 'STU-001'
  }, {
    headers: { 'X-API-Key': API_KEY }
  });
  
  return data.data.learning_pattern;
}

// Example: [materi/sesi, materi/jam, freq/minggu, ...]
predictPattern([2, 3, 4, 2, 3, 2, 3, 4, 2])
  .then(pattern => console.log('Pattern:', pattern));`;

const ApiDocsPage = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionRefs = useRef({});

  useEffect(() => {
    const styleId = 'cerdasku-swagger-pro';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = swaggerStyles;
      document.head.appendChild(style);
    }
    document.title = 'API Documentation - CerdasKu AI';
    return () => {
      const s = document.getElementById(styleId);
      if (s) s.remove();
    };
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const item of NAV_ITEMS) {
        const el = sectionRefs.current[item.id];
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(QUICK_START_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Precise 14px height, balanced spacing */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-md border-b border-border/40">
        <div className="h-full max-w-[calc(100%-2rem)] lg:max-w-none mx-auto px-4 lg:px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 hover:bg-muted rounded-md transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline text-[13px]">Home</span>
            </Link>

            <div className="hidden sm:block h-4 w-px bg-border/60" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Code2 size={14} className="text-primary-foreground" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-[13px]">CerdasKu API</span>
                <span className="hidden sm:inline text-[11px] text-muted-foreground">v2.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${apiBaseUrl}/docs/openapi.yaml`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-muted-foreground hover:text-foreground border border-border/60 rounded-md hover:border-primary/40 transition-all"
            >
              <ExternalLink size={13} />
              OpenAPI
            </a>
            <Link
              to="/auth/register"
              className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-md text-[13px] font-medium hover:bg-primary/90 transition-colors"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar - 56px from top (h-14), 240px wide, consistent spacing */}
      <aside className={`fixed top-14 left-0 z-40 w-60 h-[calc(100vh-3.5rem)] bg-background border-r border-border/40 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto py-5 px-3">
          <div className="mb-5">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-2.5">
              Documentation
            </p>
            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                  >
                    <Icon size={15} className={isActive ? 'text-primary' : 'opacity-70'} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="mt-auto pt-5 border-t border-border/40">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-[13px] font-medium mb-0.5">Need help?</p>
              <p className="text-[11px] text-muted-foreground mb-2.5">Contact our developer support.</p>
              <a
                href="mailto:api-support@cerdasku.ai"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                api-support@cerdasku.ai
                <ChevronRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - ml-60 matches sidebar w-60, pt-14 matches nav h-14 */}
      <main className="lg:ml-60 pt-14">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-10">

          {/* Section: Overview - Consistent spacing */}
          <section
            id="overview"
            ref={el => sectionRefs.current['overview'] = el}
            className="mb-14"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold uppercase tracking-wide mb-3">
                <Cpu size={12} />
                B2B Integration API
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                CerdasKu AI API
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                Integrasikan learning pattern prediction ke platform edukasi Anda.
                Dapatkan insight pembelajaran untuk siswa dalam hitungan milidetik.
              </p>
            </div>

            {/* Feature Grid - Equal spacing, symmetrical */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Zap, title: 'Fast', desc: '< 100ms', color: 'text-amber-500' },
                { icon: Shield, title: 'Secure', desc: 'API key', color: 'text-green-500' },
                { icon: BarChart3, title: 'Analytics', desc: 'Real-time', color: 'text-blue-500' },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/40">
                  <f.icon size={18} className={f.color} />
                  <div>
                    <p className="font-medium text-[13px]">{f.title}</p>
                    <p className="text-[11px] text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Quick Start */}
          <section
            id="quick-start"
            ref={el => sectionRefs.current['quick-start'] = el}
            className="mb-14"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Terminal size={18} className="text-primary" />
              Quick Start
            </h2>
            <p className="text-[14px] text-muted-foreground mb-5">
              Mulai integrasi dalam beberapa menit. Install axios dan gunakan kode berikut:
            </p>

            <div className="rounded-lg overflow-hidden border border-border/40 shadow-md">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-gray-400 text-[11px] font-mono">example.js</span>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                >
                  {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 bg-gray-950 overflow-x-auto">
                <code className="text-[13px] font-mono text-gray-300 leading-relaxed whitespace-pre">
                  {QUICK_START_CODE}
                </code>
              </pre>
            </div>
          </section>

          {/* Section: Authentication */}
          <section
            id="authentication"
            ref={el => sectionRefs.current['authentication'] = el}
            className="mb-14"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              Authentication
            </h2>
            <p className="text-[14px] text-muted-foreground mb-5">
              Semua request ke API harus menyertakan API key di header.
            </p>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/40 mb-4">
              <p className="text-[13px] font-medium mb-2">Header Format:</p>
              <code className="block p-2.5 rounded-md bg-gray-900 text-gray-300 text-[13px] font-mono">
                X-API-Key: ck_live_xxxxxxxxxxxxxxxx
              </code>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border border-border/40">
                <p className="font-medium text-[13px] mb-0.5">Production Keys</p>
                <p className="text-[11px] text-muted-foreground">Prefix: <code className="text-primary">ck_live_</code></p>
              </div>
              <div className="p-3.5 rounded-lg border border-border/40">
                <p className="font-medium text-[13px] mb-0.5">Sandbox Keys</p>
                <p className="text-[11px] text-muted-foreground">Prefix: <code className="text-primary">ck_sandbox_</code></p>
              </div>
            </div>
          </section>

          {/* Section: Rate Limits */}
          <section
            id="rate-limits"
            ref={el => sectionRefs.current['rate-limits'] = el}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock size={22} className="text-primary" />
              Rate Limits
            </h2>
            <p className="text-muted-foreground mb-6">
              Rate limit diterapkan berdasarkan tier subscription Anda.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Tier</th>
                    <th className="text-left py-3 px-4 font-semibold">Requests/Minute</th>
                    <th className="text-left py-3 px-4 font-semibold">Monthly Quota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-3 px-4">Sandbox</td><td className="py-3 px-4">100</td><td className="py-3 px-4">10,000</td></tr>
                  <tr><td className="py-3 px-4">Starter</td><td className="py-3 px-4">500</td><td className="py-3 px-4">100,000</td></tr>
                  <tr><td className="py-3 px-4">Professional</td><td className="py-3 px-4">2,000</td><td className="py-3 px-4">500,000</td></tr>
                  <tr><td className="py-3 px-4">Enterprise</td><td className="py-3 px-4">Custom</td><td className="py-3 px-4">Unlimited</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Endpoints */}
          <section
            id="endpoints"
            ref={el => sectionRefs.current['endpoints'] = el}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <GitBranch size={22} className="text-primary" />
              API Endpoints
            </h2>
            <p className="text-muted-foreground mb-6">
              Dokumentasi lengkap untuk semua endpoint yang tersedia.
            </p>

            <div className="rounded-xl border border-border/50 overflow-hidden">
              <SwaggerUI
                url={`${apiBaseUrl}/docs/openapi.json`}
                docExpansion="list"
                filter={false}
                persistAuthorization={true}
                tryItOutEnabled={true}
                defaultModelsExpandDepth={0}
              />
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles size={16} className="text-primary" />
                <span>CerdasKu AI</span>
                <span>•</span>
                <span>B2B API v2.0</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <a href="mailto:api-support@cerdasku.ai" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ApiDocsPage;
