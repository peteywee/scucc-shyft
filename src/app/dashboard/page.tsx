
'use client';
import { useState } from 'react';
import { CreateShiftForm } from './components/create-shift-form';
import { UpcomingShiftCard } from './components/upcoming-shift-card';
import { Calendar } from '@/components/ui/calendar';

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <CreateShiftForm />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <UpcomingShiftCard />
        </div>
        <div className="lg:col-span-3">
           <div className="rounded-lg border shadow-sm">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4",
                  month: "space-y-4 w-full",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-around",
                  row: "flex w-full mt-2 justify-around",
                }}
              />
           </div>
        </div>
      </div>
    </>
  );
}
