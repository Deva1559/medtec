require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const HealthCamp = require('./models/HealthCamp');
const Ambulance = require('./models/Ambulance');
const Emergency = require('./models/Emergency');
const MedicalRecord = require('./models/MedicalRecord');
const Notification = require('./models/Notification');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Note: MongoDB Atlas doesn't allow dropDatabase() due to permission restrictions
    // Instead, we'll delete collections individually if they exist
    console.log('Clearing existing data...');
    try {
      await User.deleteMany({});
      await HealthCamp.deleteMany({});
      await Ambulance.deleteMany({});
      await Emergency.deleteMany({});
      await MedicalRecord.deleteMany({});
      await Notification.deleteMany({});
      console.log('✓ Database cleared');
    } catch (clearError) {
      console.log('Database clear skipped (first run):', clearError.message);
    }

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@healx.com',
      password: 'admin@123',

      phone: '1234567890',
      role: 'admin',
      verified: true,
      active: true,
      location: {
        type: 'Point',
        coordinates: [77.1025, 28.7041]
      }
    });
    console.log('Admin created');

    // Create doctors - using create() to trigger password hashing
    const doctors = [];
    for (const doctorData of [
      {
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'doctor1@healx.com',
        password: 'doctor1@123',
        phone: '9876543210',
        role: 'doctor',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041]
        },
        medicalLicense: {
          number: 'LIC001',
          specialization: 'Emergency Medicine',
          issuedAt: new Date('2015-01-01'),
          expiresAt: new Date('2025-12-31')
        }
      },
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'doctor2@healx.com',
        password: 'doctor1@123',
        phone: '9876543211',
        role: 'doctor',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1050, 28.7050]
        },
        medicalLicense: {
          number: 'LIC002',
          specialization: 'Cardiology',
          issuedAt: new Date('2018-01-01'),
          expiresAt: new Date('2028-12-31')
        }
      }
    ]) {
      doctors.push(await User.create(doctorData));
    }
    console.log('Doctors created');

    // Create ambulance drivers - using create() to trigger password hashing
    const drivers = [];
    for (const driverData of [
      {
        firstName: 'Raj',
        lastName: 'Kumar',
        email: 'driver1@healx.com',
        password: 'Driver@123456',
        phone: '9876543212',
        role: 'ambulance_driver',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041]
        }
      },
      {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'driver2@healx.com',
        password: 'Driver@123456',
        phone: '9876543213',
        role: 'ambulance_driver',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1050, 28.7050]
        }
      }
    ]) {
      drivers.push(await User.create(driverData));
    }
    console.log('Ambulance drivers created');

    // Create volunteers
    const volunteers = [];
    const volunteersData = [
      {
        firstName: 'Arun',
        lastName: 'Patel',
        email: 'volunteer1@healx.com',
        password: 'Volunteer@123456',
        phone: '9876543214',
        role: 'volunteer',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041]
        },
        volunteerInfo: {
          yearsOfExperience: 5,
          certifications: ['First Aid', 'CPR'],
          availability: true
        }
      },
      {
        firstName: 'Neha',
        lastName: 'Gupta',
        email: 'volunteer2@healx.com',
        password: 'Volunteer@123456',
        phone: '9876543215',
        role: 'volunteer',
        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [77.1050, 28.7050]
        },
        volunteerInfo: {
          yearsOfExperience: 3,
          certifications: ['First Aid'],
          availability: true
        }
      }
    ];
    for (const volunteerData of volunteersData) {
      volunteers.push(await User.create(volunteerData));
    }
    console.log('Volunteers created');

    // Create patients
    const patients = [];
    const patientsData = [
      {
        firstName: 'Amit',
        lastName: 'Sharma',
        email: 'patient1@healx.com',
        password: 'patient1@123',
        phone: '9876543216',
        role: 'patient',

        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1025]
        }
      },
      {
        firstName: 'Maya',
        lastName: 'Singh',
        email: 'patient2@healx.com',
        password: 'patient1@123',
        phone: '9876543217',
        role: 'patient',

        verified: true,
        active: true,
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1035]
        }
      },
      {
        firstName: 'ABISHEK',
        lastName: 'Kumar',
        email: 'abishek@healx.com',
        password: 'patient1@123',
        phone: '9876543218',
        role: 'patient',
        verified: true,
        active: true,
        address: {
          street: 'Rajiv Chowk',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110002',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [28.6328, 77.2197]
        },
        emergencyContacts: [{
          name: 'RAMESH KUMAR',
          relationship: 'Brother',
          phone: '9876543250'
        }]
      },
      {
        firstName: 'DEVARANJAN',
        lastName: 'Reddy',
        email: 'devaranjan@healx.com',
        password: 'patient1@123',
        phone: '9876543219',
        role: 'patient',
        verified: true,
        active: true,
        address: {
          street: 'Connaught Place',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [28.6304, 77.1874]
        },
        emergencyContacts: [{
          name: 'RADHA REDDY',
          relationship: 'Sister',
          phone: '9876543251'
        }]
      },
      {
        firstName: 'HARINI',
        lastName: 'Patel',
        email: 'harini@healx.com',
        password: 'patient1@123',
        phone: '9876543220',
        role: 'patient',
        verified: true,
        active: true,
        address: {
          street: 'Khan Market',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110003',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [28.5975, 77.2175]
        },
        emergencyContacts: [{
          name: 'VIKRAM PATEL',
          relationship: 'Husband',
          phone: '9876543252'
        }]
      },
      {
        firstName: 'BIRUDHA',
        lastName: 'Singh',
        email: 'birudha@healx.com',
        password: 'patient1@123',
        phone: '9876543221',
        role: 'patient',
        verified: true,
        active: true,
        address: {
          street: 'India Gate',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110011',
          country: 'India'
        },
        location: {
          type: 'Point',
          coordinates: [28.6129, 77.2295]
        },
        emergencyContacts: [{
          name: 'PRIYA SINGH',
          relationship: 'Mother',
          phone: '9876543253'
        }]
      }
    ];
    for (const patientData of patientsData) {
      patients.push(await User.create(patientData));
    }
    console.log('Patients created');

    // Create health camps
    const camps = await HealthCamp.insertMany([
      {
        name: 'Delhi Free Health Camp - Zone 1',
        description: 'Comprehensive health check-up camp for underprivileged',
        type: 'general',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-05'),
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1025]
        },
        address: {
          street: 'MG Road',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        organizer: admin._id,
        doctors: [doctors[0]._id, doctors[1]._id],
        volunteers: [volunteers[0]._id, volunteers[1]._id],
        services: ['General Checkup', 'Blood Test', 'BP Monitoring', 'Vision Test'],
        capacity: 100,
        registeredCount: 2,
        budget: 50000,
        status: 'ongoing',
        patients: [patients[0]._id, patients[1]._id]
      },
      {
        name: 'Mumbai Vaccination Drive',
        description: 'Vaccination camp for children and elderly',
        type: 'vaccination',
        startDate: new Date('2026-03-10'),
        endDate: new Date('2026-03-15'),
        location: {
          type: 'Point',
          coordinates: [19.0760, 72.8777]
        },
        address: {
          street: 'Colaba Causeway',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400005',
          country: 'India'
        },
        organizer: admin._id,
        doctors: [doctors[1]._id],
        volunteers: [volunteers[0]._id],
        services: ['Vaccination', 'Health Card Issuance'],
        capacity: 150,
        registeredCount: 0,
        budget: 75000,
        status: 'planned'
      }
    ]);
    console.log('Health camps created');

    // Create ambulances
    const ambulances = await Ambulance.insertMany([
      {
        ambulanceId: 'AMB001',
        registrationNumber: 'DL01AB0001',
        driver: drivers[0]._id,
        assistant: volunteers[0]._id,
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1025]
        },
        baseStation: 'Delhi Central Station',
        status: 'available',
        equipment: ['Stretcher', 'Oxygen Tank', 'Defibrillator', 'First Aid Kit'],
        capacity: 2,
        model: 'Ambulance Type - B',
        year: 2022,
        features: ['GPS Tracking', 'AC', 'Oxygen Supply'],
        lastMaintenanceDate: new Date('2026-02-01'),
        fuelLevel: 85
      },
      {
        ambulanceId: 'AMB002',
        registrationNumber: 'DL01AB0002',
        driver: drivers[1]._id,
        assistant: volunteers[1]._id,
        location: {
          type: 'Point',
          coordinates: [28.7050, 77.1030]
        },
        baseStation: 'Delhi South Station',
        status: 'available',
        equipment: ['Stretcher', 'Oxygen Tank', 'Defibrillator', 'First Aid Kit', 'Ventilator'],
        capacity: 2,
        model: 'Ambulance Type - A',
        year: 2023,
        features: ['GPS Tracking', 'AC', 'Oxygen Supply', 'Telemedicine'],
        lastMaintenanceDate: new Date('2026-02-15'),
        fuelLevel: 92
      }
    ]);
    console.log('Ambulances created');

    // Create mock emergencies
    const emergencies = await Emergency.insertMany([
      {
        emergencyId: 'EMG001',
        caller: patients[0]._id,
        emergencyType: 'cardiac',
        severity: 'critical',
        predictedSeverity: {
          score: 0.95,
          confidence: 0.92,
          prediction: 'critical'
        },
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1025]
        },
        address: 'MG Road, Delhi',
        description: 'Chest pain, difficulty breathing',
        symptoms: ['Chest Pain', 'Shortness of Breath', 'Dizziness'],
        vitals: {
          heartRate: 110,
          bloodPressure: '160/100',
          temperature: 98.6,
          respirationRate: 24,
          oxygenLevel: 88
        },
        patient: patients[0]._id,
        assignedAmbulance: ambulances[0]._id,
        assignedDoctor: doctors[1]._id,
        status: 'in_transit',
        priority: 1,
        arrivedAt: new Date()
      },
      {
        emergencyId: 'EMG002',
        caller: patients[1]._id,
        emergencyType: 'trauma',
        severity: 'high',
        predictedSeverity: {
          score: 0.75,
          confidence: 0.88,
          prediction: 'high'
        },
        location: {
          type: 'Point',
          coordinates: [28.7041, 77.1035]
        },
        address: 'Connaught Place, Delhi',
        description: 'Accident victim with head injury',
        symptoms: ['Head Injury', 'Bleeding'],
        vitals: {
          heartRate: 105,
          bloodPressure: '140/90',
          temperature: 98.4,
          respirationRate: 20,
          oxygenLevel: 95
        },
        patient: patients[1]._id,
        assignedAmbulance: ambulances[1]._id,
        assignedDoctor: doctors[0]._id,
        status: 'accepted',
        priority: 2
      }
    ]);
    console.log('Emergencies created');

    // Create medical records
    await MedicalRecord.insertMany([
      {
        recordId: 'REC001',
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        recordType: 'diagnosis',
        diagnosis: 'Hypertension',
        symptoms: ['Headache', 'Dizziness'],
        prescription: [
          {
            medicine: 'Amlodipine',
            dosage: '5mg',
            frequency: 'Once daily',
            duration: '30 days'
          }
        ],
        vitals: {
          heartRate: 80,
          bloodPressure: '140/90',
          temperature: 98.6,
          weight: 70,
          height: 170,
          bmi: 24.2
        },
        camp: camps[0]._id,
        notes: 'Patient shows signs of stage 2 hypertension. Refer to specialist.'
      },
      {
        recordId: 'REC002',
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        recordType: 'lab_report',
        diagnosis: 'Diabetes Type 2',
        labTests: [
          {
            testName: 'Fasting Blood Sugar',
            result: '145',
            unit: 'mg/dL',
            referenceRange: '70-100',
            abnormal: true
          }
        ],
        camp: camps[0]._id,
        notes: 'Recent diagnosis. Refer dietary counseling.'
      },
      {
        recordId: 'REC003',
        patient: patients[2]._id,
        doctor: doctors[0]._id,
        recordType: 'diagnosis',
        diagnosis: 'Asthma - Moderate Persistent',
        symptoms: ['Shortness of Breath', 'Wheezing', 'Chest Tightness'],
        prescription: [
          {
            medicine: 'Albuterol Inhaler',
            dosage: '2 puffs',
            frequency: 'As needed',
            duration: 'Ongoing'
          },
          {
            medicine: 'Fluticasone Propionate',
            dosage: '110 mcg',
            frequency: 'Twice daily',
            duration: '90 days'
          }
        ],
        vitals: {
          heartRate: 78,
          bloodPressure: '120/80',
          temperature: 98.4,
          respirationRate: 18,
          weight: 65,
          height: 168,
          bmi: 23.0,
          oxygenLevel: 96
        },
        allergies: ['Pollen', 'Dust Mites'],
        medicalHistory: ['Childhood Asthma', 'Seasonal Allergies'],
        camp: camps[0]._id,
        notes: 'ABISHEK presents with well-controlled asthma. Continue current medication regimen. Follow-up in 3 months.'
      },
      {
        recordId: 'REC004',
        patient: patients[3]._id,
        doctor: doctors[1]._id,
        recordType: 'lab_report',
        diagnosis: 'Cholesterol - Elevated',
        labTests: [
          {
            testName: 'Total Cholesterol',
            result: '240',
            unit: 'mg/dL',
            referenceRange: '<200',
            abnormal: true
          },
          {
            testName: 'LDL Cholesterol',
            result: '165',
            unit: 'mg/dL',
            referenceRange: '<100',
            abnormal: true
          },
          {
            testName: 'HDL Cholesterol',
            result: '39',
            unit: 'mg/dL',
            referenceRange: '>40',
            abnormal: true
          }
        ],
        vitals: {
          heartRate: 82,
          bloodPressure: '130/85',
          temperature: 98.5,
          weight: 82,
          height: 172,
          bmi: 27.7
        },
        prescription: [
          {
            medicine: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '90 days'
          }
        ],
        camp: camps[0]._id,
        notes: 'DEVARANJAN has elevated cholesterol levels. Started on statin therapy. Recommend lifestyle changes and dietary modifications.'
      },
      {
        recordId: 'REC005',
        patient: patients[4]._id,
        doctor: doctors[0]._id,
        recordType: 'diagnosis',
        diagnosis: 'Thyroid Dysfunction - Hypothyroidism',
        symptoms: ['Fatigue', 'Weight Gain', 'Cold Sensitivity'],
        prescription: [
          {
            medicine: 'Levothyroxine',
            dosage: '50 mcg',
            frequency: 'Once daily',
            duration: 'Ongoing'
          }
        ],
        labTests: [
          {
            testName: 'TSH Level',
            result: '8.5',
            unit: 'mIU/L',
            referenceRange: '0.4-4.0',
            abnormal: true
          }
        ],
        vitals: {
          heartRate: 58,
          bloodPressure: '115/78',
          temperature: 97.2,
          weight: 72,
          height: 162,
          bmi: 27.4
        },
        medicalHistory: ['Iodine deficiency'],
        camp: camps[0]._id,
        notes: 'HARINI diagnosed with hypothyroidism. TSH levels elevated. Started on thyroid replacement therapy. Recheck TSH in 6 weeks.'
      },
      {
        recordId: 'REC006',
        patient: patients[5]._id,
        doctor: doctors[1]._id,
        recordType: 'vaccine',
        diagnosis: 'Routine Vaccination',
        prescription: [
          {
            medicine: 'COVID-19 Vaccine Booster',
            dosage: '0.5mL',
            frequency: 'Single dose',
            duration: 'One time'
          }
        ],
        vitals: {
          heartRate: 72,
          bloodPressure: '118/76',
          temperature: 98.6,
          weight: 58,
          height: 160,
          bmi: 22.7
        },
        camp: camps[1]._id,
        visitReason: 'Vaccination Booster',
        notes: 'BIRUDHA received COVID-19 vaccine booster at Mumbai Vaccination Drive. No adverse reactions observed. Post-vaccination monitoring completed.'
      }
    ]);
    console.log('Medical records created');

    // Create notifications
    await Notification.insertMany([
      {
        notificationId: 'NOT001',
        recipient: patients[0]._id,
        sender: doctors[1]._id,
        type: 'appointment',
        title: 'Follow-up Appointment',
        message: 'You have an appointment scheduled for emergency follow-up.',
        priority: 'high',
        status: 'delivered'
      },
      {
        notificationId: 'NOT002',
        recipient: patients[1]._id,
        sender: admin._id,
        type: 'camp_update',
        title: 'Health Camp Registration',
        message: 'You are registered for Delhi Free Health Camp.',
        priority: 'medium',
        status: 'delivered'
      }
    ]);
    console.log('Notifications created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  require('dotenv').config();
  seedDatabase();
}

module.exports = seedDatabase;
