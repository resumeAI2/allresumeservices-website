import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Style Guide</h1>
          <p className="text-muted-foreground mb-12">
            Internal reference for typography, colors, and component styles used across All Resume Services.
          </p>

          {/* Typography Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Typography</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Heading 1 (28px, 600 weight)</p>
                <h1 className="text-[1.75rem]">The quick brown fox jumps over the lazy dog</h1>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Heading 2 (24px, 600 weight)</p>
                <h2 className="text-[1.5rem]">The quick brown fox jumps over the lazy dog</h2>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Heading 3 (20px, 600 weight)</p>
                <h3 className="text-[1.25rem]">The quick brown fox jumps over the lazy dog</h3>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Heading 4 (18px, 600 weight)</p>
                <h4 className="text-[1.125rem]">The quick brown fox jumps over the lazy dog</h4>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Body Text (15px, 400 weight, 1.7 line-height)</p>
                <p>
                  Professional resume writing services helping Australians land interviews and secure their dream jobs. 
                  With 18+ years of experience and a 96% interview success rate, we're your partner in career advancement.
                  Our expert writers craft ATS-optimised resumes tailored to your industry and career goals.
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Small Text (14px)</p>
                <p className="text-sm">This is small text used for captions, labels, and secondary information.</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Extra Small Text (12px)</p>
                <p className="text-xs">This is extra small text used for fine print and disclaimers.</p>
              </div>
            </div>
          </section>

          {/* Colors Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Colors</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="h-20 rounded-lg bg-primary mb-2"></div>
                <p className="font-medium">Primary (Navy)</p>
                <p className="text-sm text-muted-foreground">--primary</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-secondary mb-2"></div>
                <p className="font-medium">Secondary (Gold)</p>
                <p className="text-sm text-muted-foreground">--secondary</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-background border mb-2"></div>
                <p className="font-medium">Background</p>
                <p className="text-sm text-muted-foreground">--background</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-foreground mb-2"></div>
                <p className="font-medium">Foreground</p>
                <p className="text-sm text-muted-foreground">--foreground</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-muted mb-2"></div>
                <p className="font-medium">Muted</p>
                <p className="text-sm text-muted-foreground">--muted</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-accent mb-2"></div>
                <p className="font-medium">Accent</p>
                <p className="text-sm text-muted-foreground">--accent</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg bg-destructive mb-2"></div>
                <p className="font-medium">Destructive</p>
                <p className="text-sm text-muted-foreground">--destructive</p>
              </div>
              
              <div>
                <div className="h-20 rounded-lg border-2 border-border mb-2"></div>
                <p className="font-medium">Border</p>
                <p className="text-sm text-muted-foreground">--border</p>
              </div>
            </div>
          </section>

          {/* Buttons Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Buttons</h2>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </section>

          {/* Cards Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Cards</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Basic Card</h3>
                <p className="text-muted-foreground">
                  This is a basic card component with padding and default styling.
                </p>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">Interactive Card</h3>
                <p className="text-muted-foreground">
                  This card has hover effects for interactive elements.
                </p>
              </Card>
            </div>
          </section>

          {/* Form Elements Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Form Elements</h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-2">Text Input</label>
                <Input placeholder="Enter your name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email Input</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Textarea</label>
                <Textarea placeholder="Enter your message" rows={4} />
              </div>
            </div>
          </section>

          {/* Spacing Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Spacing Scale</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 bg-primary"></div>
                <span className="text-sm">4px (1 unit)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-4 bg-primary"></div>
                <span className="text-sm">8px (2 units)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-4 bg-primary"></div>
                <span className="text-sm">12px (3 units)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-primary"></div>
                <span className="text-sm">16px (4 units)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-4 bg-primary"></div>
                <span className="text-sm">24px (6 units)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-4 bg-primary"></div>
                <span className="text-sm">32px (8 units)</span>
              </div>
            </div>
          </section>

          {/* Border Radius Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Border Radius</h2>
            
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-sm mb-2"></div>
                <span className="text-sm">Small</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-md mb-2"></div>
                <span className="text-sm">Medium</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mb-2"></div>
                <span className="text-sm">Large</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-xl mb-2"></div>
                <span className="text-sm">XL</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full mb-2"></div>
                <span className="text-sm">Full</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
