import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, Search, FileText } from "lucide-react";

export default function AdminIntakeRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: intakes, isLoading } = trpc.clientIntake.getAllIntakes.useQuery();

  const filteredIntakes = intakes?.filter((intake) => {
    const query = searchQuery.toLowerCase();
    return (
      intake.firstName?.toLowerCase().includes(query) ||
      intake.lastName?.toLowerCase().includes(query) ||
      intake.email?.toLowerCase().includes(query) ||
      intake.purchasedService?.toLowerCase().includes(query) ||
      intake.paypalTransactionId?.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      in_progress: "default",
      completed: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy">Client Intake Records</h1>
            <p className="text-gray-600 mt-2">
              View and manage post-payment client information submissions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, service, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredIntakes && filteredIntakes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIntakes.map((intake) => (
                  <TableRow key={intake.id}>
                    <TableCell className="font-mono text-sm">
                      #{intake.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {intake.firstName} {intake.lastName}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${intake.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {intake.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {intake.purchasedService || (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(intake.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(intake.submittedAt).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {intake.resumeFileUrl && (
                        <FileText className="w-4 h-4 text-blue-600" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/intake-records/${intake.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery
                  ? "No intake records match your search"
                  : "No intake records yet"}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        {intakes && intakes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
              <div className="text-3xl font-bold text-navy">{intakes.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-3xl font-bold text-amber-600">
                {intakes.filter((i) => i.status === "pending").length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600">
                {intakes.filter((i) => i.status === "completed").length}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
