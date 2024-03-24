import z from "zod";

export const terminalLoginFormSchema = z.object({
  termId: z.string(),
  sicilNo: z.number(),
  password: z.string().optional(),
  montajNo: z.number().optional(),
  tarih: z.string().optional(),
  shiftId: z.number().optional(),
});

export type TerminalLoginForm = z.infer<typeof terminalLoginFormSchema>;
