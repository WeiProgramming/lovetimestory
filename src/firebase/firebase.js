import app from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyA6br4PF4_cirw-OLuLxPdh4Xb-4bXKk_U",
    authDomain: "lovetimestory-9f6c1.firebaseapp.com",
    databaseURL: "https://lovetimestory-9f6c1.firebaseio.com",
    projectId: "lovetimestory-9f6c1",
    storageBucket: "lovetimestory-9f6c1.appspot.com",
    messagingSenderId: "643172285720",
    appId: "1:643172285720:web:1b7b499c1c3c75739e726d",
    measurementId: "G-YSF8RX32BS"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.db = app.database();
        this.storageRef = app.storage().ref();
        this.date = new Date();
    }
    saveRecording = (blob, title) => {
        // unique string, YYYYMMDDHHMMSS
        let dateString = `${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}${this.date.getUTCHours()}${this.date.getUTCMinutes()}${this.date.getUTCSeconds()}`;
        
        console.log('saving blob', blob);
        this.storageRef.child(`${dateString}.mp3`).put(blob['blob']).then(snap => {
            console.log('uploaded', snap);
            console.log('storage file name', snap['metadata'].name);
            snap.ref.getDownloadURL().then(url => {
                console.log('now putting data to db');
                // save to db after uploaded to storage
                this.db.ref(`/recordings`).push({ "title": `${title}`, "url": `${url}`, "date": `${this.date.toDateString()}`, "filename": `${snap['metadata'].name}` }).then(snap => {
                    console.log('uploaded', snap.key);
                })
            })
        });
    }
    getRecordings = () => {
        return this.db.ref('recordings/');
    }
    deleteRecording = (storageFileName, fbKey) => {
        console.log('database fb key', fbKey);
        this.storageRef.child(`${storageFileName}`).delete().then(res => {
            console.log('deleted successfully, now deleting in database');
            this.db.ref(`/recordings/${fbKey}`).remove();
        })
    }
}

export default Firebase;