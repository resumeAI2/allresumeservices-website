import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  return (
    <section id="testimonials" className="pt-10 pb-20 bg-gradient-to-br from-[#1e3a5f]/5 via-white to-[#d4af37]/5">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">⭐</span>
            <span className="text-sm font-semibold text-[#1e3a5f]">5.0 Rating from 60+ Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1e3a5f]">
            Real Results, Real People
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it—see what our clients have to say about their experience and results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            {/* Highlight ribbon */}
            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              +35% Salary
            </div>
            <CardContent className="pt-8 pb-6">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={`star-sarah-${i}`} className="text-lg text-[#d4af37]">&#9733;</span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                &ldquo;I was stuck in the same role for 5 years. After using their Executive Package, I received <span className="font-semibold text-[#1e3a5f]">4 interview requests in 3 weeks</span> and landed a senior position with a <span className="font-semibold text-green-600">35% salary increase</span>. The investment paid for itself many times over! 🎉&rdquo;
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">SM</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#d4af37]">Executive Package</p>
                  <p className="text-xs text-gray-400">Healthcare</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 2 - Featured */}
          <Card className="relative overflow-hidden border-2 border-[#d4af37] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            {/* Featured badge */}
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#1e3a5f] text-xs font-bold px-4 py-1 rounded-b-lg">
              Featured Story
            </div>
            {/* Highlight ribbon */}
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Fortune 500
            </div>
            <CardContent className="pt-10 pb-6">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={`star-james-${i}`} className="text-lg text-[#d4af37]">&#9733;</span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                &ldquo;As a career changer moving from engineering to IT management, I needed a resume that highlighted transferable skills. <span className="font-semibold text-[#1e3a5f]">The team nailed it!</span> I secured my dream role at a <span className="font-semibold text-blue-600">Fortune 500 company</span> within 6 weeks. 💼&rdquo;
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#d4af37]/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">JK</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">James K.</p>
                  <p className="text-sm text-gray-500">IT Project Manager</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#d4af37]">Career Change</p>
                  <p className="text-xs text-gray-400">IT & Technology</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial 3 */}
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
            {/* Highlight ribbon */}
            <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              3 Interviews
            </div>
            <CardContent className="pt-8 pb-6">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={`star-lisa-${i}`} className="text-lg text-[#d4af37]">&#9733;</span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed mb-6">
                &ldquo;After struggling to get interviews for months with my old resume, I decided to invest in professional help. Within <span className="font-semibold text-purple-600">two weeks, I secured three interviews</span> and ultimately landed my dream role in mining technology. <span className="font-semibold text-[#1e3a5f]">Worth every dollar!</span> 💎&rdquo;
              </blockquote>
              
              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">LT</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Lisa T.</p>
                  <p className="text-sm text-gray-500">Operations Supervisor</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#d4af37]">Standard Package</p>
                  <p className="text-xs text-gray-400">Mining & Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Real Client Results</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>96% Success Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
