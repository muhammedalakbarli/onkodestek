import { z } from "zod";

export const ApplySchema = z.object({
  fullName:      z.string().min(2).max(120),
  age:           z.string().regex(/^\d{1,3}$/).optional().or(z.literal("")),
  diagnosis:     z.string().min(2).max(300),
  hospitalName:  z.string().max(200).optional().or(z.literal("")),
  contactPhone:  z.string().min(6).max(30),
  story:         z.string().max(2000).optional().or(z.literal("")),
  goalAmount:    z.string().regex(/^\d+(\.\d{1,2})?$/),
  applicantName: z.string().max(120).optional().or(z.literal("")),
  relation:      z.string().max(60).optional().or(z.literal("")),
  documentUrl:   z.string().url().optional().or(z.literal("")),
  _trap:         z.string().optional(),
});

const PATIENT_STATUS = ["pending", "verified", "active", "funded", "closed"] as const;

export const PatientCreateSchema = z.object({
  fullName:        z.string().min(2).max(120),
  age:             z.number().int().min(0).max(130).nullable().optional(),
  diagnosis:       z.string().min(2).max(300),
  hospitalName:    z.string().max(200).nullable().optional(),
  contactPhone:    z.string().max(30).nullable().optional(),
  story:           z.string().max(2000).nullable().optional(),
  goalAmount:      z.string().regex(/^\d+(\.\d{1,2})?$/),
  status:          z.enum(PATIENT_STATUS).optional(),
  isPublic:        z.boolean().optional(),
  trackId:         z.string().max(20).nullable().optional(),
  documentUrl:     z.string().url().nullable().optional(),
  photoUrl:        z.string().url().nullable().optional(),
});

export const PatientPatchSchema = z.object({
  fullName:        z.string().min(2).max(120).optional(),
  age:             z.number().int().min(0).max(130).nullable().optional(),
  diagnosis:       z.string().min(2).max(300).optional(),
  hospitalName:    z.string().max(200).nullable().optional(),
  contactPhone:    z.string().max(30).nullable().optional(),
  story:           z.string().max(2000).nullable().optional(),
  goalAmount:      z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  collectedAmount: z.string().optional(),
  status:          z.enum(PATIENT_STATUS).optional(),
  isPublic:        z.boolean().optional(),
  trackId:         z.string().max(20).nullable().optional(),
  documentUrl:     z.string().url().nullable().optional().or(z.literal("")),
  photoUrl:        z.string().url().nullable().optional().or(z.literal("")),
}).strict();

const TX_TYPE     = ["donation", "expense"] as const;
const TX_CATEGORY = ["medication", "treatment", "consultation", "transport", "other"] as const;

export const TransactionCreateSchema = z.object({
  patientId:       z.number().int().positive(),
  type:            z.enum(TX_TYPE),
  amount:          z.string().regex(/^\d+(\.\d{1,2})?$/),
  category:        z.enum(TX_CATEGORY).nullable().optional(),
  description:     z.string().max(500).nullable().optional(),
  donorName:       z.string().max(120).nullable().optional(),
  donorTelegramId: z.string().max(30).nullable().optional(),
  isAnonymous:     z.boolean().optional(),
  receiptUrl:      z.string().url().nullable().optional().or(z.literal("")),
}).strict();
