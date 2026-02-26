DATABASE_SETUP_GUIDE:

## Collection Indexes

### Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ location: "2dsphere" })

### Emergencies
db.emergencies.createIndex({ location: "2dsphere" })
db.emergencies.createIndex({ status: 1, severity: 1 })
db.emergencies.createIndex({ createdAt: -1 })
db.emergencies.createIndex({ caller: 1 })

### HealthCamps
db.healthcamps.createIndex({ location: "2dsphere" })
db.healthcamps.createIndex({ startDate: 1, endDate: 1 })
db.healthcamps.createIndex({ status: 1 })

### Ambulances
db.ambulances.createIndex({ location: "2dsphere" })
db.ambulances.createIndex({ status: 1 })
db.ambulances.createIndex({ driver: 1 })
db.ambulances.createIndex({ "locationHistory.timestamp": -1 })

### MedicalRecords
db.medicalrecords.createIndex({ patient: 1 })
db.medicalrecords.createIndex({ doctor: 1 })
db.medicalrecords.createIndex({ createdAt: -1 })
db.medicalrecords.createIndex({ recordType: 1 })

### Notifications
db.notifications.createIndex({ recipient: 1, createdAt: -1 })
db.notifications.createIndex({ status: 1 })
db.notifications.createIndex({ type: 1 })
db.notifications.createIndex({ read: 1 })

### Reports
db.reports.createIndex({ reportType: 1 })
db.reports.createIndex({ createdAt: -1 })
db.reports.createIndex({ camp: 1 })

## Data Seeding

Run: npm run seed

This will populate demo data:
- 1 Admin user
- 2 Doctors
- 2 Ambulance drivers
- 2 Volunteers
- 2 Patients
- 2 Health camps
- 2 Ambulances
- 2 Emergencies
- 2 Medical records
- 2 Notifications

## Backup & Restore

Backup:
mongodump --uri mongodb://localhost:27017/healx --out ./backup

Restore:
mongorestore --uri mongodb://localhost:27017 ./backup

## Query Examples

Find nearby emergencies:
db.emergencies.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [28.7041, 77.1025] },
      $maxDistance: 5000
    }
  }
})

Find critical emergencies:
db.emergencies.find({ severity: "critical", status: { $in: ["pending", "accepted"] } })

Find active health camps:
db.healthcamps.find({ status: "ongoing" })

Aggregation - Disease statistics:
db.medicalrecords.aggregate([
  { $match: { diagnosis: { $exists: true } } },
  { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
