"use server";

import { ClientError } from "graphql-request";
import { getGraphQLClient } from "@/lib/graphql-client";
import { registerSubscriberSchema } from "@/lib/validation/subscriber";

export type RegisterState = {
  errors?: Record<string, string[]>;
  success?: boolean;
};

export async function registerSubscriberAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const input = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    consent: formData.get("consent") === "on",
  };

  const parsed = registerSubscriberSchema.safeParse(input);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const client = await getGraphQLClient();

  try {
    await client.request(
      `mutation Register($input: RegisterSubscriberInput!) {
        registerSubscriber(input: $input) { id }
      }`,
      { input: parsed.data }
    );
  } catch (error) {
    if (error instanceof ClientError) {
      const code = (error.response.errors?.[0]?.extensions as { code?: string } | undefined)?.code;
      if (code === "DUPLICATE_EMAIL") {
        return { errors: { email: ["This email is already registered"] } };
      }
    }
    return { errors: { form: ["Something went wrong. Please try again."] } };
  }

  return { success: true };
}
