// Run this in browser console to add demo data for reports

// Clear existing demo data
localStorage.removeItem('sevaconnect_donations');
localStorage.removeItem('sevaconnect_volunteer_requests');

// Get existing NGOs and Donors
const ngos = JSON.parse(localStorage.getItem('sevaconnect_ngos') || '[]');
const donors = JSON.parse(localStorage.getItem('sevaconnect_donors') || '[]');

console.log('Existing NGOs:', ngos.length);
console.log('Existing Donors:', donors.length);

// Create demo donations
const demoDonations = [
  {
    id: 'donation-1',
    amount: 5000,
    ngoId: ngos[0]?.id || 'ngo-001',
    donorId: donors[0]?.id || 'donor-001',
    status: 'completed',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'donation-2',
    amount: 2500,
    ngoId: ngos[1]?.id || 'ngo-002',
    donorId: donors[1]?.id || 'donor-002',
    status: 'completed',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 'donation-3',
    amount: 10000,
    ngoId: ngos[0]?.id || 'ngo-001',
    donorId: donors[0]?.id || 'donor-001',
    status: 'completed',
    createdAt: new Date('2024-02-05').toISOString()
  },
  {
    id: 'donation-4',
    amount: 7500,
    ngoId: ngos[1]?.id || 'ngo-002',
    donorId: donors[1]?.id || 'donor-002',
    status: 'completed',
    createdAt: new Date('2024-02-15').toISOString()
  },
  {
    id: 'donation-5',
    amount: 3000,
    ngoId: ngos[0]?.id || 'ngo-001',
    donorId: donors[0]?.id || 'donor-001',
    status: 'completed',
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: 'donation-6',
    amount: 12000,
    ngoId: ngos[1]?.id || 'ngo-002',
    donorId: donors[1]?.id || 'donor-002',
    status: 'completed',
    createdAt: new Date('2024-03-10').toISOString()
  }
];

// Create demo volunteer requests
const demoVolunteerRequests = [
  {
    id: 'volunteer-1',
    donorName: donors[0]?.name || 'Rahul Sharma',
    ngoName: ngos[0]?.name || 'Helping Hands Foundation',
    status: 'Approved',
    createdAt: new Date('2024-01-18').toISOString()
  },
  {
    id: 'volunteer-2',
    donorName: donors[1]?.name || 'Priya Patel',
    ngoName: ngos[1]?.name || 'Green Earth Initiative',
    status: 'Pending',
    createdAt: new Date('2024-02-12').toISOString()
  },
  {
    id: 'volunteer-3',
    donorName: donors[0]?.name || 'Rahul Sharma',
    ngoName: ngos[1]?.name || 'Green Earth Initiative',
    status: 'Scheduled',
    createdAt: new Date('2024-02-25').toISOString()
  },
  {
    id: 'volunteer-4',
    donorName: donors[1]?.name || 'Priya Patel',
    ngoName: ngos[0]?.name || 'Helping Hands Foundation',
    status: 'Approved',
    createdAt: new Date('2024-03-05').toISOString()
  }
];

// Save to localStorage
localStorage.setItem('sevaconnect_donations', JSON.stringify(demoDonations));
localStorage.setItem('sevaconnect_volunteer_requests', JSON.stringify(demoVolunteerRequests));

console.log('✅ Demo reports data added successfully!');
console.log('💰 Donations:', demoDonations.length);
console.log('🤝 Volunteer Requests:', demoVolunteerRequests.length);
console.log('📊 Total Donation Amount: ₹' + demoDonations.reduce((sum, d) => sum + d.amount, 0).toLocaleString());
console.log('🚀 Refresh the reports page to see the data!');
