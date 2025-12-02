import { readFileSync, writeFileSync } from 'fs';

// Healthcare pricing data
const healthcarePricing = `  const pricingTiers = [
    {
      level: 'Entry to Mid-Level',
      price: '$185',
      turnaround: '3-5 business days',
      features: [
        'Enrolled nurse, registered nurse, or allied health roles',
        'AHPRA registration prominently featured',
        'Clinical skills and patient care experience highlighted',
        'Specialty certifications and continuing education showcased',
        'Cover letter emphasising compassionate care',
        'LinkedIn profile optimisation',
        'Unlimited revisions for 7 days'
      ]
    },
    {
      level: 'Senior & Leadership',
      price: '$255',
      turnaround: '5-7 business days',
      features: [
        'Clinical nurse consultant, nurse manager, or senior allied health roles',
        'Executive-level resume with clinical leadership achievements',
        'Quality improvement initiatives and patient outcomes highlighted',
        'Team management and mentoring experience showcased',
        'Research, publications, and presentations featured',
        'Selection criteria responses (for public hospital roles)',
        'LinkedIn executive profile optimisation',
        'Unlimited revisions for 14 days'
      ],
      popular: true
    }
  ];

`;

// Government pricing data
const governmentPricing = `  const pricingTiers = [
    {
      level: 'Entry to Mid-Level (APS 1-6)',
      price: '$215',
      turnaround: '5-7 business days',
      features: [
        'APS 1-6 or state government equivalent roles',
        'Resume aligned with capability frameworks',
        'Up to 3 selection criteria responses using STAR method',
        'Government-specific keywords and terminology',
        'Cover letter for public sector applications',
        'LinkedIn profile optimisation',
        'Unlimited revisions for 7 days'
      ]
    },
    {
      level: 'Executive Level (EL1-SES)',
      price: '$315',
      turnaround: '7-10 business days',
      features: [
        'EL1, EL2, SES, or senior state government roles',
        'Executive-level resume with strategic achievements',
        'Up to 5 selection criteria responses with detailed STAR examples',
        'Leadership capability and policy impact highlighted',
        'Stakeholder management and change leadership showcased',
        'Cover letter for executive applications',
        'LinkedIn executive profile optimisation',
        'Unlimited revisions for 14 days'
      ],
      popular: true
    }
  ];

`;

// IT & Technology pricing data
const itPricing = `  const pricingTiers = [
    {
      level: 'Entry to Mid-Level',
      price: '$185',
      turnaround: '3-5 business days',
      features: [
        'Junior to mid-level developer, analyst, or support roles',
        'Tech stack and programming languages prominently featured',
        'Projects and technical achievements highlighted',
        'GitHub/portfolio links integrated',
        'Cover letter showcasing technical skills',
        'LinkedIn profile optimisation',
        'Unlimited revisions for 7 days'
      ]
    },
    {
      level: 'Senior & Leadership',
      price: '$255',
      turnaround: '5-7 business days',
      features: [
        'Senior engineer, architect, tech lead, or manager roles',
        'Executive-level resume with technical leadership achievements',
        'System architecture and scalability projects highlighted',
        'Team leadership and mentoring experience showcased',
        'Open source contributions and technical publications featured',
        'Selection criteria responses (for government IT roles)',
        'LinkedIn executive profile optimisation',
        'Unlimited revisions for 14 days'
      ],
      popular: true
    }
  ];

`;

// Add pricing to Healthcare
const healthcareFile = '/home/ubuntu/allresumeservices-website/client/src/pages/industries/Healthcare.tsx';
let healthcareContent = readFileSync(healthcareFile, 'utf-8');
healthcareContent = healthcareContent.replace(
  "import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function Healthcare() {",
  `import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function Healthcare() {\n${healthcarePricing}`
);
healthcareContent = healthcareContent.replace(
  "      {/* Featured Case Study */}",
  `      {/* Pricing Comparison */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing for Healthcare Professionals</h2>
              <p className="text-lg text-muted-foreground">Choose the package that matches your career level</p>
            </div>
            <IndustryPricingTable tiers={pricingTiers} />
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/contact">Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}`
);
writeFileSync(healthcareFile, healthcareContent);
console.log('✓ Added pricing to Healthcare.tsx');

// Add pricing to Government
const governmentFile = '/home/ubuntu/allresumeservices-website/client/src/pages/industries/Government.tsx';
let governmentContent = readFileSync(governmentFile, 'utf-8');
governmentContent = governmentContent.replace(
  "import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function Government() {",
  `import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function Government() {\n${governmentPricing}`
);
governmentContent = governmentContent.replace(
  "      {/* Featured Case Study */}",
  `      {/* Pricing Comparison */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing for Government & Public Sector Professionals</h2>
              <p className="text-lg text-muted-foreground">Choose the package that matches your career level</p>
            </div>
            <IndustryPricingTable tiers={pricingTiers} />
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/contact">Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}`
);
writeFileSync(governmentFile, governmentContent);
console.log('✓ Added pricing to Government.tsx');

// Add pricing to IT & Technology
const itFile = '/home/ubuntu/allresumeservices-website/client/src/pages/industries/ITTechnology.tsx';
let itContent = readFileSync(itFile, 'utf-8');
itContent = itContent.replace(
  "import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function ITTechnology() {",
  `import IndustryPricingTable from '@/components/IndustryPricingTable';\n\nexport default function ITTechnology() {\n${itPricing}`
);
itContent = itContent.replace(
  "      {/* Featured Case Study */}",
  `      {/* Pricing Comparison */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing for IT & Technology Professionals</h2>
              <p className="text-lg text-muted-foreground">Choose the package that matches your career level</p>
            </div>
            <IndustryPricingTable tiers={pricingTiers} />
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/contact">Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}`
);
writeFileSync(itFile, itContent);
console.log('✓ Added pricing to ITTechnology.tsx');

console.log('\n✓ All pricing tables added successfully!');
