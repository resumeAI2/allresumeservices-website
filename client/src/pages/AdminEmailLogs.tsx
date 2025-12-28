import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  RefreshCw,
  BarChart3,
  Filter
} from 'lucide-react';

const emailTypeLabels: Record<string, string> = {
  contact_form: 'Contact Form',
  order_confirmation: 'Order Confirmation',
  order_admin_notification: 'Order Admin Notification',
  review_request: 'Review Request',
  lead_magnet: 'Lead Magnet',
  intake_confirmation: 'Intake Confirmation',
  intake_admin_notification: 'Intake Admin Notification',
  intake_resume_later: 'Resume Later',
  test: 'Test Email',
  free_review: 'Free Review',
};

export default function AdminEmailLogs() {
  const [searchEmail, setSearchEmail] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const { data: logs, isLoading, refetch } = trpc.email.getLogs.useQuery({ limit: 100 });
  
  const { data: statistics } = trpc.email.getStatistics.useQuery({ days: 30 });

  const filteredLogs = (logs as any[])?.filter((log: any) => {
    const matchesEmail = !searchEmail || 
      log.recipientEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
      (log.recipientName?.toLowerCase().includes(searchEmail.toLowerCase()));
    const matchesType = filterType === 'all' || log.emailType === filterType;
    return matchesEmail && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy-900 text-white py-6">
        <div className="container">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="text-white hover:text-gold-400 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Mail className="w-8 h-8" />
            Email Delivery Logs
          </h1>
          <p className="text-gray-300 mt-2">
            Monitor and track all email deliveries from the system
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Emails</p>
                    <p className="text-3xl font-bold">{(statistics as any).total}</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Sent Successfully</p>
                    <p className="text-3xl font-bold text-green-600">{(statistics as any).sent}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Failed</p>
                    <p className="text-3xl font-bold text-red-600">{(statistics as any).failed}</p>
                  </div>
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-3xl font-bold">
                      {(statistics as any).total > 0 
                        ? Math.round(((statistics as any).sent / (statistics as any).total) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <Mail className="w-10 h-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Emails by Type */}
        {statistics && (statistics as any).byType && Object.keys((statistics as any).byType).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Emails by Type (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries((statistics as any).byType).map(([type, count]) => (
                  <div 
                    key={type}
                    className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2"
                  >
                    <span className="font-medium">{emailTypeLabels[type] || type}:</span>
                    <Badge variant="secondary">{count as number}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-64">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(emailTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Email Logs</CardTitle>
            <CardDescription>
              Showing {filteredLogs?.length || 0} emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Loading email logs...</p>
              </div>
            ) : filteredLogs && filteredLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Recipient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log: any) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(log.sentAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {emailTypeLabels[log.emailType] || log.emailType}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">{log.recipientEmail}</p>
                            {log.recipientName && (
                              <p className="text-xs text-gray-500">{log.recipientName}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {log.subject || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(log.status)}
                          {log.status === 'failed' && log.errorMessage && (
                            <p className="text-xs text-red-500 mt-1 max-w-xs truncate" title={log.errorMessage}>
                              {log.errorMessage}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 mx-auto text-gray-300" />
                <p className="mt-2 text-gray-500">No email logs found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Failures */}
        {statistics && (statistics as any).recentFailures && (statistics as any).recentFailures.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Recent Failures
              </CardTitle>
              <CardDescription>
                Review failed email deliveries to identify issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(statistics as any).recentFailures.map((failure: any) => (
                  <div 
                    key={failure.id}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{failure.recipientEmail}</p>
                        <p className="text-sm text-gray-600">{failure.subject}</p>
                        <Badge variant="outline" className="mt-2">
                          {emailTypeLabels[failure.emailType] || failure.emailType}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(failure.sentAt)}
                      </span>
                    </div>
                    {failure.errorMessage && (
                      <p className="mt-2 text-sm text-red-600 bg-red-100 rounded p-2">
                        Error: {failure.errorMessage}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
