import * as Joi from 'joi';

export interface EnvironmentVariables {
   PORT: number;
   APP_URL: string;
   TRANSBANK_ENVIRONMENT: 'integration' | 'production';
   TRANSBANK_COMMERCE_CODE?: string;
   TRANSBANK_API_KEY?: string;
}

export const environmentsSchema = Joi.object<EnvironmentVariables>({
   PORT: Joi.number().port().default(3000),
   APP_URL: Joi.string().uri().required(),
   TRANSBANK_ENVIRONMENT: Joi.string().valid('integration', 'production').default('integration'),
   TRANSBANK_COMMERCE_CODE: Joi.string().when('TRANSBANK_ENVIRONMENT', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
   }),
   TRANSBANK_API_KEY: Joi.string().when('TRANSBANK_ENVIRONMENT', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional(),
   }),
});

// Validates and normalizes environment variables at application startup
export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
   const { error, value } = environmentsSchema.validate(config, {
      abortEarly: false,
      allowUnknown: true,
   });

   if (error) {
      throw new Error(`Environment validation failed: ${error.message}`);
   }

   return value;
}
