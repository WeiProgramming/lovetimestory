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
            snap.ref.getDownloadURL().then(url => {
                console.log('now putting data to db');
                // save to db after uploaded to storage
                this.db.ref(`/recordings`).push({ "title": `${title}`, "url": `${url}`, "date": `${this.date.toDateString()}` }).then(snap => {
                    console.log('uploaded', snap.key);
                })
            })
        });
    }
    getRecordings = () => {
        let audioList = {};
        return this.db.ref('recordings/');
        // .then(snap => {
        //     console.log('get recordings', snap.val())
        //     audioList = {...snap.val()};
        // });
        // this.storageRef.listAll().then(function (result) {
        //     result.items.forEach(function (imageRef) {
        //         // And finally display them
        //         displayImage(imageRef);
        //     });
        // }).catch(function (error) {
        //     // Handle any errors
        // });
        // function displayImage(imageRef) {
        //     imageRef.getDownloadURL().then(function (url) {
        //         // TODO: Display the image on the UI
        //         console.log('url from get', url);
        //         audioList.push({ "url": url })
        //     }).catch(function (error) {
        //         // Handle any errors
        //     });
        // }
        // array of links to add right into the audio source attribute
        // console.log('returning audio list from firebase', audioList);
        // return audioList;
    }
}

export default Firebase;