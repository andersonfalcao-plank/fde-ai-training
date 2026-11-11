// Contact form data and validation, shared by the /contact page (in the
// browser) and the /forms/contact route handler (on the server).

export type ContactOption = { value: string; label: string };

export type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  help: string;
  message: string;
  agreeTerms: boolean;
};

export type ContactField = keyof ContactFormValues;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "company",
] as const satisfies readonly ContactField[];

export const emptyContactForm: ContactFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  help: "",
  message: "",
  agreeTerms: false,
};

export const countries: ContactOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "other", label: "Other" },
];

const helpOptions: ContactOption[] = [
  { value: "demo", label: "Request a demo" },
  { value: "quote", label: "Get a quote" },
  { value: "support", label: "Technical support" },
  { value: "partnership", label: "Partnership inquiry" },
  { value: "other", label: "Other" },
];

// Served by GET /forms/contact; the form loads them from there.
export async function getContactHelpOptions(): Promise<ContactOption[]> {
  return helpOptions;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactFormValues): ContactErrors {
  const errors: ContactErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!values[field].trim()) {
      errors[field] = "This field is required.";
    }
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}
