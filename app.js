// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userContainer = document.getElementById('user-container');
const userEmail = document.getElementById('user-email');
const profileImage = document.getElementById('profile-image');
const fileInput = document.getElementById('file');

// Check if user is logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    userContainer.style.display = 'block';
    userEmail.innerText = user.email;
    // Get profile image
    const storageRef = firebase.storage().ref(`users/${user.uid}/profile.jpg`);
    storageRef.getDownloadURL().then(function(url) {
      profileImage.src = url;
    }).catch(function(error) {
      console.log(error);
    });
  } else {
    // User is signed out
    userContainer.style.display = 'none';
  }
});

// Login function
function login() {
  const email = emailInput.value;
  const password = passwordInput.value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Signup function
function signup() {
  const email = emailInput.value;
  const password = passwordInput.value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Logout function
function logout() {
  firebase.auth().signOut();
}

// Upload profile picture
function uploadFile() {
  const file = fileInput.files[0];
  const user = firebase.auth().currentUser;
  if (user) {
    const storageRef = firebase.storage().ref(`users/${user.uid}/profile.jpg`);
    storageRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      // Refresh profile image
      storageRef.getDownloadURL().then(function(url) {
        profileImage.src = url;
      }).catch(function(error) {
        console.log(error);
      });
    }).catch(function(error) {
      console.error('Error uploading file:', error);
    });
  } else {
    console.error('No user signed in');
  }
}
