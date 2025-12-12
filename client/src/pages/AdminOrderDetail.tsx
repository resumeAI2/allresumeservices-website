import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";


export default function AdminOrderDetail() {
  const params = useParams();
  const [, navigate] = useLocation();

  const orderId = parseInt(params.id || "0");

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Fetch order details
  const orderQuery = trpc.orders.getById.useQuery({ id: orderId });
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();
  const deleteOrderMutation = trpc.orders.delete.useMutation();

  const order = orderQuery.data;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await updateStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus as any,
      });
      
      alert(`Order status changed to ${newStatus}`);
      
      // Refetch order data
      orderQuery.refetch();
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to update status"}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteOrderMutation.mutateAsync({ id: orderId });
      
      alert("Order has been permanently deleted");
      
      navigate("/admin/orders");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to delete order"}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-base px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-base px-3 py-1">
            <Clock className="h-4 w-4 mr-1.5" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 text-base px-3 py-1">
            <XCircle className="h-4 w-4 mr-1.5" />
            Cancelled
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-base px-3 py-1">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            Failed
          </Badge>
        );
      default:
        return <Badge className="text-base px-3 py-1">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: string) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (orderQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Loading Order... - Admin | All Resume Services</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Order Not Found - Admin | All Resume Services</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <main className="flex-1 py-16 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Order Not Found</p>
            <p className="text-sm text-muted-foreground mb-6">
              The order you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/admin/orders">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Order #{order.id} - Admin | All Resume Services</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="flex-1 py-8 bg-muted/20">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/orders">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Package className="h-8 w-8 text-primary" />
                  Order #{order.id}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Created on {formatDate(order.createdAt)}
                </p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Details */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Order ID
                      </Label>
                      <p className="font-mono font-medium mt-1">#{order.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Package
                      </Label>
                      <p className="font-medium mt-1">{order.packageName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Amount
                      </Label>
                      <p className="font-semibold text-lg mt-1">
                        {formatCurrency(order.amount)} {order.currency}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Status
                      </Label>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>

                  {order.paypalOrderId && (
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        PayPal Order ID
                      </Label>
                      <p className="font-mono text-sm mt-1 bg-muted px-3 py-2 rounded">
                        {order.paypalOrderId}
                      </p>
                    </div>
                  )}

                  {order.paypalPayerId && (
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        PayPal Payer ID
                      </Label>
                      <p className="font-mono text-sm mt-1 bg-muted px-3 py-2 rounded">
                        {order.paypalPayerId}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Customer Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Name
                      </Label>
                      <p className="font-medium mt-1">
                        {order.customerName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Email
                      </Label>
                      <p className="font-medium mt-1">
                        {order.customerEmail ? (
                          <a
                            href={`mailto:${order.customerEmail}`}
                            className="text-primary hover:underline"
                          >
                            {order.customerEmail}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="text-muted-foreground text-sm">
                        Phone
                      </Label>
                      <p className="font-medium mt-1">
                        {order.customerPhone ? (
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-primary hover:underline"
                          >
                            {order.customerPhone}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Order Timeline */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Order Timeline
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 w-px bg-border mt-2" />
                    </div>
                    <div className="pb-8">
                      <p className="font-medium">Order Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Update Status</h3>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Change the order status to track progress
                </p>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteOrder}
                    disabled={deleteOrderMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteOrderMutation.isPending ? "Deleting..." : "Delete Order"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  ⚠️ Deleting an order is permanent and cannot be undone
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
