import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string({ required_error: "This field is required" })
    .min(1, "This field is required"),
  description: z.string({ required_error: "This field is required" }),
  status: z.enum(["To Do", "In Progress", "Done"]),
  dueDate: z.any(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
