import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, ShoppingCart } from 'lucide-react';

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'package' | 'addon'>('all');
  
  const { data: allServices = [], isLoading } = trpc.services.getAllServices.useQuery();
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Filter services based on selected category and type
  const filteredServices = allServices.filter(service => {
    const matchesType = selectedType === 'all' || service.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  // Get unique categories
  const uniqueCategories = new Set(allServices.map(s => s.category).filter(Boolean));
  const categories = ['all', ...Array.from(uniqueCategories)];

  const handleAddToCart = async (serviceId: number) => {
    setAddingToCart(serviceId);
    try {
      await addToCart(serviceId, 1);
      // Show success feedback
      setTimeout(() => setAddingToCart(null), 1000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingToCart(null);
    }
  };

  const parseFeatures = (featuresJson: string | null): string[] => {
    if (!featuresJson) return [];
    try {
      return JSON.parse(featuresJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Professional Resume Services & Packages
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose from individual services or complete packages tailored to your career level
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Type Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                >
                  All Services
                </Button>
                <Button
                  variant={selectedType === 'individual' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('individual')}
                >
                  Individual Services
                </Button>
                <Button
                  variant={selectedType === 'package' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('package')}
                >
                  Packages
                </Button>
                <Button
                  variant={selectedType === 'addon' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('addon')}
                >
                  Add-ons
                </Button>
              </div>

              {/* Category Filter */}
              {selectedType !== 'package' && selectedType !== 'addon' && (
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category || 'all')}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No services found matching your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => {
                  const features = parseFeatures(service.features);
                  const isPackage = service.type === 'package';
                  const hasDiscount = service.originalPrice && parseFloat(service.originalPrice) > parseFloat(service.price);

                  return (
                    <Card key={service.id} className={`flex flex-col ${isPackage ? 'border-primary shadow-lg' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {service.tier && (
                              <Badge variant="secondary" className="mb-2">
                                {service.tier}
                              </Badge>
                            )}
                            {service.type === 'package' && (
                              <Badge variant="default" className="mb-2">
                                Package Deal
                              </Badge>
                            )}
                            {service.type === 'addon' && (
                              <Badge variant="outline" className="mb-2">
                                Add-on
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            {hasDiscount && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${service.originalPrice}
                              </p>
                            )}
                            <p className="text-2xl font-bold">
                              ${service.price}
                            </p>
                          </div>
                        </div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-1">
                        {features.length > 0 && (
                          <ul className="space-y-2">
                            {features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleAddToCart(service.id)}
                          disabled={addingToCart === service.id}
                        >
                          {addingToCart === service.id ? (
                            <>Adding...</>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Not Sure Which Service to Choose?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Contact us for a free consultation and we'll help you select the perfect package for your career goals.
              </p>
              <Button size="lg" variant="default" onClick={() => window.location.href = '/contact'}>
                Get Free Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
