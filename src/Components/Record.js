import React, { useState, useEffect } from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';
import { FirebaseContext } from '../firebase/index';
import Form from 'react-bootstrap/Form'


const RecordScreen = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [blobUrl, setBlobUrl] = useState(null);
    const [blobObj, setBlobObj] = useState({});
    const [isBlocked, setIsBlocked] = useState(false);
    const [title, setTitle] = useState(null);
    let audioRef = React.createRef();
    useEffect(() => {
        console.log('isRecording', isRecording);
        console.log('bloburl', blobUrl);
        console.log('blobuObj', blobObj);
        audioRef.load(); //call this to just preload the audio without playing
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
                    <div className="container">
                        <div>
                            <ReactMic
                                record={isRecording}         // defaults -> false.  Set to true to begin recording
                                className={'testy'}       // provide css class name
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
                                    <Form.Control type="text" placeholder="Story Title" onChange={(e) => {setTitle(e.target.value)}} />
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
                    </div>)
            }}
        </FirebaseContext.Consumer>
    )
}

export default RecordScreen;