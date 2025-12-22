import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * BlogFAQSchema component adds JSON-LD FAQPage structured data to blog posts
 * This helps blog posts appear in Google's "People Also Ask" sections and featured snippets
 */
export function BlogFAQSchema({ faqs }: BlogFAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
