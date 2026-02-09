import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useCart } from '../contexts/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Check, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

// Fallback items when API is loading, fails, or returns empty (so the page is never blank)
const FALLBACK_ITEMS = {
  all: [
    { name: 'Basic Package', type: 'package', category: 'Package', tier: null, price: '$155', originalPrice: '$180', description: 'Resume + Cover Letter for entry-level professionals', features: ['Entry Level Resume', 'Entry Level Cover Letter', 'ATS-friendly formatting', 'Delivered in Word & PDF', '2-4 business days delivery'], popular: false },
    { name: 'Standard Package', type: 'package', category: 'Package', tier: null, price: '$255', originalPrice: '$395', description: 'Resume + Cover Letter + LinkedIn for professionals', features: ['Professional Resume', 'Professional Cover Letter', 'LinkedIn Profile Optimisation', 'ATS-friendly formatting', 'Delivered in Word & PDF', '2-4 business days delivery'], popular: true },
    { name: 'Premium Package', type: 'package', category: 'Package', tier: null, price: '$355', originalPrice: '$605', description: 'Complete career package for executives', features: ['Executive Resume', 'Executive Cover Letter', 'LinkedIn Profile Optimisation', 'ATS-friendly formatting', 'Delivered in Word & PDF', '1 day express turnaround', 'Priority support'], popular: false },
    { name: 'Entry Level Resume', type: 'individual', category: 'Resume', tier: 'Entry Level', price: '$125', originalPrice: null, description: 'Professional resume writing for entry-level positions', features: ['ATS-optimised format', '1-2 pages', 'Professional summary', 'Skills section', '2-4 business days delivery'], popular: false },
    { name: 'Professional Resume', type: 'individual', category: 'Resume', tier: 'Professional', price: '$185', originalPrice: null, description: 'Comprehensive resume for mid-level professionals', features: ['ATS-optimised format', '2-3 pages', 'Professional summary', 'Achievement-focused content', '2-4 business days delivery'], popular: false },
    { name: 'Premium Resume', type: 'individual', category: 'Resume', tier: 'Premium', price: '$255', originalPrice: null, description: 'Premium resume for management, CEO, and executives', features: ['ATS-optimised format', '2-5 pages', 'Executive branding', 'Leadership achievements', '2-4 business days delivery'], popular: false },
    { name: 'Entry Level Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Entry Level', price: '$55', originalPrice: null, description: 'Compelling cover letter for entry-level applications', features: ['Tailored to job description', '1 page', 'Professional tone', '1-2 business days delivery'], popular: false },
    { name: 'Professional Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Professional', price: '$85', originalPrice: null, description: 'Strategic cover letter for professional positions', features: ['Customised to role', '1 page', 'Achievement highlights', '1-2 business days delivery'], popular: false },
    { name: 'Executive Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Executive', price: '$125', originalPrice: null, description: 'Executive-level cover letter showcasing leadership', features: ['Executive positioning', '1 page', 'Leadership narrative', '1-2 business days delivery'], popular: false },
    { name: 'LinkedIn Profile Optimisation', type: 'individual', category: 'LinkedIn', tier: 'Professional', price: '$125', originalPrice: null, description: 'Complete LinkedIn profile makeover', features: ['Keyword-optimised headline', 'Compelling summary', 'Experience section rewrite', 'Skills optimisation', '2-4 business days delivery'], popular: false },
    { name: 'Selection Criteria Response', type: 'individual', category: 'Selection Criteria', tier: 'Professional', price: '$100', originalPrice: null, description: 'Professional responses to government selection criteria using STAR method', features: ['STAR/CAR method', 'Up to 5 criteria', 'Evidence-based responses', '2-4 business days delivery'], popular: false },
    { name: 'Rush Delivery (24-48 hours)', type: 'addon', category: 'Add-on', tier: null, price: '$50', originalPrice: null, description: 'Expedited delivery within 24-48 hours', features: ['Priority processing', '24-48 hour turnaround', 'Applies to all items in order'], popular: false },
  ],
  individual: [
    { name: 'Entry Level Resume', type: 'individual', category: 'Resume', tier: 'Entry Level', price: '$125', originalPrice: null, description: 'Professional resume writing for entry-level positions', features: ['ATS-optimised format', '1-2 pages', 'Professional summary', 'Skills section', '2-4 business days delivery'], popular: false },
    { name: 'Professional Resume', type: 'individual', category: 'Resume', tier: 'Professional', price: '$185', originalPrice: null, description: 'Comprehensive resume for mid-level professionals', features: ['ATS-optimised format', '2-3 pages', 'Professional summary', 'Achievement-focused content', '2-4 business days delivery'], popular: false },
    { name: 'Premium Resume', type: 'individual', category: 'Resume', tier: 'Premium', price: '$255', originalPrice: null, description: 'Premium resume for management, CEO, and executives', features: ['ATS-optimised format', '2-5 pages', 'Executive branding', 'Leadership achievements', '2-4 business days delivery'], popular: false },
    { name: 'Entry Level Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Entry Level', price: '$55', originalPrice: null, description: 'Compelling cover letter for entry-level applications', features: ['Tailored to job description', '1 page', 'Professional tone', '1-2 business days delivery'], popular: false },
    { name: 'Professional Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Professional', price: '$85', originalPrice: null, description: 'Strategic cover letter for professional positions', features: ['Customised to role', '1 page', 'Achievement highlights', '1-2 business days delivery'], popular: false },
    { name: 'Executive Cover Letter', type: 'individual', category: 'Cover Letter', tier: 'Executive', price: '$125', originalPrice: null, description: 'Executive-level cover letter showcasing leadership', features: ['Executive positioning', '1 page', 'Leadership narrative', '1-2 business days delivery'], popular: false },
    { name: 'LinkedIn Profile Optimisation', type: 'individual', category: 'LinkedIn', tier: 'Professional', price: '$125', originalPrice: null, description: 'Complete LinkedIn profile makeover', features: ['Keyword-optimised headline', 'Compelling summary', 'Experience section rewrite', 'Skills optimisation', '2-4 business days delivery'], popular: false },
    { name: 'Selection Criteria Response', type: 'individual', category: 'Selection Criteria', tier: 'Professional', price: '$100', originalPrice: null, description: 'Professional responses to government selection criteria using STAR method', features: ['STAR/CAR method', 'Up to 5 criteria', 'Evidence-based responses', '2-4 business days delivery'], popular: false },
  ],
  package: [
    { name: 'Basic Package', type: 'package', category: 'Package', price: '$125', originalPrice: '$180', description: 'Resume + Cover Letter for entry-level professionals', features: ['Entry Level Resume', 'Entry Level Cover Letter', 'ATS-friendly formatting', 'Delivered in Word & PDF', '2-4 business days delivery'], popular: false },
    { name: 'Standard Package', type: 'package', category: 'Package', price: '$185', originalPrice: '$270', description: 'Resume + Cover Letter + LinkedIn for professionals', features: ['Professional Resume', 'Professional Cover Letter', 'ATS-friendly formatting', 'Delivered in Word & PDF', '2-4 business days delivery', 'Priority support'], popular: true },
    { name: 'Premium Package', type: 'package', category: 'Package', price: '$255', originalPrice: '$605', description: 'Complete career package for executives', features: ['Executive Resume', 'Executive Cover Letter', 'LinkedIn Profile Optimisation', 'ATS-friendly formatting', 'Delivered in Word & PDF', '1 day express turnaround', 'Priority support'], popular: false },
  ],
  addon: [
    { name: 'Rush Delivery (24-48 hours)', type: 'addon', category: 'Add-on', price: '$50', originalPrice: null, description: 'Expedited delivery within 24-48 hours', features: ['Priority processing', '24-48 hour turnaround', 'Applies to all items in order'], popular: false },
    { name: 'Phone Consultation (30 min)', type: 'addon', category: 'Add-on', price: '$75', originalPrice: null, description: 'One-on-one career consultation with expert', features: ['30-minute phone call', 'Career strategy discussion', 'Interview preparation tips', 'Personalized advice'], popular: false },
  ],
};

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'package' | 'addon'>('all');
  
  const { data: allServices = [], isLoading, isError, error, refetch } = trpc.services.getAllServices.useQuery(
    undefined,
    { retry: 1, refetchOnWindowFocus: false }
  );
  const { addToCart, openCartDrawer } = useCart();
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

  // Get filtered fallback items based on selected type and category
  const getFallbackItems = () => {
    const typeItems = FALLBACK_ITEMS[selectedType] || FALLBACK_ITEMS.all;
    return typeItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesCategory;
    });
  };

  const handleAddToCart = async (serviceId: number) => {
    setAddingToCart(serviceId);
    try {
      await addToCart(serviceId, 1);
      // Find service name for the toast
      const serviceName = allServices.find(s => s.id === serviceId)?.name ?? 'Item';
      toast.success(`${serviceName} added to cart`);
      // Open the cart drawer so the user can see their cart
      openCartDrawer();
      setAddingToCart(null);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
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
        <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] text-white py-20 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <Badge className="bg-secondary/20 text-white border-secondary/30 px-4 py-2 text-sm font-semibold">
                  <Check className="w-4 h-4 mr-2 inline" />
                  96% Interview Success Rate
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Professional Resume Services & Packages
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Choose from individual services or complete packages tailored to your career level. 
                Every resume is crafted by experienced writers with 18+ years in the industry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                  <a href="#services">Browse Services</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <a href="/resume-transformation">See Real Results</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a5f]">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our proven 5-step process ensures you get a resume that opens doors
              </p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: '1', title: 'Choose Service', description: 'Select the package that fits your career goals', icon: '🎯' },
                { step: '2', title: 'Consultation', description: 'Share your career history and target roles', icon: '💬' },
                { step: '3', title: 'Expert Writing', description: 'Our writers craft your ATS-optimised resume', icon: '✍️' },
                { step: '4', title: 'Review & Refine', description: 'We refine your documents based on your feedback', icon: '🔄' },
                { step: '5', title: 'Land Interviews', description: 'Start applying with confidence', icon: '🎉' }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 text-3xl">
                      {item.icon}
                    </div>
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-secondary/20 -z-10 hidden md:block" style={{ display: index === 4 ? 'none' : 'block' }}></div>
                    <div className="mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-white text-sm font-bold">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-[#1e3a5f]">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
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
        <section className="py-16 scroll-mt-24" id="services">
          <div className="container">
            <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
              Select a package and click <strong>Add to Cart</strong> to pay via PayPal.
            </p>
            {(isLoading || isError || filteredServices.length === 0) ? (
              <>
                {isLoading && (
                  <p className="text-center text-muted-foreground mb-6">Loading services...</p>
                )}
                {!isLoading && !isError && filteredServices.length === 0 && allServices.length > 0 && (
                  <p className="text-center text-muted-foreground mb-6">No services match the current filters. Try &quot;All Services&quot; or a different category.</p>
                )}
                {(() => {
                  const fallbackItems = getFallbackItems();
                  if (fallbackItems.length === 0) {
                    return (
                      <p className="text-center text-muted-foreground mb-6">No items available for the selected filters. Try selecting &quot;All Services&quot; or a different category.</p>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                      {fallbackItems.map((item, index) => (
                        <Card key={`${item.name}-${index}`} className={`flex flex-col relative ${item.popular ? 'border-primary shadow-lg' : ''}`}>
                          {item.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <Badge variant="default" className="bg-[#d4af37] text-white border-2 border-white shadow-lg px-4 py-1">Most Popular</Badge>
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                {item.type === 'package' && (
                                  <Badge variant="default" className="mb-2 bg-[#2d5a8f] text-white hover:bg-[#2d5a8f]/90">Package Deal</Badge>
                                )}
                                {item.type === 'addon' && (
                                  <Badge variant="outline" className="mb-2">Add-on</Badge>
                                )}
                                {item.tier && (
                                  <Badge variant="secondary" className="mb-2">{item.tier}</Badge>
                                )}
                              </div>
                              <div className="text-right">
                                {item.originalPrice && <p className="text-sm text-muted-foreground line-through">{item.originalPrice}</p>}
                                <p className="text-2xl font-bold">{item.price}</p>
                              </div>
                            </div>
                            <CardTitle className="text-xl">{item.name}</CardTitle>
                            <CardDescription>{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <ul className="space-y-2">
                              {item.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                              <a href={`/contact?package=${encodeURIComponent(item.name)}`}>Contact us to order</a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => {
                  const features = parseFeatures(service.features);
                  const isPackage = service.type === 'package';
                  const hasDiscount = service.originalPrice && parseFloat(service.originalPrice) > parseFloat(service.price);

                  return (
                    <Card key={service.id} className={`flex flex-col relative ${isPackage ? 'border-primary shadow-lg' : ''}`}>
                      {service.type === 'package' && service.name === 'Standard Package' && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge variant="default" className="bg-[#d4af37] text-white border-2 border-white shadow-lg px-4 py-1">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {service.type === 'package' && (
                              <Badge variant="default" className="mb-2 bg-[#2d5a8f] text-white hover:bg-[#2d5a8f]/90">
                                Package Deal
                              </Badge>
                            )}
                            {service.type === 'addon' && (
                              <Badge variant="outline" className="mb-2">
                                Add-on
                              </Badge>
                            )}
                            {service.tier && (
                              <Badge variant="secondary" className="mb-2">
                                {service.tier}
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

        {/* Client Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a5f]">What Our Clients Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real success stories from professionals who transformed their careers with our services
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-secondary">S.M.</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-[#d4af37] fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-xs text-gray-600">Marketing Manager</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed mb-4 italic">
                    "I was stuck in the same role for 5 years. After using their Executive Package, I received 4 interview requests in 3 weeks and landed a senior position with a 35% salary increase. The investment paid for itself many times over!"
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-secondary font-semibold">Executive Resume Package</p>
                    <p className="text-xs text-gray-500 mt-1">Healthcare Industry</p>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-secondary">J.K.</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-[#d4af37] fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">James K.</p>
                      <p className="text-xs text-gray-600">IT Project Manager</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed mb-4 italic">
                    "As a career changer moving from engineering to IT management, I needed a resume that highlighted transferable skills. The team nailed it! I secured my dream role at a Fortune 500 company within 6 weeks."
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-secondary font-semibold">Career Change Package</p>
                    <p className="text-xs text-gray-500 mt-1">IT & Technology</p>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-secondary">L.S.</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-[#d4af37] fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Lisa T.</p>
                      <p className="text-xs text-gray-600">Operations Supervisor</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed mb-4 italic">
                    "After struggling to get interviews for months with my old resume, I decided to invest in professional help. Within two weeks, I secured three interviews and ultimately landed my dream role in mining technology. Worth every dollar!"
                  </blockquote>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-secondary font-semibold">Resume + Cover Letter Package</p>
                    <p className="text-xs text-gray-500 mt-1">Mining & Resources</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View More Link */}
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <a href="/testimonials">View All Success Stories</a>
              </Button>
            </div>
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
