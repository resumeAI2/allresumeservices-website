import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';

export default function SeoSetup() {
  const [copied, setCopied] = useState(false);
  const sitemapUrl = `${window.location.origin}/sitemap.xml`;
  const robotsUrl = `${window.location.origin}/robots.txt`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SEO & Search Console Setup
            </h1>
            <p className="text-lg text-muted-foreground">
              Get your website indexed by Google and improve your search rankings
            </p>
          </div>

          {/* Sitemap Section */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">XML Sitemap</h2>
                <p className="text-muted-foreground mb-4">
                  Your sitemap has been automatically generated and is ready to submit to search engines.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm">{sitemapUrl}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sitemapUrl)}
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">
                    View Sitemap <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Robots.txt Section */}
          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Robots.txt</h2>
                <p className="text-muted-foreground mb-4">
                  Your robots.txt file tells search engines which pages to crawl.
                </p>
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <code className="text-sm">{robotsUrl}</code>
                </div>
                <Button asChild variant="outline">
                  <a href={robotsUrl} target="_blank" rel="noopener noreferrer">
                    View Robots.txt <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>

          {/* Google Search Console Setup */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Google Search Console Setup</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Go to Google Search Console</h3>
                  <p className="text-muted-foreground mb-3">
                    Visit Google Search Console and sign in with your Google account.
                  </p>
                  <Button asChild>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                      Open Search Console <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Add Your Property</h3>
                  <p className="text-muted-foreground">
                    Click "Add Property" and enter your website URL: <code className="bg-slate-100 px-2 py-1 rounded">{window.location.origin}</code>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verify Ownership</h3>
                  <p className="text-muted-foreground">
                    Choose a verification method (HTML tag, DNS, or Google Analytics) and follow the instructions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Submit Your Sitemap</h3>
                  <p className="text-muted-foreground mb-3">
                    Once verified, go to "Sitemaps" in the left menu and submit:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <code className="text-sm">{sitemapUrl}</code>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Monitor Your Performance</h3>
                  <p className="text-muted-foreground">
                    Check back regularly to see how your pages are performing in search results, fix any errors, and optimise your content.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Resources */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Additional SEO Resources</h2>
            <div className="space-y-3">
              <a
                href="https://developers.google.com/search/docs/beginner/seo-starter-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
                Google SEO Starter Guide
              </a>
              <a
                href="https://search.google.com/search-console/welcome"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
                Google Search Console Help
              </a>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ExternalLink className="w-4 h-4" />
                Google Analytics
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
