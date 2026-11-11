import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Quote } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { ContactForm } from "./_components/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
};

const contactDetails = [
  {
    icon: MapPin,
    title: "Headquarters",
    lines: ["25 HaCarmel Street", "Rosh HaAyin 48091", "Israel"],
  },
  { icon: Phone, title: "Phone", lines: ["+972-3-908-4444"] },
  { icon: Mail, title: "Email", lines: ["info@scodix.com"] },
  {
    icon: Clock,
    title: "Business Hours",
    lines: ["Sunday - Thursday", "9:00 AM - 6:00 PM (IST)"],
  },
];

const offices = [
  { region: "North America", city: "Chicago, IL, USA" },
  { region: "Europe", city: "Heidelberg, Germany" },
  { region: "Asia Pacific", city: "Shanghai, China" },
];

const testimonials = [
  {
    quote: "Scodix transformed our packaging from standard to stunning.",
    author: "Luxury Brand Group",
  },
  {
    quote: "Excellent service and unmatched quality. A real game-changer.",
    author: "PrintPro Europe",
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1 bg-muted/50 py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Contact Us</h1>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            Get in touch with our team to learn more about Scodix digital
            enhancement solutions and how they can transform your printing
            business.
          </p>
        </div>

        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-8">
              <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Get in Touch</h2>
                <ul className="space-y-4">
                  {contactDetails.map(({ icon: Icon, title, lines }) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon
                        aria-hidden
                        className="mt-1 size-5 shrink-0 text-blue-600"
                      />
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lines.map((line, i) => (
                            <span key={line}>
                              {i > 0 && <br />}
                              {line}
                            </span>
                          ))}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Global Offices</h2>
                <ul className="space-y-3">
                  {offices.map((office) => (
                    <li key={office.region}>
                      <p className="font-medium">{office.region}</p>
                      <p className="text-sm text-muted-foreground">
                        {office.city}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="rounded-lg bg-background p-4 sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from businesses that have transformed their printing with
              Scodix
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.author}
                className="h-full border-l-4 border-l-blue-600"
              >
                <CardContent className="p-6">
                  <Quote aria-hidden className="mb-4 size-8 text-blue-600" />
                  <blockquote className="mb-4 text-lg text-foreground/80 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <p className="font-semibold">{testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
