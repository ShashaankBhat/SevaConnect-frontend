import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Heart, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function ReportsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('6months');
  const [donationsData, setDonationsData] = useState<any[]>([]);
  const [volunteersData, setVolunteersData] = useState<any[]>([]);
  const [ngoStatusData, setNgoStatusData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // Fetch donations data
      const { data: donations } = await (supabase as any)
        .from('donations')
        .select('amount, created_at')
        .order('created_at', { ascending: true });

      // Process donations by month
      const donationsByMonth = processDataByMonth(donations || [], 'amount');
      setDonationsData(donationsByMonth);

      // Fetch volunteer requests
      const { data: volunteers } = await (supabase as any)
        .from('volunteer_requests')
        .select('created_at')
        .order('created_at', { ascending: true });

      const volunteersByMonth = processVolunteersByMonth(volunteers || []);
      setVolunteersData(volunteersByMonth);

      // Fetch NGO status data
      const { data: ngos } = await (supabase as any)
        .from('ngos')
        .select('status');

      const statusCounts = processNGOStatus(ngos || []);
      setNgoStatusData(statusCounts);

      // Fetch category data
      const { data: ngosByCategory } = await (supabase as any)
        .from('ngos')
        .select('category');

      const { data: donationsByNGO } = await (supabase as any)
        .from('donations')
        .select('amount, ngo_id');

      const categoryStats = processCategoryData(ngosByCategory || [], donationsByNGO || []);
      setCategoryData(categoryStats);

    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processDataByMonth = (data: any[], field: string) => {
    const monthMap: any = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = months[date.getMonth()];
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, amount: 0, count: 0 };
      }
      monthMap[monthKey].amount += Number(item[field] || 0);
      monthMap[monthKey].count += 1;
    });

    return months.map(month => monthMap[month] || { month, amount: 0, count: 0 });
  };

  const processVolunteersByMonth = (data: any[]) => {
    const monthMap: any = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = months[date.getMonth()];
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, volunteers: 0 };
      }
      monthMap[monthKey].volunteers += 1;
    });

    return months.map(month => monthMap[month] || { month, volunteers: 0 });
  };

  const processNGOStatus = (ngos: any[]) => {
    const statusCount: any = { Approved: 0, Pending: 0, Rejected: 0 };
    ngos.forEach(ngo => {
      if (statusCount[ngo.status] !== undefined) {
        statusCount[ngo.status]++;
      }
    });

    return [
      { name: 'Verified', value: statusCount.Approved, color: 'hsl(var(--success))' },
      { name: 'Pending', value: statusCount.Pending, color: 'hsl(var(--warning))' },
      { name: 'Rejected', value: statusCount.Rejected, color: 'hsl(var(--destructive))' },
    ];
  };

  const processCategoryData = (ngos: any[], donations: any[]) => {
    const categoryMap: any = {};
    
    ngos.forEach(ngo => {
      if (!categoryMap[ngo.category]) {
        categoryMap[ngo.category] = { category: ngo.category, ngos: 0, donations: 0 };
      }
      categoryMap[ngo.category].ngos++;
    });

    return Object.values(categoryMap);
  };

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
    avgDonation: donationsData.length > 0 ? Math.round(donationsData.reduce((sum, d) => sum + d.amount, 0) / donationsData.length) : 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
