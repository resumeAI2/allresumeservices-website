import { Card, CardContent } from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Shared data shape accepted by the card                            */
/* ------------------------------------------------------------------ */
export type TestimonialCardData = {
  id: number;
  clientName: string;
  clientTitle?: string | null;
  clientPhoto?: string | null;
  rating: number;
  testimonialText: string;
  serviceUsed?: string | null;
  /** Manual outcome text, e.g. "+35% Salary". Displayed only when outcomeEnabled is true. */
  outcomeText?: string | null;
  /** Whether to show the outcome tag. Must be true AND outcomeText present. */
  outcomeEnabled?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
type TestimonialCardProps = {
  testimonial: TestimonialCardData;
  /**
   * "home"          – keeps coloured outcome ribbons & featured styling
   *                    (ribbonLabel / ribbonBg / isFeatured honoured)
   * "testimonials"  – uniform editorial cards; no featured, no coloured
   *                    outcomes; optional grey outcome tag when
   *                    outcomeEnabled + outcomeText
   */
  variant?: "home" | "testimonials";

  /* Home-variant extras (ignored when variant="testimonials") */
  ribbonLabel?: string;
  ribbonBg?: string;
  isFeatured?: boolean;

  /* Image error handling */
  onImageError?: (id: number) => void;
  imageLoadFailed?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Split text into a leading sentence and the rest, for emphasis. */
function splitLeadSentence(text: string): [string, string] {
  // Match the first sentence ending with . ! or ?
  const match = text.match(/^(.+?[.!?])\s+(.+)$/s);
  if (match) return [match[1], match[2]];
  return [text, ""];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function TestimonialCard({
  testimonial,
  variant = "home",
  ribbonLabel,
  ribbonBg,
  isFeatured = false,
  onImageError,
  imageLoadFailed = false,
}: TestimonialCardProps) {
  const isTestimonialsVariant = variant === "testimonials";

  /* Derive what to show based on variant */
  const showFeatured = variant === "home" && isFeatured;
  const showColouredRibbon = variant === "home" && !!ribbonLabel;
  const showGreyOutcome =
    isTestimonialsVariant &&
    testimonial.outcomeEnabled === true &&
    !!testimonial.outcomeText;

  const initials = testimonial.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* ---- Testimonials-variant: split lead sentence for emphasis ---- */
  const [leadSentence, restText] = isTestimonialsVariant
    ? splitLeadSentence(testimonial.testimonialText)
    : [testimonial.testimonialText, ""];

  /* ---- Card classes ---- */
  const cardClasses = isTestimonialsVariant
    ? // Testimonials page: faint border + gold left accent, editorial feel
      "relative overflow-hidden bg-white border border-gray-100 border-l-2 border-l-[#d4af37]/25 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
    : // Home page: existing behaviour
      `relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white ${
        showFeatured ? "border-2 border-[#d4af37] shadow-xl" : "border-0"
      }`;

  return (
    <Card className={cardClasses}>
      {/* ---- Featured badge (home variant only) ---- */}
      {showFeatured && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#1e3a5f] text-xs font-bold px-4 py-1 rounded-b-lg z-20">
          Featured Story
        </div>
      )}

      {/* ---- Coloured ribbon (home variant only) ---- */}
      {showColouredRibbon && (
        <div
          className={`absolute top-4 right-4 ${ribbonBg} text-white text-xs font-bold px-3 py-1 rounded-full z-20`}
        >
          {ribbonLabel}
        </div>
      )}

      {/* ---- Grey outcome tag (testimonials variant only) ---- */}
      {showGreyOutcome && (
        <div className="absolute top-4 right-4 bg-gray-50 text-gray-400 text-xs font-medium px-3 py-1 rounded-full border border-gray-200 z-20">
          {testimonial.outcomeText}
        </div>
      )}

      <CardContent
        className={
          showFeatured
            ? "pt-10 pb-6"
            : isTestimonialsVariant
              ? "pt-6 pb-6 px-6"
              : "pt-8 pb-6"
        }
      >
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={`star-${testimonial.id}-${i}`}
              className={`text-lg ${
                i < testimonial.rating ? "text-[#d4af37]" : "text-gray-300"
              }`}
            >
              &#9733;
            </span>
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-700 leading-relaxed mb-6">
          {isTestimonialsVariant ? (
            <>
              <span className="font-semibold text-[#1e3a5f]">
                &ldquo;{leadSentence}
              </span>
              {restText && (
                <>
                  {" "}
                  {restText}&rdquo;
                </>
              )}
              {!restText && <>&rdquo;</>}
            </>
          ) : (
            <>
              &ldquo;{testimonial.testimonialText}&rdquo;
            </>
          )}
        </blockquote>

        {/* Author */}
        <div
          className={`flex items-center gap-4 pt-4 border-t ${
            showFeatured ? "border-[#d4af37]/20" : "border-gray-100"
          }`}
        >
          {testimonial.clientPhoto && !imageLoadFailed ? (
            <img
              src={testimonial.clientPhoto}
              alt={testimonial.clientName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37]/20 flex-shrink-0"
              onError={() => onImageError?.(testimonial.id)}
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                showFeatured
                  ? "bg-gradient-to-br from-[#d4af37] to-[#b8860b]"
                  : "bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f]"
              }`}
            >
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">
              {testimonial.clientName}
            </p>
            {testimonial.clientTitle && (
              <p className="text-sm text-gray-500 truncate">
                {testimonial.clientTitle}
              </p>
            )}
          </div>

          {testimonial.serviceUsed && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-medium text-[#d4af37]">
                {testimonial.serviceUsed}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
