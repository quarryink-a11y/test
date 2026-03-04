import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/components/shared/AuthContext';
import { Globe, ExternalLink, Copy, CheckCircle2, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SiteLiveCard() {
  const { user, refreshUser } = useAuth();
  const [publishing, setPublishing] = useState(false);

  const { data: contacts = [] } = useQuery({
    queryKey: ['contact-info', user?.email],
    queryFn: () => base44.entities.ContactInfo.filter({ created_by: user.email }, '-created_date', 1),
    enabled: !!user?.email,
  });

  const artistName = contacts[0]?.artist_full_name || '';
  const generatedSlug = artistName ? artistName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 40) : '';
  const slug = generatedSlug || user?.site_slug || '';
  const isPublished = user?.site_published === true;
  const siteUrl = slug ? `https://quarry.ink/${slug}` : '';

  const handlePublish = async () => {
    if (!slug) {
      toast.error('Please fill in your Artist full name in Settings → Contacts first.');
      return;
    }
    setPublishing(true);
    await base44.auth.updateMe({
      site_slug: slug,
      site_published: true,
      site_published_date: new Date().toISOString(),
    });
    await refreshUser();
    setPublishing(false);
    toast.success('Your site has been published!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success('Link copied!');
  };

  return (
    <div className={`rounded-2xl p-5 mb-6 ${isPublished ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPublished ? 'bg-green-100' : 'bg-blue-100'}`}>
          <Globe className={`w-5 h-5 ${isPublished ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {isPublished ? 'Your site is live!' : 'Your site is ready to publish'}
            </h3>
            {isPublished && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {isPublished
              ? 'Your website is live. Share the link with clients.'
              : 'Fill in your content, then hit Publish to go live.'}
          </p>

          {slug ? (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate">
                {siteUrl}
              </div>
              {isPublished && (
                <>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="border-green-200 text-green-700 hover:bg-green-50 gap-1.5">
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </Button>
                  </a>
                </>
              )}

              <Button
                size="sm"
                onClick={handlePublish}
                disabled={publishing}
                className={`gap-1.5 ${isPublished ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {publishing ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...</>
                ) : isPublished ? (
                  <><Rocket className="w-3.5 h-3.5" /> Update</>
                ) : (
                  <><Rocket className="w-3.5 h-3.5" /> Publish</>
                )}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Set your Artist full name in Settings → Contacts first to get your free quarry.ink domain.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}