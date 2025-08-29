import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateShiftForm } from './components/create-shift-form';
import { ShiftsTable } from './components/shifts-table';

export default function DashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Shifts</h1>
        <div className="ml-auto flex items-center gap-2">
          <CreateShiftForm />
        </div>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <ShiftsTable />
      </div>
    </>
  );
}
