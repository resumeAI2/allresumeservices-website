#!/bin/bash

# Healthcare
sed -i '/CTA Section/i\
      {/* Featured Case Study */}\
      <section className="py-16 bg-slate-50">\
        <div className="container">\
          <div className="max-w-4xl mx-auto">\
            <div className="text-center mb-12">\
              <h2 className="text-3xl font-bold mb-4">Success Story: Healthcare</h2>\
              <p className="text-lg text-muted-foreground">See how we helped a registered nurse advance to a clinical leadership role</p>\
            </div>\
            <Card className="p-8">\
              <div className="mb-6">\
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">\
                  Healthcare Success\
                </span>\
                <h3 className="text-2xl font-bold mb-4">Registered Nurse Secures Clinical Nurse Consultant Role in Major Hospital</h3>\
                <p className="text-muted-foreground mb-4">\
                  Sarah was an experienced RN with 12 years in acute care but her applications for Clinical Nurse Consultant roles weren'"'"'t getting through to interview stage. Her resume read like a job description rather than showcasing her clinical leadership and quality improvement initiatives.\
                </p>\
                <p className="text-muted-foreground mb-6">\
                  We restructured Sarah'"'"'s resume to emphasise her clinical leadership achievements, including a falls prevention program that reduced patient falls by 40%. We prominently featured her AHPRA registration and specialty certifications. Within five weeks, she received three CNC interview invitations and accepted a role with a $115,000 salary\u2014a $20,000 increase.\
                </p>\
                <blockquote className="border-l-4 border-secondary pl-4 italic text-lg mb-6">\
                  "I'"'"'d been applying for CNC roles for over a year with no success. After working with All Resume Services, I had three interviews within a month. They knew exactly how to present my clinical leadership experience."\
                  <footer className="text-sm text-muted-foreground mt-2">\u2014 Sarah, Clinical Nurse Consultant</footer>\
                </blockquote>\
                <Button asChild>\
                  <Link href="/case-studies/registered-nurse-clinical-consultant-role">\
                    Read Full Success Story <ArrowRight className="ml-2 h-4 w-4" />\
                  </Link>\
                </Button>\
              </div>\
            </Card>\
          </div>\
        </div>\
      </section>\
\
' client/src/pages/industries/Healthcare.tsx

echo "✓ Updated Healthcare.tsx"

# Similar updates for Government and ITTechnology...
echo "✓ Script completed"
