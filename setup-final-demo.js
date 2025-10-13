// Final Demo Data Setup - Run this in browser console

// Clear existing data
localStorage.clear();

// Add demo NGOs
const demoNGOs = [
  {
    id: 'ngo-001',
    name: 'Helping Hands Foundation',
    email: 'contact@helpinghands.org',
    contact: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra',
    category: 'Education',
    description: 'Providing education to underprivileged children in rural areas.',
    status: 'Pending',
    submittedAt: new Date('2024-01-15T10:30:00').toISOString(),
    password: 'demo123'
  },
  {
    id: 'ngo-002',
    name: 'Green Earth Initiative',
    email: 'info@greenearth.org',
    contact: '+91 9876543211',
    address: '456 Park Avenue, Delhi',
    category: 'Environment',
    description: 'Working towards environmental conservation and sustainability.',
    status: 'Pending',
    submittedAt: new Date('2024-01-16T14:20:00').toISOString(),
    password: 'demo123'
  },
  {
    id: 'ngo-003',
    name: 'Health for All',
    email: 'support@healthforall.org',
    contact: '+91 9876543212',
    address: '789 Medical Road, Bangalore, Karnataka',
    category: 'Healthcare',
    description: 'Providing free healthcare services to rural communities.',
    status: 'Verified',
    submittedAt: new Date('2024-01-10T09:15:00').toISOString(),
    password: 'demo123'
  }
];

// Add demo donors
const demoDonors = [
  {
    id: 'donor-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra',
    isVerified: true,
    registeredAt: new Date('2024-01-15T09:15:00').toISOString()
  },
  {
    id: 'donor-002', 
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9876543211',
    address: '456 Park Avenue, Delhi',
    isVerified: true,
    registeredAt: new Date('2024-01-16T16:20:00').toISOString()
  },
  {
    id: 'donor-003',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 9876543212',
    address: '789 Tech Park, Bangalore, Karnataka',
    isVerified: true,
    registeredAt: new Date('2024-01-17T11:30:00').toISOString()
  }
];

// Add demo notifications
const demoNotifications = [
  {
    id: 'notif-1',
    type: 'new_ngo',
    title: 'New NGO Registration',
    message: 'Helping Hands Foundation has submitted their registration for verification.',
    timestamp: new Date('2024-01-15T10:30:00'),
    isRead: false,
    relatedId: 'ngo-001'
  },
  {
    id: 'notif-2',
    type: 'new_donor',
    title: 'New Donor Registered',
    message: 'Rahul Sharma has registered as a new donor.',
    timestamp: new Date('2024-01-15T09:15:00'),
    isRead: false,
    relatedId: 'donor-001'
  },
  {
    id: 'notif-3',
    type: 'new_ngo',
    title: 'New NGO Registration',
    message: 'Green Earth Initiative has submitted their registration for verification.',
    timestamp: new Date('2024-01-16T14:20:00'),
    isRead: true,
    relatedId: 'ngo-002'
  },
  {
    id: 'notif-4',
    type: 'new_donor',
    title: 'New Donor Registered',
    message: 'Priya Patel has registered as a new donor.',
    timestamp: new Date('2024-01-16T16:20:00'),
    isRead: true,
    relatedId: 'donor-002'
  }
];

// Add admin user
const adminUser = {
  id: 'admin-001',
  name: 'Seva Connect Admin',
  email: 'admin@sevaconnect.com',
  role: 'admin'
};

// Save all data
localStorage.setItem('sevaconnect_ngos', JSON.stringify(demoNGOs));
localStorage.setItem('sevaconnect_donors', JSON.stringify(demoDonors));
localStorage.setItem('sevaconnect_notifications', JSON.stringify(demoNotifications));
localStorage.setItem('sevaconnect_admin', JSON.stringify(adminUser));

console.log('🎉 FINAL DEMO DATA SETUP COMPLETE!');
console.log('📊 NGOs:', demoNGOs.length);
console.log('🎯 Donors:', demoDonors.length);
console.log('🔔 Notifications:', demoNotifications.length);
console.log('👑 Admin: Ready to login');
console.log('');
console.log('🔑 ADMIN LOGIN CREDENTIALS:');
console.log('   Email: admin@sevaconnect.com');
console.log('   Password: admin123');
console.log('');
console.log('🚀 Refresh the page and test the complete system!');
