import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";

export default function FaqAnalytics() {
  const { data: topSearches, isLoading: loadingTop } = trpc.faq.getTopSearches.useQuery({ limit: 20 });
  const { data: noResultSearches, isLoading: loadingNoResults } = trpc.faq.getNoResultSearches.useQuery();
  const { data: recentSearches, isLoading: loadingRecent } = trpc.faq.getSearchAnalytics.useQuery({ limit: 50 });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">FAQ Search Analytics</h1>
          <p className="text-muted-foreground">
            Track what users are searching for to identify popular topics and content gaps
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Searches</p>
                <p className="text-2xl font-bold">{recentSearches?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique Queries</p>
                <p className="text-2xl font-bold">{topSearches?.length || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No Results</p>
                <p className="text-2xl font-bold">{noResultSearches?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Searches */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Top Search Queries</h2>
            </div>
            
            {loadingTop ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : topSearches && topSearches.length > 0 ? (
              <div className="space-y-3">
                {topSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{search.query}</p>
                      <p className="text-sm text-muted-foreground">
                        Avg {Math.round(search.avgResults)} results · Last: {formatDate(search.lastSearched)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{search.count}</p>
                      <p className="text-xs text-muted-foreground">searches</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No search data yet
              </div>
            )}
          </Card>

          {/* No Results - Content Gaps */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Searches with No Results</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These queries didn't match any FAQ content. Consider adding new FAQs for these topics.
            </p>
            
            {loadingNoResults ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : noResultSearches && noResultSearches.length > 0 ? (
              <div className="space-y-3">
                {noResultSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-orange-900 dark:text-orange-100">{search.query}</p>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        Last: {formatDate(search.lastSearched)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">{search.count}</p>
                      <p className="text-xs text-orange-700 dark:text-orange-300">attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No failed searches yet - great!
              </div>
            )}
          </Card>
        </div>

        {/* Recent Searches */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Search Activity</h2>
          
          {loadingRecent ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : recentSearches && recentSearches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Query</th>
                    <th className="text-left py-3 px-4">Results</th>
                    <th className="text-left py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSearches.map((search) => (
                    <tr key={search.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{search.query}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          search.resultsCount === 0 
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                        }`}>
                          {search.resultsCount} {search.resultsCount === 1 ? 'result' : 'results'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(search.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No search activity yet
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
