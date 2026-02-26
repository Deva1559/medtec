// Mock Database with In-Memory Storage
// This file simulates MongoDB responses for testing without actual database

const bcrypt = require('bcryptjs');

// 2 Doctors
const doctors = [
  {
    _id: 'doctor1',
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    email: 'doctor1@healx.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k', // "doctor123"
    phone: '9876543211',
    role: 'doctor',
    address: 'Delhi, India',
    location: { type: 'Point', coordinates: [77.1050, 28.7055] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    medicalLicense: { number: 'DL12345', specialization: 'General Medicine', issuedDate: '2015-01-01', expiryDate: '2030-01-01' },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'doctor2',
    firstName: 'Dr. Priya',
    lastName: 'Sharma',
    email: 'doctor2@healx.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k', // "doctor123"
    phone: '9876543212',
    role: 'doctor',
    address: 'Mumbai, India',
    location: { type: 'Point', coordinates: [72.8777, 19.0760] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    medicalLicense: { number: 'MH54321', specialization: 'Cardiology', issuedDate: '2018-01-01', expiryDate: '2028-01-01' },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 10 Users (patients)
const users = [
  {
    _id: 'user1',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510001',
    role: 'patient',
    address: 'Delhi, India',
    location: { type: 'Point', coordinates: [77.1025, 28.7041] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510002',
    role: 'patient',
    address: 'Mumbai, India',
    location: { type: 'Point', coordinates: [72.8777, 19.0760] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user3',
    firstName: 'Raj',
    lastName: 'Gupta',
    email: 'raj.gupta@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510003',
    role: 'patient',
    address: 'Bangalore, India',
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user4',
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510004',
    role: 'patient',
    address: 'Chennai, India',
    location: { type: 'Point', coordinates: [80.2707, 13.0827] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user5',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.s@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510005',
    role: 'patient',
    address: 'Kolkata, India',
    location: { type: 'Point', coordinates: [88.3639, 22.5726] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user6',
    firstName: 'Anita',
    lastName: 'Desai',
    email: 'anita.d@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510006',
    role: 'patient',
    address: 'Hyderabad, India',
    location: { type: 'Point', coordinates: [78.4867, 17.3850] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user7',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510007',
    role: 'patient',
    address: 'Pune, India',
    location: { type: 'Point', coordinates: [73.8567, 18.5204] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user8',
    firstName: 'Lakshmi',
    lastName: 'Nair',
    email: 'lakshmi.n@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510008',
    role: 'patient',
    address: 'Kochi, India',
    location: { type: 'Point', coordinates: [76.2554, 9.9312] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user9',
    firstName: 'Omar',
    lastName: 'Hassan',
    email: 'omar.h@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510009',
    role: 'patient',
    address: 'Jaipur, India',
    location: { type: 'Point', coordinates: [75.7873, 26.9124] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user10',
    firstName: 'Priya',
    lastName: 'Iyer',
    email: 'priya.i@email.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510010',
    role: 'patient',
    address: 'Ahmedabad, India',
    location: { type: 'Point', coordinates: [72.5714, 23.0225] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'user11',
    firstName: 'Patient',
    lastName: 'One',
    email: 'patient1@healx.com',
    password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k',
    phone: '9876510011',
    role: 'patient',
    address: 'Delhi, India',
    location: { type: 'Point', coordinates: [77.1025, 28.7041] },
    avatar: 'https://via.placeholder.com/150',
    verified: true,
    active: true,
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];


// Admin user
const adminUser = {
  _id: 'admin1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@healx.com',
  password: '$2a$10$LQv8VrY8PGW1c2r8/8sOx.PvDYXgEa.qrV.K6k6K6kEkE6kE6kE6k', // "admin123"
  phone: '9876543210',
  role: 'admin',
  address: 'Delhi, India',
  location: { type: 'Point', coordinates: [77.1025, 28.7041] },
  avatar: 'https://via.placeholder.com/150',
  verified: true,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// All users combined (admin + doctors + patients)
const allUsers = [adminUser, ...doctors, ...users];

// Camps
const camps = [
  {
    _id: 'camp1',
    name: 'Delhi Health Camp',
    date: new Date('2024-03-15'),
    location: 'Delhi',
    address: 'Connaught Place, Delhi',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    organizedBy: 'Dr. Rajesh Kumar',
    status: 'completed',
    attendees: 150,
    services: ['General Checkup', 'Blood Pressure', 'Diabetes Screening'],
    createdAt: new Date()
  },
  {
    _id: 'camp2',
    name: 'Mumbai Wellness Camp',
    date: new Date('2024-03-20'),
    location: 'Mumbai',
    address: 'Marine Drive, Mumbai',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    organizedBy: 'Dr. Priya Sharma',
    status: 'active',
    attendees: 200,
    services: ['Cardiac Screening', 'Eye Checkup', 'Dental Checkup'],
    createdAt: new Date()
  },
  {
    _id: 'camp3',
    name: 'Bangalore Health Camp',
    date: new Date('2024-03-25'),
    location: 'Bangalore',
    address: 'MG Road, Bangalore',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    organizedBy: 'Dr. Rajesh Kumar',
    status: 'active',
    attendees: 120,
    services: ['General Checkup', 'Vaccination', 'Health Awareness'],
    createdAt: new Date()
  }
];

// Emergencies
const emergencies = [
  {
    _id: 'emergency1',
    type: 'cardiac',
    severity: 'critical',
    location: 'Delhi',
    address: 'Connaught Place, Delhi',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    status: 'active',
    patient: users[0],
    description: 'Chest pain and difficulty breathing',
    createdAt: new Date(Date.now() - 30 * 60000)
  },
  {
    _id: 'emergency2',
    type: 'accident',
    severity: 'high',
    location: 'Mumbai',
    address: 'Marine Drive, Mumbai',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    status: 'resolved',
    patient: users[1],
    description: 'Road accident - minor injuries',
    createdAt: new Date(Date.now() - 2 * 3600000)
  },
  {
    _id: 'emergency3',
    type: 'breathing',
    severity: 'critical',
    location: 'Bangalore',
    address: 'MG Road, Bangalore',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    status: 'active',
    patient: users[2],
    description: 'Severe asthma attack',
    createdAt: new Date(Date.now() - 15 * 60000)
  }
];

// Ambulances
const ambulances = [
  { _id: 'amb1', vehicleNumber: 'DL-01-AB-1234', type: 'Advanced Life Support', status: 'available', location: { lat: 28.7041, lng: 77.1025 }, driver: 'John Doe', phone: '9876511001' },
  { _id: 'amb2', vehicleNumber: 'DL-01-AB-5678', type: 'Basic Life Support', status: 'available', location: { lat: 28.6500, lng: 77.2000 }, driver: 'Ravi Kumar', phone: '9876511002' },
  { _id: 'amb3', vehicleNumber: 'MH-01-CD-9012', type: 'Advanced Life Support', status: 'on_duty', location: { lat: 19.0760, lng: 72.8777 }, driver: 'Suresh Patil', phone: '9876511003' },
  { _id: 'amb4', vehicleNumber: 'MH-01-CD-3456', type: 'Basic Life Support', status: 'available', location: { lat: 19.1000, lng: 72.9000 }, driver: 'Amar Singh', phone: '9876511004' },
  { _id: 'amb5', vehicleNumber: 'KA-01-EF-7890', type: 'Cardiac Ambulance', status: 'available', location: { lat: 12.9716, lng: 77.5946 }, driver: 'Mahesh Gowda', phone: '9876511005' },
  { _id: 'amb6', vehicleNumber: 'TN-01-GH-1234', type: 'Basic Life Support', status: 'maintenance', location: { lat: 13.0827, lng: 80.2707 }, driver: 'Ramesh Babu', phone: '9876511006' },
  { _id: 'amb7', vehicleNumber: 'WB-01-IJ-5678', type: 'Advanced Life Support', status: 'available', location: { lat: 22.5726, lng: 88.3639 }, driver: 'Bikram Ghosh', phone: '9876511007' },
  { _id: 'amb8', vehicleNumber: 'TS-01-KL-9012', type: 'Basic Life Support', status: 'on_duty', location: { lat: 17.3850, lng: 78.4867 }, driver: 'Ravi Teja', phone: '9876511008' },
  { _id: 'amb9', vehicleNumber: 'GJ-01-MN-3456', type: 'Cardiac Ambulance', status: 'available', location: { lat: 23.0225, lng: 72.5714 }, driver: 'Amit Patel', phone: '9876511009' },
  { _id: 'amb10', vehicleNumber: 'KL-01-OP-7890', type: 'Basic Life Support', status: 'available', location: { lat: 9.9312, lng: 76.2554 }, driver: 'Varghese Mathew', phone: '9876511010' },
  { _id: 'amb11', vehicleNumber: 'RJ-01-QR-1234', type: 'Advanced Life Support', status: 'available', location: { lat: 26.9124, lng: 75.7873 }, driver: 'Gopal Sharma', phone: '9876511011' },
  { _id: 'amb12', vehicleNumber: 'MH-01-ST-9012', type: 'Mobile ICU', status: 'available', location: { lat: 18.5204, lng: 73.8567 }, driver: 'Dinesh Jadhav', phone: '9876511012' }
];

// Records
const records = [
  {
    _id: 'record1',
    patient: users[0],
    doctor: doctors[0],
    type: 'checkup',
    diagnosis: 'Normal blood pressure, slight vitamin D deficiency',
    prescription: ['Vitamin D supplements', 'Regular exercise'],
    notes: 'Follow up after 3 months',
    createdAt: new Date(Date.now() - 7 * 24 * 3600000)
  },
  {
    _id: 'record2',
    patient: users[1],
    doctor: doctors[1],
    type: 'cardiac',
    diagnosis: 'Mild arrhythmia - EKG shows irregular heartbeat',
    prescription: ['Beta blockers', 'Low salt diet', 'Stress management'],
    notes: 'ECG recommended in 2 weeks',
    createdAt: new Date(Date.now() - 14 * 24 * 3600000)
  },
  {
    _id: 'record3',
    patient: users[2],
    doctor: doctors[0],
    type: 'checkup',
    diagnosis: 'Healthy individual - all vitals normal',
    prescription: ['Maintain current lifestyle'],
    notes: 'Annual checkup completed',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000)
  }
];

// Notifications
const notifications = [
  {
    _id: 'notif1',
    user: users[0],
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Rajesh Kumar is tomorrow at 10:00 AM',
    type: 'reminder',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000)
  },
  {
    _id: 'notif2',
    user: users[1],
    title: 'Health Camp Announcement',
    message: 'Mumbai Wellness Camp scheduled for March 20th - Free cardiac screening',
    type: 'announcement',
    read: false,
    createdAt: new Date(Date.now() - 24 * 3600000)
  },
  {
    _id: 'notif3',
    user: users[2],
    title: 'Lab Results Available',
    message: 'Your lab results from recent checkup are now available',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 3600000)
  }
];

// Export all mock data
module.exports = {
  users: allUsers,
  doctors,
  patients: users,
  admin: adminUser,
  camps,
  emergencies,
  ambulances,
  records,
  notifications
};
