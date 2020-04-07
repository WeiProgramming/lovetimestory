import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase/index';

const StoryScreen = () => {
    const [recordings, setRecordings] = useState(null);
    const firebase = useContext(FirebaseContext);
    let audioRef = React.createRef();

    useEffect(() => {
        console.log('current recordings', firebase);
        let recordings = firebase.getRecordings();
        console.log('storyscreen', recordings);
        recordings.on('value', snap => {
            // convert messages list from snapshot
            console.log('get recordings', snap.val());
            setRecordings(snap.val());
        });
    }, [])
    // const getRecordings = (firebase) => {
    //     let recordings = firebase.getRecordings();
    //     console.log('storyscreen', recordings);
    //     recordings.once('value', snap => {
    //         // convert messages list from snapshot
    //         console.log('get recordings', snap.val());
    //         // setRecordings(snap.val());

    //       });
    // }
    return (
        <FirebaseContext.Consumer>
            {firebase => {
                // getRecordings(firebase);
                return (
                    <div className="container">
                        <h2 className="text-center" style={{marginBottom: '50px'}}><strong>Story Time For Panee =^.^=</strong></h2>
                        {recordings !== null ? (Object.keys(recordings).reverse().map(recId => (
                            <div key={recId} className="row story">
                                <div className="col-md-6">
                                    <h3>{recordings[recId].title}</h3>
                                    <small>{recordings[recId].date}</small>
                                </div>
                                <div className="col-md-6">
                                    <audio ref={(input) => { audioRef = input }} controls="controls">
                                        <source src={recordings[recId].url} type="audio/mp3" />
                                    </audio>
                                </div>
                            </div>
                        ))) : <h1>Audio not found</h1>}
                    </div>
                )
            }}
        </FirebaseContext.Consumer>
    )
}

export default StoryScreen;