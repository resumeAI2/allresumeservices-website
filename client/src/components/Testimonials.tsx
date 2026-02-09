import { Star, Quote } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Testimonials() {
  // Fetch testimonials from database (featured and approved only)
  const { data: dbTestimonials } = trpc.testimonials.getAll.useQuery({
    approvedOnly: true,
    featuredOnly: true,
  });

  // Fallback testimonials if none in database
  const fallbackTestimonials = [
    {
      name: "Sarah M.",
      role: "Marketing Manager",
      content: "I was struggling to get interviews despite having 10+ years of experience. After working with All Résumé Services, I received 3 interview invitations within 2 weeks! The ATS optimisation made all the difference.",
      rating: 5,
      photo: undefined,
    },
    {
      name: "James T.",
      role: "Software Engineer",
      content: "The team understood exactly what tech recruiters look for. My new resume highlights my achievements perfectly, and I landed my dream role at a top tech company. Worth every dollar!",
      rating: 5,
      photo: undefined,
    },
    {
      name: "Emily R.",
      role: "HR Professional",
      content: "As someone who reviews resumes daily, I can confidently say the quality of work from All Résumé Services is exceptional. Professional, polished, and results-driven. Highly recommend!",
      rating: 5,
      photo: undefined,
    },
    {
      name: "Michael K.",
      role: "Project Manager",
      content: "Working with All Résumé Services gave me peace of mind. We collaborated until every detail was perfect. The LinkedIn profile optimisation was a bonus that really boosted my visibility.",
      rating: 5,
      photo: undefined,
    },
    {
      name: "Lisa W.",
      role: "Career Changer",
      content: "Transitioning careers felt overwhelming, but the team helped me reframe my experience beautifully. I got my first interview in my new field within a month. Thank you!",
      rating: 5,
      photo: undefined,
    },
    {
      name: "David P.",
      role: "Executive Leader",
      content: "After 20 years in leadership, I needed a resume that reflected my strategic impact. The premium package delivered exactly that—sophisticated, compelling, and interview-winning.",
      rating: 5
    }
  ];

  // Use database testimonials if available, otherwise use fallback
  const testimonials = dbTestimonials && dbTestimonials.length > 0 
    ? dbTestimonials.map(t => ({
        name: t.clientName,
        role: t.clientTitle || "Satisfied Client",
        content: t.testimonialText,
        rating: t.rating,
        photo: t.clientPhoto,
      }))
    : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Success Stories from <span className="font-gold-brand">Our Clients</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it—see what our clients have to say about their experience and results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-secondary/20" />
              
              {/* Header with logo and name */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {testimonial.rating === 5 ? (
                    <div className="rounded-lg shadow-sm">
                      <img 
                        src="/5-star-logo.png" 
                        alt="5 Star Rating" 
                        className="h-16 w-16 object-contain animate-in fade-in duration-700"
                      />
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-2 border-primary/20 bg-primary/80 flex items-center justify-center relative">
                  {testimonial.photo && (
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-white">
                    {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              <p className="text-primary leading-relaxed font-medium">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-primary mb-4 font-medium">
            Join hundreds of satisfied clients who've transformed their careers
          </p>
        </div>
      </div>
    </section>
  );
}
