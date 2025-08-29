// ai-shift-assistant.ts
'use server';

/**
 * @fileOverview An AI assistant that can pre-populate shift details based on historical data and user roles.
 *
 * - generateShiftDetails - A function that generates shift details.
 * - GenerateShiftDetailsInput - The input type for the generateShiftDetails function.
 * - GenerateShiftDetailsOutput - The return type for the generateShiftDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShiftDetailsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom the shift is being created.'),
  teamId: z.string().optional().describe('The ID of the team the user belongs to, if applicable.'),
  orgId: z.string().describe('The ID of the organization the user and team belong to.'),
  date: z.string().describe('The date for which the shift is being created (ISO format).'),
});

export type GenerateShiftDetailsInput = z.infer<typeof GenerateShiftDetailsInputSchema>;

const GenerateShiftDetailsOutputSchema = z.object({
  location: z.string().describe('The location of the shift.'),
  hours: z.number().describe('The expected hours for the shift.'),
  pay: z.number().describe('The estimated pay for the shift.'),
  tasks: z.string().describe('A description of the tasks to be performed during the shift.'),
});

export type GenerateShiftDetailsOutput = z.infer<typeof GenerateShiftDetailsOutputSchema>;

export async function generateShiftDetails(input: GenerateShiftDetailsInput): Promise<GenerateShiftDetailsOutput> {
  return generateShiftDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShiftDetailsPrompt',
  input: {schema: GenerateShiftDetailsInputSchema},
  output: {schema: GenerateShiftDetailsOutputSchema},
  prompt: `You are an AI assistant for shift managers.
  Your task is to pre-populate shift details based on historical data and user roles.
  Consider the user's past shifts, their team, and the organization's common practices.
  Provide the location, expected hours and pay, and a description of tasks to be performed.

  User ID: {{{userId}}}
  Team ID: {{{teamId}}}
  Organization ID: {{{orgId}}}
  Date: {{{date}}}

  Please generate the shift details in JSON format.`,
});

const generateShiftDetailsFlow = ai.defineFlow(
  {
    name: 'generateShiftDetailsFlow',
    inputSchema: GenerateShiftDetailsInputSchema,
    outputSchema: GenerateShiftDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
