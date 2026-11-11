"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  countries,
  emptyContactForm,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactFormValues,
  type ContactOption,
} from "@/lib/contact";

const ENDPOINT = "/forms/contact";

type HelpOptions =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; options: ContactOption[] };

type SubmitStatus = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [help, setHelp] = useState<HelpOptions>({ status: "loading" });
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    const controller = new AbortController();

    fetch(ENDPOINT, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ helpOptions: ContactOption[] }>;
      })
      .then(({ helpOptions }) =>
        setHelp({ status: "ready", options: helpOptions }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setHelp({ status: "error" });
      });

    return () => controller.abort();
  }, []);

  function update<F extends ContactField>(
    field: F,
    value: ContactFormValues[F],
  ) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitStatus === "sent" || submitStatus === "error") {
      setSubmitStatus("idle");
    }
    // A field marked invalid stays red until its value is valid.
    if (errors[field]) {
      setErrors({ ...errors, [field]: validateContact(next)[field] });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateContact(values);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitStatus("submitting");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        setValues(emptyContactForm);
        setSubmitStatus("sent");
        return;
      }
      const body = (await response.json().catch(() => ({}))) as {
        errors?: ContactErrors;
      };
      if (body.errors) setErrors(body.errors);
      setSubmitStatus("error");
    } catch {
      setSubmitStatus("error");
    }
  }

  const text = (field: Exclude<ContactField, "agreeTerms">) => ({
    id: field,
    name: field,
    value: values[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => update(field, event.target.value),
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field id="firstName" label="First Name" required errors={errors}>
          <Input
            {...text("firstName")}
            autoComplete="given-name"
            placeholder="Your first name"
            aria-required
          />
        </Field>
        <Field id="lastName" label="Last Name" required errors={errors}>
          <Input
            {...text("lastName")}
            autoComplete="family-name"
            placeholder="Your last name"
            aria-required
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="email" label="Email" required errors={errors}>
          <Input
            {...text("email")}
            type="email"
            autoComplete="email"
            placeholder="your.email@company.com"
            aria-required
          />
        </Field>
        <Field id="phone" label="Phone" errors={errors}>
          <Input
            {...text("phone")}
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 123-4567"
          />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="company" label="Company" required errors={errors}>
          <Input
            {...text("company")}
            autoComplete="organization"
            placeholder="Your company name"
            aria-required
          />
        </Field>
        <Field id="country" label="Country" errors={errors}>
          <Select
            name="country"
            items={countries}
            value={values.country || null}
            onValueChange={(value) => update("country", value ?? "")}
          >
            <SelectTrigger
              id="country"
              className="w-full"
              aria-invalid={errors.country ? true : undefined}
            >
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field id="help" label="How can we help you?" errors={errors}>
        <Select
          name="help"
          items={help.status === "ready" ? help.options : []}
          value={values.help || null}
          onValueChange={(value) => update("help", value ?? "")}
          disabled={help.status !== "ready"}
        >
          <SelectTrigger
            id="help"
            className="w-full"
            aria-invalid={errors.help ? true : undefined}
          >
            <SelectValue
              placeholder={
                help.status === "loading"
                  ? "Loading options…"
                  : help.status === "error"
                    ? "Options unavailable"
                    : "Select an option"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {help.status === "ready" &&
              help.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {help.status === "error" && (
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn&apos;t load these options. Refresh the page to try again.
          </p>
        )}
      </Field>

      <Field id="message" label="Message" errors={errors}>
        <Textarea
          {...text("message")}
          rows={5}
          className="min-h-28"
          placeholder="Tell us more about your needs and how we can help you..."
        />
      </Field>

      <Label className="items-start gap-3 leading-normal font-normal text-muted-foreground">
        <Checkbox
          name="agreeTerms"
          className="mt-0.5"
          checked={values.agreeTerms}
          onCheckedChange={(checked) => update("agreeTerms", checked)}
          aria-labelledby="agreeTerms-label"
        />
        <span id="agreeTerms-label">
          I agree to receive communications from Scodix and understand that I
          can unsubscribe at any time.
        </span>
      </Label>

      <Button
        type="submit"
        disabled={submitStatus === "submitting"}
        className="h-auto w-full bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-700"
      >
        {submitStatus === "submitting" ? "Sending…" : "Send"}
      </Button>

      <div aria-live="polite">
        {submitStatus === "sent" && (
          <p className="flex items-center gap-2 text-sm text-green-700">
            <CircleCheck className="size-4" />
            Thanks! Your message has been sent. We&apos;ll be in touch soon.
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-sm text-destructive">
            We couldn&apos;t send your message. Check the form and try again.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  errors,
  children,
}: {
  id: ContactField;
  label: string;
  required?: boolean;
  errors: ContactErrors;
  children: ReactNode;
}) {
  const message = errors[id];

  return (
    <div>
      <Label
        htmlFor={id}
        className={cn("mb-2 text-foreground/80", message && "text-destructive")}
      >
        {required ? `${label} *` : label}
      </Label>
      {children}
      {message && (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
