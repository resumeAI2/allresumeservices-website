import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const services = [
  // Individual Services - Resume
  {
    name: 'Entry Level Resume',
    description: 'Professional resume writing for entry-level positions and recent graduates',
    type: 'individual',
    category: 'Resume',
    tier: 'Entry Level',
    price: '99',
    originalPrice: null,
    features: JSON.stringify([
      'ATS-optimized format',
      '1-2 pages',
      'Professional summary',
      'Skills section',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery'
    ]),
    active: 1,
    sortOrder: 1
  },
  {
    name: 'Professional Resume',
    description: 'Comprehensive resume for mid-level professionals with 3-10 years experience',
    type: 'individual',
    category: 'Resume',
    tier: 'Professional',
    price: '149',
    originalPrice: null,
    features: JSON.stringify([
      'ATS-optimized format',
      '2-3 pages',
      'Executive summary',
      'Achievement-focused content',
      'Skills & certifications',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery'
    ]),
    active: 1,
    sortOrder: 2
  },
  {
    name: 'Executive Resume',
    description: 'Premium resume for senior executives and C-level professionals',
    type: 'individual',
    category: 'Resume',
    tier: 'Executive',
    price: '255',
    originalPrice: null,
    features: JSON.stringify([
      'ATS-optimized format',
      '2-3 pages',
      'Executive branding',
      'Leadership achievements',
      'Board experience highlight',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery'
    ]),
    active: 1,
    sortOrder: 3
  },

  // Individual Services - Cover Letter
  {
    name: 'Entry Level Cover Letter',
    description: 'Compelling cover letter for entry-level applications',
    type: 'individual',
    category: 'Cover Letter',
    tier: 'Entry Level',
    price: '49',
    originalPrice: null,
    features: JSON.stringify([
      'Tailored to job description',
      '1 page',
      'Professional tone',
      "We work with you until you're 100% satisfied",
      '1-2 business days delivery'
    ]),
    active: 1,
    sortOrder: 4
  },
  {
    name: 'Professional Cover Letter',
    description: 'Strategic cover letter for professional positions',
    type: 'individual',
    category: 'Cover Letter',
    tier: 'Professional',
    price: '75',
    originalPrice: null,
    features: JSON.stringify([
      'Customized to role',
      '1 page',
      'Achievement highlights',
      "We work with you until you're 100% satisfied",
      '1-2 business days delivery'
    ]),
    active: 1,
    sortOrder: 5
  },
  {
    name: 'Executive Cover Letter',
    description: 'Executive-level cover letter showcasing leadership',
    type: 'individual',
    category: 'Cover Letter',
    tier: 'Executive',
    price: '99',
    originalPrice: null,
    features: JSON.stringify([
      'Executive positioning',
      '1 page',
      'Leadership narrative',
      "We work with you until you're 100% satisfied",
      '1-2 business days delivery'
    ]),
    active: 1,
    sortOrder: 6
  },

  // Individual Services - LinkedIn
  {
    name: 'LinkedIn Profile Optimization',
    description: 'Complete LinkedIn profile makeover for maximum visibility',
    type: 'individual',
    category: 'LinkedIn',
    tier: 'Professional',
    price: '125',
    originalPrice: null,
    features: JSON.stringify([
      'Keyword-optimized headline',
      'Compelling summary',
      'Experience section rewrite',
      'Skills optimization',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery'
    ]),
    active: 1,
    sortOrder: 7
  },

  // Individual Services - Selection Criteria
  {
    name: 'Selection Criteria Response',
    description: 'Professional responses to government selection criteria using STAR method',
    type: 'individual',
    category: 'Selection Criteria',
    tier: 'Professional',
    price: '100',
    originalPrice: null,
    features: JSON.stringify([
      'STAR/CAR method',
      'Up to 5 criteria',
      'Evidence-based responses',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery'
    ]),
    active: 1,
    sortOrder: 8
  },

  // Packages
  {
    name: 'Basic Package',
    description: 'Resume + Cover Letter for entry-level professionals',
    type: 'package',
    category: 'Package',
    tier: null,
    price: '125',
    originalPrice: '148',
    features: JSON.stringify([
      'Entry Level Resume',
      'Entry Level Cover Letter',
      'ATS-optimized',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery',
      'Save $23'
    ]),
    active: 1,
    sortOrder: 20
  },
  {
    name: 'Standard Package',
    description: 'Resume + Cover Letter + LinkedIn for professionals',
    type: 'package',
    category: 'Package',
    tier: null,
    price: '185',
    originalPrice: '224',
    features: JSON.stringify([
      'Professional Resume',
      'Professional Cover Letter',
      'LinkedIn Profile Optimization',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery',
      'Save $39'
    ]),
    active: 1,
    sortOrder: 21
  },
  {
    name: 'Premium Package',
    description: 'Complete career package for executives',
    type: 'package',
    category: 'Package',
    tier: null,
    price: '255',
    originalPrice: '324',
    features: JSON.stringify([
      'Executive Resume',
      'Executive Cover Letter',
      'LinkedIn Profile Optimization',
      "We work with you until you're 100% satisfied",
      '2-5 business days delivery',
      'Save $69'
    ]),
    active: 1,
    sortOrder: 22
  },

  // Add-ons
  {
    name: 'Rush Delivery (24-48 hours)',
    description: 'Expedited delivery within 24-48 hours',
    type: 'addon',
    category: 'Add-on',
    tier: null,
    price: '50',
    originalPrice: null,
    features: JSON.stringify([
      'Priority processing',
      '24-48 hour turnaround',
      'Applies to all items in order'
    ]),
    active: 1,
    sortOrder: 30
  },

  {
    name: 'Phone Consultation (30 min)',
    description: 'One-on-one career consultation with expert',
    type: 'addon',
    category: 'Add-on',
    tier: null,
    price: '75',
    originalPrice: null,
    features: JSON.stringify([
      '30-minute phone call',
      'Career strategy discussion',
      'Interview preparation tips',
      'Personalized advice'
    ]),
    active: 1,
    sortOrder: 32
  }
];

console.log('Seeding services...');
for (const service of services) {
  await db.insert(schema.services).values(service);
  console.log(`✓ Created: ${service.name}`);
}

console.log('\n✅ All services seeded successfully!');
await connection.end();
