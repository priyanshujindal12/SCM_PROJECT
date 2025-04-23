
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';


const firebaseConfig = {
    apiKey: "AIzaSyBk5loDyP_UQALCkbOY98z6xCA0aXcP6wQ",
    authDomain: "guardian-angel-5e9f7.firebaseapp.com",
    projectId: "guardian-angel-5e9f7",
    storageBucket: "guardian-angel-5e9f7.appspot.com",
    messagingSenderId: "1085736239962",
    appId: "1:1085736239962:web:37492ea0838a045d562963",
    measurementId: "G-7X5W3HYR7F"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    const tabs = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const sosButton = document.getElementById('sosButton');
    const sosAlert = document.getElementById('sosAlert');
    const locationStatus = document.getElementById('locationStatus');
    const shareLocationButton = document.getElementById('shareLocationButton');
    const addContactForm = document.getElementById('addContactForm');
    const contactsTable = document.getElementById('contactsTable').getElementsByTagName('tbody')[0];
    const saveMessageButton = document.getElementById('saveMessageButton');
    const accountForm = document.getElementById('accountForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const logoutButton = document.getElementById('logoutButton');

    loadUserData();

    
    let currentUserId = null;
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User is signed in with UID:', user.uid);
            currentUserId = user.uid;
            const userDocRef = doc(db, 'users', user.uid);
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    console.log('User data fetched:', userData);
                    profileName.textContent = userData.name || 'USER';
                    profileEmail.textContent = userData.email || user.email;
                    document.getElementById('userName').value = userData.name || '';
                    document.getElementById('userEmail').value = userData.email || user.email;
                    
                    loadContacts(userDocRef, userData.contacts || []);
                } else {
                    console.log('No Firestore document found for user:', user.uid);
                    profileName.textContent = 'N/A';
                    profileEmail.textContent = user.email;
                    
                    await setDoc(userDocRef, { contacts: [] }, { merge: true });
                    loadContacts(userDocRef, []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
                profileName.textContent = 'Error';
                profileEmail.textContent = 'Error';
            }
        } else {
            console.log('No user signed in, redirecting to login...');
            window.location.href = 'login.html';
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log('User signed out successfully');
            localStorage.clear(); // Clear localStorage on logout
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error.message);
            alert('Failed to log out: ' + error.message);
        }
    });


    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
        });
    });


    const viewOnMapButton = document.querySelector('.thisisgood a');
    if (viewOnMapButton) {
        viewOnMapButton.addEventListener('click', () => {
            document.querySelector('.tab-content.active').classList.remove('active');
            document.getElementById('location').classList.add('active');
        });
    }

    
    sosButton.addEventListener('click', () => {
        const isActive = sosButton.classList.toggle('active');
        sosAlert.style.display = isActive ? 'flex' : 'none';
        locationStatus.textContent = isActive ? 'being shared' : 'not being shared';
        shareLocationButton.textContent = isActive ? 'Stop Sharing Location' : 'Share Location Now';

        if (isActive) {
            alert('SOS Alert activated!');
            sendLocationEmail();
        } else {
            alert('SOS Alert deactivated.');
        }
    });
    async function sendLocationEmail() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await getDoc(userDocRef);
                const contacts = userDoc.exists() ? (userDoc.data().contacts || []) : [];

                if (contacts.length > 0) {
                    const allEmails = contacts.map(contact => contact.email).join(',');
                    const sosMessage = document.getElementById('sosMessage').value;
                    const subject = encodeURIComponent('SOS Alert: Emergency Location');
                    const body = encodeURIComponent(`${sosMessage}\n${googleMapsLink}`);

                    console.log('Emails:', allEmails);
                    console.log('Subject:', subject);
                    console.log('Body:', body);

                    const mailtoLink = `mailto:${allEmails}?subject=${subject}&body=${body}`;
                    const mailWindow = window.open(mailtoLink, '_blank');

                    
                    if (!mailWindow || mailWindow.closed || typeof mailWindow.closed === 'undefined') {
                        alert('Failed to open email client. Please check your browser settings.');
                    }
                } else {
                    alert('No emergency contacts found! Please add a contact.');
                }
            }, () => {
                alert('Unable to retrieve location. Please enable GPS.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    function loadContacts(userDocRef, contacts) {
        contactsTable.innerHTML = '';
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        contacts.forEach((contact, index) => {
            const row = contactsTable.insertRow();
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td><button class="remove-contact" data-id="${index}">Remove</button></td>
            `;
            const li = document.createElement('li');
            li.textContent = `${contact.name} (${contact.email})`;
            contactsList.appendChild(li);
        });
    }

    
    addContactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const userDocRef = doc(db, 'users', currentUserId);

        try {
            await updateDoc(userDocRef, {
                contacts: arrayUnion({ name, email })
            });
            const userDoc = await getDoc(userDocRef);
            loadContacts(userDocRef, userDoc.data().contacts || []);
            addContactForm.reset();
        } catch (error) {
            console.error('Error adding contact:', error.message);
            alert('Failed to add contact: ' + error.message);
        }
    });

    contactsTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-contact')) {
            const contactId = e.target.getAttribute('data-id');
            const userDocRef = doc(db, 'users', currentUserId);
            const userDoc = await getDoc(userDocRef);
            const contacts = userDoc.data().contacts || [];
            const contactToRemove = contacts[contactId];

            try {
                await updateDoc(userDocRef, {
                    contacts: arrayRemove(contactToRemove)
                });
                const updatedDoc = await getDoc(userDocRef);
                loadContacts(userDocRef, updatedDoc.data().contacts || []);
                alert('Contact removed.');
            } catch (error) {
                console.error('Error removing contact:', error.message);
                alert('Failed to remove contact: ' + error.message);
            }
        }
    });

   
    saveMessageButton.addEventListener('click', () => {
        const message = document.getElementById('sosMessage').value;
        localStorage.setItem('sosMessage', message);
        alert('SOS message saved: ' + message);
    });

  
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const userData = { name, email };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert(`Account settings saved:\nName: ${name}\nEmail: ${email}`);
    });

    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        document.getElementById('userName').value = userData.name || '';
        document.getElementById('userEmail').value = userData.email || '';
        const savedMessage = localStorage.getItem('sosMessage');
        document.getElementById('sosMessage').value = savedMessage || "I'm in an emergency situation and need help. This is my current location:";
    }
});