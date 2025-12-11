"use client";

import React, { useEffect, useState } from "react";

// These JSON files must be created by Manus:
// /data/full_reviews.json
// /data/featured_reviews.json
import fullReviewsData from "@/data/full_reviews.json";
import featuredData from "@/data/featured_reviews.json";

// ----------------------------------------------------------
// TYPES
// ----------------------------------------------------------

interface GoogleReview {
  name: string;
  rating: number;
  timeframe: string;
  review: string;
  tags: string[];
}

interface FeaturedList {
  featured_reviews: string[];
}

// ----------------------------------------------------------
// LOAD DATA
// ----------------------------------------------------------

const allReviews: GoogleReview[] = fullReviewsData.google_reviews || [];
const featuredReviews: string[] = featuredData.featured_reviews || [];

// ----------------------------------------------------------
// SORTING (Newest → Oldest based on timeframe text)
// ----------------------------------------------------------

const timeframeRank = (timeframe: string): number => {
  const t = timeframe.toLowerCase();

  if (t.includes("month")) {
    const num = parseInt(t);
    return num || 1;
  }
  if (t.includes("year")) {
    const num = parseInt(t);
    return (num || 1) * 12;
  }
  return 9999;
};

const sortedReviews = [...allReviews].sort(
  (a, b) => timeframeRank(a.timeframe) - timeframeRank(b.timeframe)
);

// ----------------------------------------------------------
// COMPONENT: TrustQuote (short inline testimonial)
// ----------------------------------------------------------

export const TrustQuote = ({ tag }: { tag?: string }) => {
  const filtered = tag
    ? sortedReviews.filter((r) => r.tags.includes(tag))
    : sortedReviews;

  const pick = filtered.length > 0 ? filtered[0] : null;

  if (!pick) return null;

  return (
    <div style={{ fontStyle: "italic", margin: "20px 0", fontSize: "1.1rem" }}>
      "{pick.review.substring(0, 180)}..."
      <br />
      <strong>- {pick.name}</strong>
    </div>
  );
};

// ----------------------------------------------------------
// COMPONENT: TestimonialSlider (homepage slider)
// ----------------------------------------------------------

export const TestimonialSlider = () => {
  const featured = sortedReviews.filter((r) =>
    featuredReviews.includes(r.name)
  );

  if (featured.length === 0) return null;

  return (
    <div style={{ margin: "40px 0" }}>
      <h2 style={{ marginBottom: "15px" }}>What Clients Say</h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px",
          padding: "10px 0",
        }}
      >
        {featured.map((rev, idx) => (
          <div
            key={idx}
            style={{
              minWidth: "320px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "white",
            }}
          >
            <p style={{ fontStyle: "italic" }}>
              "{rev.review.length > 280
                ? rev.review.substring(0, 280) + "..."
                : rev.review}"
            </p>
            <p>
              <strong>{rev.name}</strong>
            </p>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              {rev.timeframe} • ⭐ {rev.rating}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------
// COMPONENT: TestimonialsGrid (full reviews page)
// ----------------------------------------------------------

export const TestimonialsGrid = () => {
  return (
    <div style={{ margin: "40px 0" }}>
      <h2 style={{ marginBottom: "20px" }}>Google Reviews</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {sortedReviews.map((rev, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "white",
            }}
          >
            <p style={{ fontStyle: "italic" }}>
              "{rev.review.length > 380
                ? rev.review.substring(0, 380) + "..."
                : rev.review}"
            </p>

            <p style={{ marginTop: "10px" }}>
              <strong>{rev.name}</strong>
            </p>

            <p style={{ fontSize: "0.9rem", color: "#444" }}>
              {rev.timeframe} • ⭐ {rev.rating}
            </p>

            {rev.tags.length > 0 && (
              <div style={{ marginTop: "8px", fontSize: "0.8rem" }}>
                <strong>Tags:</strong> {rev.tags.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------
// EXPORT DEFAULT (OPTIONAL)
// ----------------------------------------------------------

export default function GoogleTestimonials() {
  return (
    <div>
      <TestimonialSlider />
      <TestimonialsGrid />
    </div>
  );
}
