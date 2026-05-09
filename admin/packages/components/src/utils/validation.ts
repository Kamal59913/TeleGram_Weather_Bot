import { z } from "zod";

export const validationUtils = {
  name: (fieldName: string) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please enter ${fieldName} name`,
        });
        return;
      }

      if (/^\d+$/.test(trimmedVal)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please enter a valid ${fieldName} name which contains characters`,
        });
        return;
      }

      if (trimmedVal.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "string",
          inclusive: true,
          message: `Please enter a ${fieldName} name with at least 3 characters`,
        });
      }

      if (trimmedVal.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: 100,
          type: "string",
          inclusive: true,
          message: `Please enter a ${fieldName} name with no more than 100 characters`,
        });
      }
    }),

  customName: (fieldName: string, minLength: number, maxLength: number) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please enter ${fieldName} name`,
        });
        return;
      }

      if (/^\d+$/.test(trimmedVal)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please enter a valid ${fieldName} name which contains characters`,
        });
        return;
      }

      if (trimmedVal.length < minLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: minLength,
          type: "string",
          inclusive: true,
          message: `Please enter a ${fieldName} name with at least ${minLength} characters`,
        });
      }

      if (trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: maxLength,
          type: "string",
          inclusive: true,
          message: `Please enter a ${fieldName} name with no more than ${maxLength} characters`,
        });
      }
    }),

  email: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} email`)
      .max(150, "Please enter an email with no more than 150 characters")
      .email(`Please enter a valid ${fieldName} email`)
      .refine(
        (email) => {
          const disposableDomains = ["tempmail.com", "throwaway.com", "mailinator.com"];
          const parts = email.split("@");
          const domain = parts[1];
          return domain !== undefined && !disposableDomains.includes(domain);
        },
        { message: `Please use a non-disposable ${fieldName} email address` }
      )

      .refine(
        (email) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(email);
        },
        { message: `${fieldName} email format is invalid` }
      )
      .transform((email) => email.toLowerCase().trim()),

  phone: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} phone number`)
      .refine(
        (val) => {
          return /^\+?[\d\s\-()]+$/.test(val);
        },
        {
          message: `${fieldName} phone number can only contain digits, spaces, dashes, parentheses, and an optional + at the beginning`,
        }
      )
      .refine(
        (val) => {
          const plusCount = (val.match(/\+/g) || []).length;
          return plusCount === 0 || (plusCount === 1 && val.startsWith("+"));
        },
        {
          message: `The + symbol can only appear at the beginning of the ${fieldName} phone number`,
        }
      )
      .refine(
        (val) => {
          const digitsOnly = val.replace(/\D/g, "");
          return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        },
        {
          message: `${fieldName} phone number must contain between 7 and 15 digits`,
        }
      )
      .transform((val) => {
        const startsWithPlus = val.startsWith("+");
        const digitsOnly = val.replace(/\D/g, "");
        return startsWithPlus ? `+${digitsOnly}` : digitsOnly;
      }),

  password: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} password`)
      .min(7, `${fieldName} password must be at least 7 characters`)
      .refine((val) => /[A-Z]/.test(val), {
        message: `${fieldName} password must include at least one uppercase letter`,
      })
      .refine((val) => /[a-z]/.test(val), {
        message: `${fieldName} password must include at least one lowercase letter`,
      })
      .refine((val) => /\d/.test(val), {
        message: `${fieldName} password must include at least one number`,
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: `${fieldName} password must include at least one special character`,
      }),

  date: (fieldName: string) =>
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName} date format is invalid, use YYYY-MM-DD`),


  uuid: (fieldName: string) =>
    z.string().uuid(`${fieldName} UUID format is invalid`),

  requiredString: (fieldName: string, errorMessage: string = `Please enter ${fieldName}`) =>
    z.string().min(1, errorMessage),


  dateOfBirth: (
    name: string,
    options: {
      isFutureDateAllowed?: boolean;
      isPastDateAllowed?: boolean;
      minAge?: number;
      maxAge?: number;
    } = {}
  ) => {
    // Set default values
    const {
      isFutureDateAllowed = false,
      isPastDateAllowed = true,
      minAge = 0,
      maxAge = 110
    } = options;

    // Create a schema that handles all validations at once
    return z.preprocess(
      (val) => (val === null || val === undefined ? null : new Date(val as string)),
      z.date().nullable().superRefine((val, ctx) => {
        // Basic date validation
        if (val === null || isNaN(val.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please enter a valid date of birth for ${name}`,
          });
          return;
        }

        // Future date validation
        if (!isFutureDateAllowed && val > new Date()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please ensure date of birth is not in the future for ${name}`,
          });
        }

        // Age range validation
        if (minAge > 0 || maxAge < Infinity) {
          const today = new Date();
          let age = today.getFullYear() - val.getFullYear();
          const monthDiff = today.getMonth() - val.getMonth();

          // Adjust age if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < val.getDate())) {
            age--;
          }

          const isAboveMinAge = minAge <= 0 || age >= minAge;
          const isBelowMaxAge = maxAge >= Infinity || age <= maxAge;

          if (!isAboveMinAge || !isBelowMaxAge) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: minAge > 0 && maxAge < Infinity
                ? `Please ensure ${name} is between ${minAge} and ${maxAge} years old`
                : minAge > 0
                  ? `Please ensure ${name} is at least ${minAge} years old`
                  : `Please ensure ${name} is not older than ${maxAge} years old`
            });
          }
        }

        // Past date validation
        if (!isPastDateAllowed) {
          const currentDate = new Date();
          const minDate = new Date();
          minDate.setFullYear(currentDate.getFullYear() - maxAge);

          if (val < minDate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Please ensure date of birth is not earlier than ${minDate.getFullYear()} for ${name}`
            });
          }
        }
      })
    );
  },


};

export default validationUtils;