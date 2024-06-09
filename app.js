// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const userContainer = document.getElementById('user-container');
const userEmail = document.getElementById('user-email');

// Check if user is logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    userContainer.style.display = 'block';
    userEmail.innerText = user.email;
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
