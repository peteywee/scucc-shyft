'use client';

import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAIShiftSuggestion, type FormState } from '../actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

const shiftFormSchema = z.object({
  userId: z.string({ required_error: 'Please select an employee.' }),
  date: z.date({ required_error: 'Please select a date.' }),
  location: z.string().min(1, 'Location is required.'),
  hours: z.coerce.number().min(0.5, 'Hours must be at least 0.5.'),
  pay: z.coerce.number().min(0, 'Pay cannot be negative.'),
  tasks: z.string().min(1, 'Tasks description is required.'),
});

type ShiftFormValues = z.infer<typeof shiftFormSchema>;

const employees = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' },
  { id: 'user-3', name: 'Michael Johnson' },
];

const initialState: FormState = {
  success: false,
  message: '',
};

function AISuggestionButton({
  userId,
  date,
}: {
  userId?: string;
  date?: Date;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="outline"
      size="sm"
      disabled={pending || !userId || !date}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Autofill with AI
    </Button>
  );
}

export function CreateShiftForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [aiState, formAction] = useFormState(getAIShiftSuggestion, initialState);

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      location: '',
      hours: 8,
      pay: 0,
      tasks: '',
    },
  });
  
  const watchedUserId = form.watch('userId');
  const watchedDate = form.watch('date');

  useEffect(() => {
    if (aiState.message) {
       toast({
        title: aiState.success ? 'Success' : 'Error',
        description: aiState.message,
        variant: aiState.success ? 'default' : 'destructive',
      });
    }
    if (aiState.success && aiState.data) {
      form.setValue('location', aiState.data.location);
      form.setValue('hours', aiState.data.hours);
      form.setValue('pay', aiState.data.pay);
      form.setValue('tasks', aiState.data.tasks);
    }
  }, [aiState, form, toast]);


  const onSubmit = (values: ShiftFormValues) => {
    console.log(values);
    toast({
      title: 'Shift Created',
      description: `A new shift for ${
        employees.find((e) => e.id === values.userId)?.name
      } has been created.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Shift
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new shift.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <form action={formAction} className="mt-8">
                <input type="hidden" name="userId" value={watchedUserId} />
                <input type="hidden" name="date" value={watchedDate?.toISOString()} />
                <AISuggestionButton userId={watchedUserId} date={watchedDate} />
              </form>
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Main Street Cafe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the shift tasks..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create Shift</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
