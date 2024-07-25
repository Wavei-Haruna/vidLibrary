// createAdminUser.js
import { admin, db } from './admin.js';

async function createAdminUser() {
  try {
    // Create a new user
    const userRecord = await admin.auth().createUser({
      email: 'admin@gmail.com',
      password: '000000',
      displayName: 'Admin',
      phoneNumber: '+233551837449', // Ensure the phone number is in E.164 format
    });

    console.log('Successfully created new user:', userRecord.uid);

    // Set the user's custom claims to give them the admin role
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });

    // Add user data to Firestore
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      email: 'admin@gmail.com',
      name: 'Admin',
      phone: '+233551837449', // Ensure phone is a string
      role: 'admin',
    });

    console.log('Successfully set admin role and added user to Firestore');
  } catch (error) {
    console.error('Error creating new user:', error);
  }
}

createAdminUser();
