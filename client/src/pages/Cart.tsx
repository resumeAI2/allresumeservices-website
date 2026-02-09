import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, Save, LogIn } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '../_core/hooks/useAuth';
import { getLoginUrl } from '../const';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Cart() {
  const { cartItems, cartCount, isLoading, updateQuantity, removeItem, getTotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const subtotal = getTotal();
  
  // Calculate bundle discount (10% off when buying 2+ individual services)
  const individualServicesCount = cartItems.filter(
    item => item.service.type === 'individual'
  ).reduce((sum, item) => sum + item.quantity, 0);
  
  const bundleDiscount = individualServicesCount >= 2 ? subtotal * 0.1 : 0;
  const total = subtotal - bundleDiscount;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading cart...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="container max-w-2xl text-center">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some services to your cart to get started with your professional resume journey.
            </p>
            <Link href="/packages#services">
              <Button size="lg">
                Browse Services
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
          
          {/* Save for Later Banner */}
          {!isAuthenticated && cartCount > 0 && (
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Save className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>Save your cart for later!</strong> Sign in to save your cart and access it from any device.
                  </span>
                  <a href={getLoginUrl()}>
                    <Button variant="outline" size="sm" className="ml-4">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </a>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {isAuthenticated && cartCount > 0 && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <Save className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Your cart is automatically saved!</strong> You can access it anytime from any device.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Service Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.service.name}
                        </h3>
                        {item.service.tier && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.service.tier}
                          </p>
                        )}
                        {item.service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.service.description}
                          </p>
                        )}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-4">
                          <span className="text-sm font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${(parseFloat(item.service.price) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.service.price} each
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {bundleDiscount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Bundle Discount (10%)</span>
                        <span className="font-medium">-${bundleDiscount.toFixed(2)}</span>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          🎉 You're saving 10% by purchasing multiple services!
                        </p>
                      </div>
                    </>
                  )}
                  
                  {individualServicesCount === 1 && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 Add one more service to get 10% off your entire order!
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Taxes calculated at checkout
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/packages#services" className="w-full">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
