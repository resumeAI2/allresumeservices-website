import { describe, it, expect } from 'vitest';
import { getAllTestimonials, getTestimonialById } from './testimonials';

describe('Testimonials Service', () => {
  it('should fetch all approved testimonials from database', async () => {
    const testimonials = await getAllTestimonials(true, false);
    
    expect(testimonials).toBeDefined();
    expect(Array.isArray(testimonials)).toBe(true);
    expect(testimonials.length).toBeGreaterThan(0);
    
    // All should be approved
    testimonials.forEach(t => {
      expect(t.approved).toBe(1);
    });
  });

  it('should return testimonials with correct structure', async () => {
    const testimonials = await getAllTestimonials(true, false);
    
    expect(testimonials.length).toBeGreaterThan(0);
    
    const firstTestimonial = testimonials[0];
    expect(firstTestimonial).toHaveProperty('id');
    expect(firstTestimonial).toHaveProperty('clientName');
    expect(firstTestimonial).toHaveProperty('testimonialText');
    expect(firstTestimonial).toHaveProperty('rating');
    expect(firstTestimonial).toHaveProperty('serviceUsed');
    expect(firstTestimonial).toHaveProperty('approved');
    expect(firstTestimonial).toHaveProperty('featured');
  });

  it('should have imported testimonials from old website', async () => {
    const testimonials = await getAllTestimonials(true, false);
    
    // Should have at least 100 testimonials (we imported 107)
    expect(testimonials.length).toBeGreaterThanOrEqual(100);
    
    // Check for some known names from the import
    const names = testimonials.map(t => t.clientName);
    expect(names).toContain('R. Sipes');
    expect(names).toContain('Michael Goldenberg');
    expect(names).toContain('Jackson Misago');
  });

  it('should return all 5-star ratings', async () => {
    const testimonials = await getAllTestimonials(true, false);
    
    // All imported testimonials should be 5-star
    testimonials.forEach(t => {
      expect(t.rating).toBe(5);
    });
  });

  it('should fetch a single testimonial by ID', async () => {
    // First get all testimonials to get a valid ID
    const testimonials = await getAllTestimonials(true, false);
    expect(testimonials.length).toBeGreaterThan(0);
    
    const testId = testimonials[0].id;
    const testimonial = await getTestimonialById(testId);
    
    expect(testimonial).toBeDefined();
    expect(testimonial?.id).toBe(testId);
    expect(testimonial?.clientName).toBe(testimonials[0].clientName);
  });
});
