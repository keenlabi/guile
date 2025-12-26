import zod from 'zod';

export const registrationSchema = zod.object({
  email: zod.email('Please enter a valid email address'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  agreeToTerms: zod.boolean().refine((val) => val === true, {
    message: 'You must agree to our terms and privacy policy to proceed',
  }),
});

export type RegistrationFormData = zod.infer<typeof registrationSchema>;