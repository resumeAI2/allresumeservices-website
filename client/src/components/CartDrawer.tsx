import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from './ui/sheet';
import { Separator } from './ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';

export default function CartDrawer() {
  const {
    cartItems,
    cartCount,
    isCartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeItem,
    getTotal,
  } = useCart();

  const subtotal = getTotal();

  // Calculate bundle discount (10% off when buying 2+ individual services)
  const individualServicesCount = cartItems.filter(
    item => item.service.type === 'individual'
  ).reduce((sum, item) => sum + item.quantity, 0);

  const bundleDiscount = individualServicesCount >= 2 ? subtotal * 0.1 : 0;
  const total = subtotal - bundleDiscount;

  return (
    <Sheet open={isCartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <SheetContent side="right" className="flex flex-col w-[90vw] sm:max-w-md">
        <SheetHeader className="pb-0">
          <SheetTitle className="text-lg">
            Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {cartCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Your cart is empty
            </p>
            <Button
              variant="outline"
              onClick={() => setCartDrawerOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items - scrollable */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight truncate">
                      {item.service.name}
                    </h4>
                    {item.service.tier && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.service.tier}
                      </p>
                    )}

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">
                      ${(parseFloat(item.service.price) * item.quantity).toFixed(2)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ${item.service.price} ea
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: totals + actions */}
            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Bundle Discount (10%)</span>
                    <span className="font-medium">
                      -${bundleDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {individualServicesCount === 1 && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Add one more service to get 10% off!
                  </p>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)} AUD</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setCartDrawerOpen(false)}
                  className="block"
                >
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setCartDrawerOpen(false)}
                  className="block"
                >
                  <Button variant="outline" className="w-full">
                    View Full Cart
                  </Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
