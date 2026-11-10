import "server-only";

// The only module that reads process.env. Values are validated when this
// module is first imported, and the build fails if a Client Component imports
// it. Pass values to Client Components as props.
//
// To add a variable, read and validate it below, then add it to .env.example:
//   DATABASE_URL: required("DATABASE_URL"),

const NODE_ENVS = ["development", "production", "test"] as const;
type NodeEnv = (typeof NODE_ENVS)[number];

function oneOf<T extends string>(
  name: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = process.env[name] ?? fallback;
  if (!allowed.includes(value as T)) {
    throw new Error(
      `Invalid environment variable ${name}="${value}". Expected one of: ${allowed.join(", ")}`,
    );
  }
  return value as T;
}

export const env = {
  NODE_ENV: oneOf<NodeEnv>("NODE_ENV", NODE_ENVS, "development"),
} as const;
