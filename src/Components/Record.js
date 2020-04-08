import React, { useState, useEffect, useContext } from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { FirebaseContext } from '../firebase/index';
import Form from 'react-bootstrap/Form'


const RecordScreen = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [blobObj, setBlobObj] = useState({});
    const [isBlocked, setIsBlocked] = useState(false);
    const [title, setTitle] = useState(null);
    const [fbRecordings, setfbRecordings] = useState(null);
    let audioRef = React.createRef();
    const firebase = useContext(FirebaseContext);
    useEffect(() => {
        audioRef.load(); //call this to just preload the audio without playing
        let recordings = firebase.getRecordings();
        console.log('storyscreen', recordings);
        recordings.on('value', snap => {
            // convert messages list from snapshot
            console.log('get recordings', snap.val());
            setfbRecordings(snap.val());
        });
    }, [isRecording, blobUrl, blobObj]);

    const start = () => {
        setIsRecording(true);
    };

    const stop = () => {
        setIsRecording(false);
    };
    const onData = (recordedBlob) => {
        // console.log('chunk of real-time data is: ', recordedBlob);
    }

    const onStop = (recordedBlob) => {
        console.log('recordedBlob is: ', recordedBlob);
        setBlobUrl(recordedBlob.blobURL);
        setBlobObj({ ...recordedBlob });
        // setBlobUrl(recordedBlob);
    }
    return (
        <FirebaseContext.Consumer>
            {firebase => {
                return (
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div>
                                    <ReactMic
                                        record={isRecording}         // defaults -> false.  Set to true to begin recording
                                        className={'recorder-mic'}       // provide css class name
                                        onStop={onStop}        // callback to execute when audio stops recording
                                        onData={onData}        // callback to execute when chunk of audio data is available
                                        strokeColor="#000000"       //stroke color
                                        backgroundColor="#FF4081" // background color
                                        mimeType='audio/mp3'       // defaults -> audio/wav. Set audio/mp3 to switch to MP3
                                    />
                                </div>
                                <div>
                                    <audio ref={(input) => { audioRef = input }} controls="controls">
                                        <source src={blobUrl} type="audio/mp3" />
                                    </audio>
                                </div>
                                <div>
                                    <Form>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Story Title</Form.Label>
                                            <Form.Control type="text" placeholder="Story Title" onChange={(e) => { setTitle(e.target.value) }} />
                                            <Form.Text className="text-muted">
                                                Read Read Read! - {title}
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div>
                                    <button onClick={start} type="button" disabled={isRecording}>Start</button>
                                    <button onClick={stop} type="button" disabled={!isRecording}>Stop</button>
                                    <button onClick={() => firebase.saveRecording(blobObj, title)} type="button" disabled={isRecording || !blobUrl}>Save</button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="story-container">
                                    {fbRecordings !== null ? (Object.keys(fbRecordings).reverse().map(recId => (
                                        <div key={recId} className="row story">
                                            <div className="col-md-6">
                                                <h4>{fbRecordings[recId].title}</h4>
                                                <small>{fbRecordings[recId].date}</small>
                                            </div>
                                            <div className="col-md-6">
                                                <audio ref={(input) => { audioRef = input }} controls="controls">
                                                    <source src={fbRecordings[recId].url} type="audio/mp3" />
                                                </audio>
                                                <button onClick={() => firebase.deleteRecording(fbRecordings[recId].filename, recId)}>Delete</button>
                                            </div>
                                        </div>
                                    ))) : <h1>Audio not found</h1>}
                                </div>
                            </div>
                        </div>
                    </div>)
            }}
        </FirebaseContext.Consumer>
    )
}

export default RecordScreen;