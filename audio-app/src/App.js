import React, { useState, useEffect } from 'react';
import AudioPlayer from './abc/aud';
import './def/style.css';

const initialAudioFiles = JSON.parse(localStorage.getItem('audioList')) || [
    { id: 1, name: 'Audio 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
    // Add more initial audio files as needed
];

const App = () => {
    const [audioUpload, setAudioUpload] = useState('');
    const [audioFiles, setAudioFiles] = useState(initialAudioFiles);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(parseInt(localStorage.getItem('currentAudioIndex')) || 0);
    const [uploading, setUploading] = useState(false); 
    const [showToast, setShowToast] = useState(false); 

    useEffect(() => {
        localStorage.setItem('audioList', JSON.stringify(audioFiles));
    }, [audioFiles]);

    const uploadAudioHandler = () => {
        if (audioUpload === '') return;
        setUploading(true); 
        const data = new FormData();
        data.append("file", audioUpload);
        data.append("upload_preset", "ml_default");
        data.append("cloud_name", "djib5oxng");
        data.append("resource_type", "audio");

        fetch("https://api.cloudinary.com/v1_1/dd9cmhunr/upload", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setAudioFiles([...audioFiles, { id: Date.now(), name: data.original_filename, url: data.url }]);
                setUploading(false); 
                setShowToast(true); 
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
                setUploading(false); 
            });
    };

    const deleteAudioHandler = (id) => {
        const updatedAudioFiles = audioFiles.filter(file => file.id !== id);
        setAudioFiles(updatedAudioFiles);
    };

    const handleFileChange = (e) => {
        setAudioUpload(e.target.files[0]);
        setShowToast(true); 
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className='center-container'>
            <div className='main'>
                <div>
                    <input 
                        type='file' 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        id="upload-input" 
                    />
                    <label htmlFor="upload-input" style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        border: 'none',
                        marginRight: '10px',
                    }}>Choose File</label>
                    <button 
                        onClick={uploadAudioHandler} 
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            padding: '12px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            border: 'none',
                        }}>Upload Audio</button>
                    {showToast && <div className="toast">File chosen successfully!</div>}
                    {uploading && <span>Uploading...</span>}
                </div>
                <AudioPlayer
                    audioFiles={audioFiles}
                    currentAudioIndex={currentAudioIndex}
                    setCurrentAudioIndex={setCurrentAudioIndex}
                />
                <div>
                    <h3>Playlist</h3>
                    <table className='audio-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audioFiles.map((audio) => (
                                <tr key={audio.id}>
                                    <td>{audio.name}</td>
                                    <td>
                                        <button onClick={() => setCurrentAudioIndex(audioFiles.findIndex(file => file.id === audio.id))}>Play</button>
                                        <button onClick={() => deleteAudioHandler(audio.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <h1 style={{ textAlign: 'center' }}>Enjoy the Music, Add Your Own Playlist</h1>
            </div>
        </div>
    );
};

export default App;
