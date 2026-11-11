import { describe, expect, it } from "vitest";

import { emptyContactForm, validateContact } from "./contact";

const valid = {
  ...emptyContactForm,
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
};

describe("validateContact", () => {
  it("requires first name, last name, email and company only", () => {
    expect(Object.keys(validateContact(emptyContactForm)).sort()).toEqual([
      "company",
      "email",
      "firstName",
      "lastName",
    ]);
  });

  it("accepts a form with only the required fields filled", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("treats whitespace as empty", () => {
    expect(validateContact({ ...valid, company: "   " })).toEqual({
      company: "This field is required.",
    });
  });

  it("rejects a malformed email", () => {
    expect(validateContact({ ...valid, email: "ada@" })).toEqual({
      email: "Enter a valid email address.",
    });
  });
});
