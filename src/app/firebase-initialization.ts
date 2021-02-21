import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { environment } from '../environments/environment';

const app = firebase.initializeApp(environment.firebaseConfig);
app.auth().useEmulator('http://localhost:9099');
app.firestore().useEmulator('localhost', 8080);
app.functions().useEmulator('localhost', 5001);
