// Run this in browser console to add demo volunteer requests
const demoVolunteerRequests = [
  {
    id: 'volunteer-001',
    donorId: 'donor-001',
    donorName: 'Rahul Sharma',
    donorEmail: 'rahul.sharma@example.com',
    ngoId: 'ngo-001',
    ngoName: 'Helping Hands Foundation',
    requestDate: new Date('2024-01-15T10:30:00'),
    status: 'Pending',
    skills: ['Teaching', 'Mentoring'],
    availability: ['Weekends', 'Evenings'],
    notes: 'Interested in teaching underprivileged children.'
  },
  {
    id: 'volunteer-002',
    donorId: 'donor-002',
    donorName: 'Priya Patel',
    donorEmail: 'priya.patel@example.com',
    ngoId: 'ngo-002',
    ngoName: 'Green Earth Initiative',
    requestDate: new Date('2024-01-14T14:20:00'),
    status: 'Scheduled',
    scheduledDate: new Date('2024-01-25'),
    skills: ['Gardening', 'Environmental Education'],
    availability: ['Weekends'],
    notes: 'Passionate about environmental conservation.'
  },
  {
    id: 'volunteer-003',
    donorId: 'donor-003',
    donorName: 'Amit Kumar',
    donorEmail: 'amit.kumar@example.com',
    ngoId: 'ngo-003',
    ngoName: 'Health for All',
    requestDate: new Date('2024-01-13T09:15:00'),
    status: 'Approved',
    skills: ['Medical Assistance', 'First Aid'],
    availability: ['Full-time'],
    notes: 'Medical professional looking to volunteer.'
  }
];

localStorage.setItem('sevaconnect_volunteer_requests', JSON.stringify(demoVolunteerRequests));
console.log('Demo volunteer requests added! Refresh the volunteer requests page.');
