import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Search,
  Bell,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useVolunteer } from "@/contexts/VolunteerContext";

export default function VolunteerRequestsPage() {
  const { toast } = useToast();
  const {
    volunteerRequests,
    approveVolunteerRequest,
    rejectVolunteerRequest,
    scheduleVolunteerRequest,
    refreshData,
  } = useVolunteer();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [scheduledDate, setScheduledDate] = useState<Date>();

  useEffect(() => {
    refreshData();
  }, []);

  const handleApprove = (id: string, name: string) => {
    approveVolunteerRequest(id);
    toast({
      title: "Request Approved",
      description: `Volunteer request from ${name} has been approved.`,
    });
  };

  const handleReject = (id: string, name: string) => {
    rejectVolunteerRequest(id);
    toast({
      title: "Request Rejected",
      description: `Volunteer request from ${name} has been rejected.`,
      variant: "destructive",
    });
  };

  const openScheduleDialog = (request: any) => {
    setSelectedRequest(request);
    setScheduledDate(request.scheduledDate ? new Date(request.scheduledDate) : undefined);
    setScheduleDialogOpen(true);
  };

  const handleSchedule = () => {
    if (!selectedRequest || !scheduledDate) return;

    scheduleVolunteerRequest(selectedRequest.id, scheduledDate);
    toast({
      title: "Volunteer Scheduled",
      description: `${selectedRequest.donorName} scheduled for ${format(
        scheduledDate,
        "PPP"
      )} at ${selectedRequest.ngoName}.`,
    });

    setScheduleDialogOpen(false);
    setSelectedRequest(null);
    setScheduledDate(undefined);
  };

  const handleNotifyNGO = (request: any) => {
    toast({
      title: "NGO Notified",
      description: `${request.ngoName} has been notified about the volunteer.`,
    });
  };

  const filteredRequests = volunteerRequests.filter((req) => {
    const matchesSearch =
      req.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "Scheduled":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const stats = {
    total: volunteerRequests.length,
    pending: volunteerRequests.filter((r) => r.status === "Pending").length,
    scheduled: volunteerRequests.filter((r) => r.status === "Scheduled").length,
    approved: volunteerRequests.filter((r) => r.status === "Approved").length,
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Volunteer Requests</h1>
            <p className="text-muted-foreground">
              Manage and schedule volunteer requests from real donors
            </p>
          </div>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
              <p className="text-xs text-muted-foreground">All volunteer requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">With scheduled dates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Ready to volunteer</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Requests</CardTitle>
            <CardDescription>
              {volunteerRequests.length === 0
                ? "No volunteer requests yet"
                : `Showing ${filteredRequests.length} of ${volunteerRequests.length} volunteer requests`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by donor name, email, or NGO..."
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

            {filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No volunteer requests found.</p>
                <p className="text-sm">
                  {volunteerRequests.length === 0
                    ? "When donors submit volunteer requests, they will appear here."
                    : "No requests match your current filters."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>NGO</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{request.donorName}</TableCell>
                        <TableCell>{request.donorEmail}</TableCell>
                        <TableCell>{request.ngoName}</TableCell>
                        <TableCell>{format(request.requestDate, "PP")}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.scheduledDate ? format(new Date(request.scheduledDate), "PP") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(request.id, request.donorName)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
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
                            {(request.status === "Approved" || request.status === "Scheduled") && (
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Volunteer</DialogTitle>
            <DialogDescription>
              Select a date for {selectedRequest?.donorName} to volunteer at{" "}
              {selectedRequest?.ngoName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scheduled Date *</Label>
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
                    {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
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
              Schedule Volunteer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
