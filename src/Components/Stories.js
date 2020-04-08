import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase/index';
import { FaPlay, FaStop, FaPause } from 'react-icons/fa';
import { Button } from 'react-bootstrap'

const StoryScreen = () => {
    const [recordings, setRecordings] = useState(null);
    const [recordingURLs, setRecordingURLs] = useState([]);
    const [autoPlayIndex, setAutoPlayIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const firebase = useContext(FirebaseContext);
    let audioRef = React.createRef();
    let audioAllRef = React.createRef();

    useEffect(() => {
        if (isPlaying) {
            audioAllRef.pause();
            audioAllRef.load();
            audioAllRef.play();
        }
        console.log('current recordings', firebase);
        let recordings = firebase.getRecordings();
        console.log('storyscreen', recordings);
        recordings.on('value', snap => {
            // convert messages list from snapshot
            console.log('get recordings', snap.val());
            setRecordings(snap.val());
            Object.keys(snap.val()).forEach(key => {
                setRecordingURLs(prev => [snap.val()[key].url, ...prev]);
            });
        });
    }, [isPlaying, setIsPlaying, setAutoPlayIndex, autoPlayIndex])
    // const getRecordings = (firebase) => {
    //     let recordings = firebase.getRecordings();
    //     console.log('storyscreen', recordings);
    //     recordings.once('value', snap => {
    //         // convert messages list from snapshot
    //         console.log('get recordings', snap.val());
    //         // setRecordings(snap.val());

    //       });
    // }
    const autoPlay = () => {
        console.log('autoplaying', recordingURLs, autoPlayIndex);
        setIsPlaying(true);
        console.log('isplaying', isPlaying);

        audioAllRef.pause();
        audioAllRef.load();
        audioAllRef.play();
        audioAllRef.addEventListener('ended', function () {
            setAutoPlayIndex(prev => prev + 1);
            console.log('audio ended, playing next index', autoPlayIndex);
            // audioAllRef.src = recordingURLs[autoPlayIndex];
            // autoPlay();
        });
    }
    return (
        <FirebaseContext.Consumer>
            {firebase => {
                // getRecordings(firebase);
                return (
                    <div className="container story-container">
                        <div className="row">
                            <div className="col-md-12">
                                <h1 className="text-center" style={{ marginBottom: '10px' }}><strong>Story Time For Panee =^.^=</strong></h1>
                            </div>
                        </div>
                        <div className="auto-play-container">
                            <audio className={isPlaying ? '' : 'd-none'} ref={(input) => { audioAllRef = input }} controls="controls">
                                <source src={recordingURLs[autoPlayIndex]} type="audio/mp3" />
                            </audio>
                            <Button className="btn-lg" onClick={() => autoPlay()}>Play All!</Button>
                        </div>
                        {recordings !== null ? (Object.keys(recordings).reverse().map(recId => (
                            <div key={recId} className="row story">
                                <div className="col-md-6">
                                    <h5>{recordings[recId].title}</h5>
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