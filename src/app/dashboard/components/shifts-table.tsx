import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const shifts = [
  {
    id: '1',
    employee: 'John Doe',
    date: '2024-09-15',
    hours: 8,
    location: 'Main Street Cafe',
    status: 'Approved',
  },
  {
    id: '2',
    employee: 'Jane Smith',
    date: '2024-09-15',
    hours: 6.5,
    location: 'Downtown Roasters',
    status: 'Pending',
  },
  {
    id: '3',
    employee: 'Michael Johnson',
    date: '2024-09-16',
    hours: 8,
    location: 'Main Street Cafe',
    status: 'Completed',
  },
  {
    id: '4',
    employee: 'John Doe',
    date: '2024-09-17',
    hours: 7,
    location: 'Uptown Bistro',
    status: 'Approved',
  },
   {
    id: '5',
    employee: 'Jane Smith',
    date: '2024-09-18',
    hours: 8,
    location: 'Main Street Cafe',
    status: 'Draft',
  },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
    Approved: 'default',
    Pending: 'secondary',
    Completed: 'outline',
    Draft: 'destructive',
}

export function ShiftsTable() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upcoming & Recent Shifts</CardTitle>
        <CardDescription>
          A list of shifts for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.employee}</TableCell>
                <TableCell>{shift.date}</TableCell>
                <TableCell>{shift.hours.toFixed(1)}</TableCell>
                <TableCell>{shift.location}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[shift.status] || 'default'}>{shift.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
