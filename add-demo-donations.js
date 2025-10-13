// Run this in browser console to add demo donations for testing
const demoDonations = [
  {
    id: 'donation-001',
    amount: 5000,
    ngoId: 'ngo-001',
    donorId: 'donor-001',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00').toISOString()
  },
  {
    id: 'donation-002',
    amount: 2500,
    ngoId: 'ngo-002',
    donorId: 'donor-002',
    status: 'completed',
    createdAt: new Date('2024-01-16T14:20:00').toISOString()
  },
  {
    id: 'donation-003',
    amount: 10000,
    ngoId: 'ngo-001',
    donorId: 'donor-001',
    status: 'completed',
    createdAt: new Date('2024-01-20T09:15:00').toISOString()
  },
  {
    id: 'donation-004',
    amount: 7500,
    ngoId: 'ngo-003',
    donorId: 'donor-003',
    status: 'pending',
    createdAt: new Date('2024-01-22T16:45:00').toISOString()
  },
  {
    id: 'donation-005',
    amount: 3000,
    ngoId: 'ngo-002',
    donorId: 'donor-002',
    status: 'completed',
    createdAt: new Date('2024-02-01T11:20:00').toISOString()
  },
  {
    id: 'donation-006',
    amount: 8000,
    ngoId: 'ngo-001',
    donorId: 'donor-004',
    status: 'completed',
    createdAt: new Date('2024-02-05T13:30:00').toISOString()
  }
];

// Save to localStorage
localStorage.setItem('sevaconnect_donations', JSON.stringify(demoDonations));

console.log('✅ Demo donations added successfully!');
console.log('💰 Total donations:', demoDonations.length);
console.log('✅ Completed donations:', demoDonations.filter(d => d.status === 'completed').length);
console.log('🔄 Refresh the reports page to see the data!');
