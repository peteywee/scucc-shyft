import { Clock, MapPin, User, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock shifts data, assuming this comes from a data source
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

const getNextUpcomingShift = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time part for comparison

  const upcomingShifts = shifts
    .map(shift => ({ ...shift, dateObj: new Date(shift.date) }))
    .filter(shift => shift.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  return upcomingShifts[0];
};


export function UpcomingShiftCard() {
    const upcomingShift = getNextUpcomingShift();

    if (!upcomingShift) {
        return (
             <Card className="w-full h-full">
                <CardHeader>
                    <CardTitle>Next Upcoming Shift</CardTitle>
                    <CardDescription>No upcoming shifts scheduled.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Calendar className="h-12 w-12 mb-4" />
                        <p>All clear! Enjoy your day.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

  const { employee, date, hours, location, status } = upcomingShift;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Next Upcoming Shift</CardTitle>
        <CardDescription>
          Here are the details for the next scheduled shift.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${employee}`} alt={employee} />
            <AvatarFallback>{employee.substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{employee}</p>
            <p className="text-sm text-muted-foreground">Shift Employee</p>
          </div>
          <Badge className="ml-auto">{status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
             <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{hours} hours</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{location}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
