'use server';

import { z } from 'zod';
import { generateShiftDetails } from '@/ai/flows/ai-shift-assistant';

const shiftGenerationSchema = z.object({
  date: z.date(),
  userId: z.string(),
});

export type FormState = {
  success: boolean;
  message: string;
  data?: {
    location: string;
    hours: number;
    pay: number;
    tasks: string;
  };
};

export async function getAIShiftSuggestion(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = shiftGenerationSchema.safeParse({
    date: new Date(formData.get('date') as string),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please select a user and a date.',
    };
  }
  
  const { date, userId } = validatedFields.data;

  try {
    const result = await generateShiftDetails({
      userId,
      date: date.toISOString(),
      orgId: 'acme-inc', // Mock organization ID
      teamId: 'team-alpha', // Mock team ID
    });
    
    return { success: true, message: 'Suggestion generated.', data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to generate AI suggestion. Please try again.',
    };
  }
}
