import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  Package,
  Search,
  Filter,
  DollarSign,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders with filters
  const ordersQuery = trpc.orders.getAll.useQuery({
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    search: searchQuery || undefined,
  });

  // Fetch statistics
  const statsQuery = trpc.orders.getStatistics.useQuery();

  const orders = ordersQuery.data || [];
  const stats = statsQuery.data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Order Management - Admin | All Resume Services</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="flex-1 py-8 bg-muted/20">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Package className="h-8 w-8 text-primary" />
                  Order Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage customer orders
                </p>
              </div>
              <Link href="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.completedOrders}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          <Card>
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">
                Orders ({orders.length})
              </h2>
            </div>

            {ordersQuery.isLoading ? (
              <div className="p-12 text-center text-muted-foreground">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-1">No orders found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Orders will appear here once customers make purchases"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-sm">
                        Order ID
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Customer
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Package
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Amount
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Status
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Date
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm">
                            #{order.id}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {order.customerName || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.customerEmail || "No email"}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">{order.packageName}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">
                            {formatCurrency(order.amount)} {order.currency}
                          </span>
                        </td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
