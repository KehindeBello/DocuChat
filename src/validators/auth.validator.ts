import { z } from 'zod'

export const registerSchema = z.object({
  body: z.object({
    email: z.email().transform(v => v.toLocaleLowerCase().trim()),
    name: z.string().min(1, 'Name is required'),
    password: z.string()
               .min(8, 'Password cannot be less than 8 characters')
               .max(128, 'Password cannot be more than 128 characters')
               .regex(/[A-Z]/, 'Must contain an uppercase letter')
               .regex(/[0-9]/, 'Must contain a digit') 
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1, 'Password is required')
  })
})

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token is required')
  })
})


export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshSchema>['body'];