import * as z from 'zod'

export const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  purpose: z
    .string()
    .min(3, 'The purpose must be at least 3 characters')
    .max(400, 'The purpose must be less than 400 characters'),
  investment: z
    .string()
    .min(3, 'The purpose must be at least 3 characters')
    .max(400, 'The purpose must be less than 400 characters'),
  benefits: z
    .string()
    .min(3, 'The purpose must be at least 3 characters')
    .max(400, 'The purpose must be less than 400 characters'),
  location: z
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(400, 'Location must be less than 400 characters'),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isProbono: z.boolean(),
  url: z.string().url(),
})
