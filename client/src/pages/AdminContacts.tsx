import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useMemo } from 'react';
import { Mail, Phone, Calendar, MessageSquare, Search, Filter } from 'lucide-react';

type ContactStatus = 'new' | 'contacted' | 'converted' | 'archived';

export default function AdminContacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [notes, setNotes] = useState('');

  const { data: contacts = [], refetch } = trpc.contact.getAll.useQuery();
  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      alert('Status updated successfully');
    },
  });
  const updateNotesMutation = trpc.contact.updateNotes.useMutation({
    onSuccess: () => {
      refetch();
      alert('Notes saved successfully');
      setSelectedContact(null);
    },
  });

  // Filter contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c: any) => c.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c: any) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        (c.phone && c.phone.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [contacts, statusFilter, searchQuery]);

  const handleStatusChange = (id: number, status: ContactStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleSaveNotes = () => {
    if (selectedContact) {
      updateNotesMutation.mutate({ id: selectedContact.id, notes });
    }
  };

  const statusCounts = useMemo(() => {
    return {
      all: contacts.length,
      new: contacts.filter((c: any) => c.status === 'new').length,
      contacted: contacts.filter((c: any) => c.status === 'contacted').length,
      converted: contacts.filter((c: any) => c.status === 'converted').length,
      archived: contacts.filter((c: any) => c.status === 'archived').length,
    };
  }, [contacts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground mt-2">
          Manage and respond to customer inquiries
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter('all')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter('new')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.new}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter('contacted')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.contacted}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter('converted')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{statusCounts.converted}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent" onClick={() => setStatusFilter('archived')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.archived}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No contacts found</p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact: any) => (
            <Card key={contact.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${contact.email}`} className="hover:underline">
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${contact.phone}`} className="hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(contact.submittedAt).toLocaleString()}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contact.serviceInterest && (
                  <div className="mb-3">
                    <span className="text-sm font-medium">Service Interest: </span>
                    <span className="text-sm text-muted-foreground">{contact.serviceInterest}</span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Message:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.message}</p>
                </div>
                {contact.notes && (
                  <div className="mb-4 p-3 bg-accent rounded-md">
                    <p className="text-sm font-medium mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Select
                    value={contact.status}
                    onValueChange={(value: ContactStatus) => handleStatusChange(contact.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedContact(contact);
                      setNotes(contact.notes || '');
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {contact.notes ? 'Edit Notes' : 'Add Notes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notes Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Notes</DialogTitle>
            <DialogDescription>
              Add internal notes about this contact submission
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Contact: {selectedContact?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedContact?.email}</p>
            </div>
            <Textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedContact(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
