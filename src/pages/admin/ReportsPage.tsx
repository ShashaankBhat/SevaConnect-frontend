import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Heart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for charts
const donationsData = [
  { month: 'Jan', amount: 45000, count: 120 },
  { month: 'Feb', amount: 52000, count: 145 },
  { month: 'Mar', amount: 48000, count: 130 },
  { month: 'Apr', amount: 61000, count: 168 },
  { month: 'May', amount: 55000, count: 152 },
  { month: 'Jun', amount: 67000, count: 189 },
];

const volunteersData = [
  { month: 'Jan', volunteers: 45 },
  { month: 'Feb', volunteers: 52 },
  { month: 'Mar', volunteers: 48 },
  { month: 'Apr', volunteers: 61 },
  { month: 'May', volunteers: 58 },
  { month: 'Jun', volunteers: 70 },
];

const ngoStatusData = [
  { name: 'Verified', value: 45, color: 'hsl(var(--success))' },
  { name: 'Pending', value: 12, color: 'hsl(var(--warning))' },
  { name: 'Rejected', value: 8, color: 'hsl(var(--destructive))' },
];

const categoryData = [
  { category: 'Education', ngos: 15, donations: 25000 },
  { category: 'Healthcare', ngos: 12, donations: 32000 },
  { category: 'Environment', ngos: 10, donations: 18000 },
  { category: 'Food Security', ngos: 8, donations: 22000 },
  { category: 'Others', ngos: 5, donations: 12000 },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('6months');

  const exportToPDF = () => {
    toast({
      title: "Exporting to PDF",
      description: "Your report is being generated and will download shortly.",
    });
    // Implementation would go here
  };

  const exportToCSV = () => {
    toast({
      title: "Exporting to CSV",
      description: "Your data is being exported.",
    });
    // Implementation would go here
  };

  const summaryStats = {
    totalDonations: donationsData.reduce((sum, d) => sum + d.amount, 0),
    totalVolunteers: volunteersData.reduce((sum, v) => sum + v.volunteers, 0),
    totalNGOs: ngoStatusData.reduce((sum, n) => sum + n.value, 0),
    avgDonation: Math.round(donationsData.reduce((sum, d) => sum + d.amount, 0) / donationsData.length),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive platform insights and statistics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={exportToPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryStats.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalVolunteers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+8.2%</span> from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalNGOs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-success">+5 new</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Donation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{summaryStats.avgDonation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Per month average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="ngos">NGO Status</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>Monthly donation amounts and counts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={donationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="amount" fill="hsl(var(--primary))" name="Amount (₹)" />
                  <Bar yAxisId="right" dataKey="count" fill="hsl(var(--accent))" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Engagement</CardTitle>
              <CardDescription>Monthly volunteer participation trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={volunteersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="volunteers" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Volunteers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ngos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NGO Status Distribution</CardTitle>
              <CardDescription>Overview of NGO verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={ngoStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ngoStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NGO Categories & Donations</CardTitle>
              <CardDescription>Distribution across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ngos" fill="hsl(var(--primary))" name="NGOs" />
                  <Bar dataKey="donations" fill="hsl(var(--accent))" name="Donations (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
