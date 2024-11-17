// Firebase yapılandırması
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            showSection('login');
        })
        .catch((error) => {
            alert('Hata: ' + error.message);
        });
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert('Giriş başarılı!');
            showSection('forum');
            loadTopics();
        })
        .catch((error) => {
            alert('Hata: ' + error.message);
        });
}

function googleSignUp() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            alert('Google ile Kayıt başarılı!');
            showSection('forum');
            loadTopics();
        })
        .catch((error) => {
            alert('Hata: ' + error.message);
        });
}

function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            alert('Google ile Giriş başarılı!');
            showSection('forum');
            loadTopics();
        })
        .catch((error) => {
            alert('Hata: ' + error.message);
        });
}

function addTopic() {
    const newTopic = document.getElementById('newTopic').value;
    const user = firebase.auth().currentUser;

    if (!newTopic) {
        alert('Lütfen bir konu başlığı girin.');
        return;
    }

    if (user) {
        db.collection("topics").add({
            title: newTopic,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userId: user.uid
        })
        .then(() => {
            alert('Konu eklendi!');
            loadTopics();
        })
        .catch((error) => {
            alert('Hata: ' + error.message);
        });
    } else {
        alert('Lütfen giriş yapın.');
    }

    document.getElementById('newTopic').value = '';
}

function loadTopics() {
    const forumTopics = document.getElementById('forumTopics');
    forumTopics.innerHTML = '';

    db.collection("topics").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const topicDiv = document.createElement('div');
            topicDiv.classList.add('topic');
            topicDiv.innerText = doc.data().title;
            forumTopics.appendChild(topicDiv);
        });
    });
}
