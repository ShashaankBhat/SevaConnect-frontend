import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon, Search, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface VolunteerRequest {
  id: string;
  donorName: string;
  ngoName: string;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled';
  scheduledDate?: Date;
  notes?: string;
}

// Mock data
const mockRequests: VolunteerRequest[] = [
  { id: '1', donorName: 'Rahul Sharma', ngoName: 'Hope Foundation', requestDate: new Date('2024-01-15'), status: 'Pending' },
  { id: '2', donorName: 'Priya Patel', ngoName: 'Green Earth Initiative', requestDate: new Date('2024-01-14'), status: 'Scheduled', scheduledDate: new Date('2024-01-25') },
  { id: '3', donorName: 'Amit Kumar', ngoName: 'Education for All', requestDate: new Date('2024-01-13'), status: 'Approved' },
  { id: '4', donorName: 'Sneha Reddy', ngoName: 'Food Bank India', requestDate: new Date('2024-01-12'), status: 'Pending' },
];

export default function VolunteerRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VolunteerRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const handleApprove = (id: string, name: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Approved' as const } : req
    ));
    toast({
      title: "Request Approved",
      description: `Volunteer request from ${name} has been approved.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Rejected' as const } : req
    ));
    toast({
      title: "Request Rejected",
      description: `Volunteer request from ${name} has been rejected.`,
      variant: "destructive",
    });
  };

  const openScheduleDialog = (request: VolunteerRequest) => {
    setSelectedRequest(request);
    setScheduledDate(request.scheduledDate);
    setScheduleDialogOpen(true);
  };

  const handleSchedule = () => {
    if (!selectedRequest || !scheduledDate) return;
    
    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'Scheduled' as const, scheduledDate } 
        : req
    ));
    
    toast({
      title: "Volunteer Scheduled",
      description: `${selectedRequest.donorName} scheduled for ${format(scheduledDate, 'PPP')}`,
    });
    
    setScheduleDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleNotifyNGO = (request: VolunteerRequest) => {
    toast({
      title: "NGO Notified",
      description: `${request.ngoName} has been notified about the volunteer.`,
    });
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.ngoName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: 'secondary',
      Approved: 'default',
      Rejected: 'destructive',
      Scheduled: 'default',
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    scheduled: requests.filter(r => r.status === 'Scheduled').length,
    approved: requests.filter(r => r.status === 'Approved').length,
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Volunteer Requests</h1>
          <p className="text-muted-foreground">Manage and schedule volunteer requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <CalendarIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.scheduled}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Requests</CardTitle>
            <CardDescription>Review and manage volunteer requests from donors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by donor or NGO name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor Name</TableHead>
                    <TableHead>NGO</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No volunteer requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.donorName}</TableCell>
                        <TableCell>{request.ngoName}</TableCell>
                        <TableCell>{format(request.requestDate, 'PP')}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.scheduledDate ? format(request.scheduledDate, 'PP') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {request.status === 'Pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request.id, request.donorName)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openScheduleDialog(request)}
                                >
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  Schedule
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(request.id, request.donorName)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {(request.status === 'Approved' || request.status === 'Scheduled') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleNotifyNGO(request)}
                              >
                                <Bell className="h-4 w-4 mr-1" />
                                Notify NGO
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Volunteer</DialogTitle>
            <DialogDescription>
              Select a date for {selectedRequest?.donorName} to volunteer at {selectedRequest?.ngoName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!scheduledDate}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
