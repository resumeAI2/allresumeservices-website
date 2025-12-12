import { trpc } from '@/lib/trpc';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function MyOrders() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: userOrders = [], isLoading } = trpc.orders.getUserOrders.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12">
          <div className="container max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-4">My Orders</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to view your order history
            </p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      failed: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              View and track your resume service orders
            </p>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading your orders...</p>
              </CardContent>
            </Card>
          ) : userOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Browse our services to get started!
                </p>
                <Link href="/services">
                  <Button>Browse Services</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order: any) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id}
                          </CardTitle>
                          <CardDescription>
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-AU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Service
                          </p>
                          <p className="font-medium">{order.packageName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Amount
                          </p>
                          <p className="font-bold text-lg">
                            {order.currency} ${order.amount}
                          </p>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Contact Information
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          {order.customerName && (
                            <div>
                              <span className="text-muted-foreground">Name: </span>
                              <span className="font-medium">{order.customerName}</span>
                            </div>
                          )}
                          {order.customerEmail && (
                            <div>
                              <span className="text-muted-foreground">Email: </span>
                              <span className="font-medium">{order.customerEmail}</span>
                            </div>
                          )}
                          {order.customerPhone && (
                            <div>
                              <span className="text-muted-foreground">Phone: </span>
                              <span className="font-medium">{order.customerPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* PayPal Transaction ID */}
                      {order.paypalOrderId && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            PayPal Transaction ID
                          </p>
                          <p className="text-xs font-mono text-muted-foreground">
                            {order.paypalOrderId}
                          </p>
                        </div>
                      )}

                      {/* Status-specific Messages */}
                      <div className="border-t pt-4">
                        {order.status === 'pending' && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                              <strong>⏳ Order Pending:</strong> We're processing your order. Our team will contact you within 24 hours to schedule your consultation.
                            </p>
                          </div>
                        )}
                        {order.status === 'completed' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-800">
                              <strong>✅ Order Completed:</strong> Your order has been successfully completed. Check your email for your documents or contact us if you need assistance.
                            </p>
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                              <strong>❌ Order Cancelled:</strong> This order has been cancelled. If you have questions, please contact our support team.
                            </p>
                          </div>
                        )}
                        {order.status === 'failed' && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                              <strong>⚠️ Payment Failed:</strong> There was an issue processing your payment. Please try again or contact support.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Have questions about your order?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is here to help. Contact us at{' '}
                <a
                  href="mailto:admin@allresumeservices.com.au"
                  className="text-primary hover:underline"
                >
                  admin@allresumeservices.com.au
                </a>
                {' '}or visit our{' '}
                <Link href="/contact">
                  <a className="text-primary hover:underline">contact page</a>
                </Link>
                .
              </p>
              <Link href="/faq">
                <Button variant="outline">View FAQ</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
