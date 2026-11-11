import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./contact-form";

const helpOptions = [
  { value: "demo", label: "Request a demo" },
  { value: "quote", label: "Get a quote" },
];

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockImplementation(async (_input, init) =>
    init?.method === "POST"
      ? Response.json({ ok: true })
      : Response.json({ helpOptions }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("ContactForm", () => {
  it("renders every field and a Send button", () => {
    render(<ContactForm />);

    for (const label of [
      "First Name *",
      "Last Name *",
      "Email *",
      "Phone",
      "Company *",
      "Country",
      "How can we help you?",
      "Message",
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("checkbox", { name: /I agree to receive/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("loads the help options from /forms/contact", async () => {
    render(<ContactForm />);

    expect(fetchMock).toHaveBeenCalledWith(
      "/forms/contact",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    const trigger = screen.getByLabelText("How can we help you?");
    await waitFor(() => expect(trigger).toHaveTextContent("Select an option"));

    fireEvent.click(trigger);
    expect(
      await screen.findByRole("option", { name: "Request a demo" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Get a quote" })).toBeVisible();
  });

  it("says so when the help options can't be loaded", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    render(<ContactForm />);

    expect(
      await screen.findByText(/couldn.t load these options/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("How can we help you?")).toHaveTextContent(
      "Options unavailable",
    );
  });

  it("marks only the empty required fields red and doesn't send", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    for (const label of [
      "First Name *",
      "Last Name *",
      "Email *",
      "Company *",
    ]) {
      expect(screen.getByLabelText(label)).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    }
    for (const label of ["Phone", "Message"]) {
      expect(screen.getByLabelText(label)).not.toHaveAttribute("aria-invalid");
    }
    expect(screen.getAllByText("This field is required.")).toHaveLength(4);
    expect(screen.getByLabelText("First Name *")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalledWith(
      "/forms/contact",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("keeps a field red until it is filled in", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    const firstName = screen.getByLabelText("First Name *");
    fill("First Name *", "  ");
    expect(firstName).toHaveAttribute("aria-invalid", "true");

    fill("First Name *", "Ada");
    expect(firstName).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Last Name *")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("sends a valid form to /forms/contact", async () => {
    render(<ContactForm />);
    fill("First Name *", "Ada");
    fill("Last Name *", "Lovelace");
    fill("Email *", "ada@example.com");
    fill("Company *", "Analytical Engines");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(
      await screen.findByText(/Your message has been sent/),
    ).toBeInTheDocument();
    const [, init] = fetchMock.mock.calls.find(
      ([, init]) => init?.method === "POST",
    )!;
    expect(JSON.parse(init!.body as string)).toMatchObject({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
    });
    expect(screen.getByLabelText("First Name *")).toHaveValue("");
  });
});
