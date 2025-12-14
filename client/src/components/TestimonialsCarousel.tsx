import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company?: string;
  text: string;
  rating: number;
  photo?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function TestimonialsCarousel({ 
  testimonials, 
  autoRotate = true, 
  rotateInterval = 5000 
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="border-2 border-[#d4af37]/20 shadow-lg">
        <CardContent className="p-8 md:p-12">
          {/* Header with Rating and Name */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {currentTestimonial.rating === 5 ? (
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <img 
                    src="/5-star-logo.png" 
                    alt="5 Star Rating" 
                    className="h-20 w-20 object-contain animate-in fade-in duration-700"
                  />
                </div>
              ) : (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${
                        i < currentTestimonial.rating ? 'text-[#d4af37]' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              <div>
                <p className="font-bold text-[#1e3a5f] text-lg">{currentTestimonial.name}</p>
                <p className="text-gray-600 text-sm">
                  {currentTestimonial.role}
                  {currentTestimonial.company && ` • ${currentTestimonial.company}`}
                </p>
              </div>
            </div>
            {currentTestimonial.photo ? (
              <img
                src={currentTestimonial.photo}
                alt={currentTestimonial.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 flex items-center justify-center border-2 border-[#d4af37]/30">
                <span className="text-[#d4af37] font-bold text-xl">
                  {currentTestimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Quote Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
              <Quote className="h-8 w-8 text-[#d4af37]" />
            </div>
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-lg md:text-xl text-gray-700 text-center leading-relaxed min-h-[120px] flex items-center justify-center">
            "{currentTestimonial.text}"
          </blockquote>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 border border-gray-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-[#1e3a5f]" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all hover:scale-110 border border-gray-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-[#1e3a5f]" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#d4af37] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
