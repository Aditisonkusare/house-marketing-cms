import { z } from "zod";

export const registerSubscriberSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  consent: z.boolean().refine((value) => value === true, {
    message: "You must consent to be contacted",
  }),
});

export type RegisterSubscriberInput = z.infer<typeof registerSubscriberSchema>;
