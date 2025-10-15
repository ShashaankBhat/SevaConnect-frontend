import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Heart, Building2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Donation {
  id: string;
  amount: number;
  ngoId: string;
  donorId: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

interface NGO {
  id: string;
  name: string;
  email: string;
  category: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  registeredAt: string;
}

interface VolunteerRequest {
  id: string;
  donorName: string;
  ngoName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Scheduled';
  createdAt: string;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('6months');
  const [donationsData, setDonationsData] = useState<any[]>([]);
  const [volunteersData, setVolunteersData] = useState<any[]>([]);
  const [ngoStatusData, setNgoStatusData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [summaryStats, setSummaryStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    activeNGOs: 0,
    uniqueDonatingDonors: 0,
    donationRate: 0
  });

  useEffect(() => {
    fetchReportsData();
    const interval = setInterval(fetchReportsData, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchReportsData = () => {
    setLoading(true);
    try {
      const donations: Donation[] = JSON.parse(localStorage.getItem('sevaconnect_donations') || '[]');
      const ngos: NGO[] = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
      const donors: Donor[] = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');
      const volunteerRequests: VolunteerRequest[] = JSON.parse(localStorage.getItem('sevaconnect_volunteer_requests') || '[]');

      console.log('Fetched data:', { 
        donations: donations.length, 
        ngos: ngos.length, 
        donors: donors.length, 
        volunteers: volunteerRequests.length 
      });

      setDonationsData(processDataByMonth(donations));
      setVolunteersData(processVolunteersByMonth(volunteerRequests));
      setNgoStatusData(processNGOStatus(ngos));
      setCategoryData(processCategoryData(ngos, donations));

      // Update summary stats reactively
      const completedDonations = donations.filter(d => d.status === 'completed');
      const uniqueDonatingDonors = new Set(completedDonations.map(d => d.donorId)).size;
      const activeDonors = donors.filter(d => d.isVerified).length;
      const activeNGOs = ngos.filter(n => n.status === 'Verified').length;
      const totalDonations = completedDonations.length;
      const donationRate = activeDonors > 0 ? Math.round((uniqueDonatingDonors / activeDonors) * 100) : 0;

      setSummaryStats({ totalDonations, activeDonors, activeNGOs, uniqueDonatingDonors, donationRate });

      setLastUpdated(new Date());
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

  const processDataByMonth = (data: Donation[]) => {
    const monthMap: any = {};
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    data.forEach(d => {
      if (d.status === 'completed') {
        const date = new Date(d.createdAt);
        const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = { month: monthKey, donations: 0, donors: new Set() };
        }
        monthMap[monthKey].donations += 1;
        monthMap[monthKey].donors.add(d.donorId);
      }
    });

    return getLastMonths(6).map(m => {
      const data = monthMap[m] || { month: m, donations: 0, donors: new Set() };
      return {
        month: m,
        donations: data.donations,
        uniqueDonors: data.donors.size
      };
    });
  };

  const processVolunteersByMonth = (data: VolunteerRequest[]) => {
    const monthMap: any = {};
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    data.forEach(v => {
      const date = new Date(v.createdAt);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      if (!monthMap[monthKey]) monthMap[monthKey] = { month: monthKey, volunteers: 0 };
      monthMap[monthKey].volunteers += 1;
    });
    
    return getLastMonths(6).map(m => monthMap[m] || { month: m, volunteers: 0 });
  };

  const processNGOStatus = (ngos: NGO[]) => {
    const statusCount: any = { Verified: 0, Pending: 0, Rejected: 0 };
    ngos.forEach(n => { if (statusCount[n.status] !== undefined) statusCount[n.status]++ });
    
    return [
      { name: 'Verified', value: statusCount.Verified, color: '#10b981' },
      { name: 'Pending', value: statusCount.Pending, color: '#f59e0b' },
      { name: 'Rejected', value: statusCount.Rejected, color: '#ef4444' },
    ].filter(item => item.value > 0);
  };

  const processCategoryData = (ngos: NGO[], donations: Donation[]) => {
    const map: any = {};
    
    ngos.forEach(n => {
      if (!map[n.category]) map[n.category] = { category: n.category, ngos: 0, donations: 0, verifiedNGOs: 0 };
      map[n.category].ngos++;
      if (n.status === 'Verified') map[n.category].verifiedNGOs++;
    });

    donations.forEach(d => {
      if (d.status === 'completed') {
        const ngo = ngos.find(n => n.id === d.ngoId);
        if (ngo && map[ngo.category]) map[ngo.category].donations += 1;
      }
    });
    
    return Object.values(map).filter((item: any) => item.ngos > 0);
  };

  const getLastMonths = (count: number) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const result = [];
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      result.push(`${months[date.getMonth()]} ${date.getFullYear()}`);
    }
    return result;
  };

  const exportToCSV = () => toast({ title: 'Exporting CSV', description: 'Feature coming soon!' });
  const exportToPDF = () => toast({ title: 'Exporting PDF', description: 'Feature coming soon!' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Real-time platform insights and statistics
            {lastUpdated && (
              <span className="text-xs ml-2">(Updated: {lastUpdated.toLocaleTimeString()})</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportToCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          <Button onClick={exportToPDF}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
          <Button variant="outline" onClick={fetchReportsData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeDonors}</div>
            <p className="text-xs text-muted-foreground">{summaryStats.uniqueDonatingDonors} made donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active NGOs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeNGOs}</div>
            <p className="text-xs text-muted-foreground">Verified NGOs on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalDonations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Individual donation transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.donationRate}%</div>
            <p className="text-xs text-muted-foreground">Of donors made donations</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="ngos">NGO Status</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle>Donation Trends</CardTitle>
              <CardDescription>Monthly donation counts and unique donors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={donationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value: any, name: string) => [value, name === 'donations' ? 'Donations' : 'Unique Donors']} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="donations" fill="#3b82f6" name="Donations" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="uniqueDonors" fill="#8b5cf6" name="Unique Donors" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Engagement</CardTitle>
              <CardDescription>Monthly volunteer request trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={volunteersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="volunteers" stroke="#10b981" strokeWidth={2} name="Volunteer Requests" dot={{ fill: '#10b981', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ngos">
          <Card>
            <CardHeader>
              <CardTitle>NGO Status Distribution</CardTitle>
              <CardDescription>Verified, Pending, and Rejected NGOs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie data={ngoStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={120} dataKey="value">
                    {ngoStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>NGO Categories & Donations</CardTitle>
              <CardDescription>Category-wise NGO distribution and donation counts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="category" width={120} />
                  <Tooltip formatter={(value: any, name: string) => [value, name === 'donations' ? 'Donations' : name === 'verifiedNGOs' ? 'Verified NGOs' : 'Total NGOs']} />
                  <Legend />
                  <Bar dataKey="ngos" fill="#6b7280" name="Total NGOs" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="verifiedNGOs" fill="#10b981" name="Verified NGOs" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="donations" fill="#3b82f6" name="Donations" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
