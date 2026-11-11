import { describe, expect, it } from "vitest";

import { GET, POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/forms/contact", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
};

describe("GET /forms/contact", () => {
  it("returns the help options", async () => {
    const response = await GET();
    const { helpOptions } = await response.json();

    expect(response.status).toBe(200);
    expect(helpOptions).toContainEqual({
      value: "demo",
      label: "Request a demo",
    });
  });
});

describe("POST /forms/contact", () => {
  it("accepts a valid submission", async () => {
    const response = await post({ ...valid, help: "demo", country: "de" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  it("rejects missing required fields", async () => {
    const response = await post({});
    const { errors } = await response.json();

    expect(response.status).toBe(400);
    expect(Object.keys(errors).sort()).toEqual([
      "company",
      "email",
      "firstName",
      "lastName",
    ]);
  });

  it("rejects options that aren't on the list", async () => {
    const response = await post({ ...valid, help: "nope", country: "xx" });
    const { errors } = await response.json();

    expect(response.status).toBe(400);
    expect(Object.keys(errors).sort()).toEqual(["country", "help"]);
  });

  it("rejects a body that isn't JSON", async () => {
    const response = await post("not json");

    expect(response.status).toBe(400);
  });
});
