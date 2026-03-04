import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Dynamically import PublicSite to avoid circular deps
import PublicSite from '@/pages/PublicSite';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1); // e.g. "ruslanbobryka"
    const [checking, setChecking] = useState(true);
    const [isPublicSite, setIsPublicSite] = useState(false);

    // Check if this path could be a site slug (simple alphanumeric + hyphens, no slashes)
    const couldBeSlug = /^[a-zA-Z0-9_-]+$/.test(pageName) && pageName.length > 0;

    useEffect(() => {
        if (!couldBeSlug) {
            setChecking(false);
            return;
        }
        // Try to load the public site with this slug
        fetch('/functions/getPublicSite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: pageName }),
        })
            .then(r => r.json())
            .then(data => {
                if (data.error) {
                    setIsPublicSite(false);
                } else {
                    setIsPublicSite(true);
                }
                setChecking(false);
            })
            .catch(() => {
                setChecking(false);
            });
    }, [pageName, couldBeSlug]);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });

    // Loading while checking if it's a public site
    if (checking) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            </div>
        );
    }

    // If it's a valid public site slug, render PublicSite
    if (isPublicSite) {
        return <PublicSite />;
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-slate-300">404</h1>
                        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
                    </div>
                    
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-slate-800">
                            Page Not Found
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-slate-700">Admin Note</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}