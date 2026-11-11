import {
  countries,
  emptyContactForm,
  getContactHelpOptions,
  validateContact,
  type ContactErrors,
  type ContactFormValues,
} from "@/lib/contact";

// The options for the "How can we help you?" field on /contact.
export async function GET() {
  const helpOptions = await getContactHelpOptions();

  return Response.json({ helpOptions });
}

// Validates a contact form submission. Nothing is stored or sent yet.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const values = toContactFormValues(body);
  const errors: ContactErrors = validateContact(values);

  const helpOptions = await getContactHelpOptions();
  if (values.help && !helpOptions.some((o) => o.value === values.help)) {
    errors.help = "Choose one of the listed options.";
  }
  if (values.country && !countries.some((c) => c.value === values.country)) {
    errors.country = "Choose one of the listed countries.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  return Response.json({ ok: true });
}

function toContactFormValues(body: unknown): ContactFormValues {
  const input =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const text = (key: keyof ContactFormValues) => {
    const value = input[key];
    return typeof value === "string" ? value : "";
  };

  return {
    ...emptyContactForm,
    firstName: text("firstName"),
    lastName: text("lastName"),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    country: text("country"),
    help: text("help"),
    message: text("message"),
    agreeTerms: input.agreeTerms === true,
  };
}
