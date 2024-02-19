import React, { useEffect, useState } from "react";
import '../def/style.css'; 

const Aud = ({ audioFiles, currentAudioIndex, setCurrentAudioIndex }) => {
    const [audio, setAudio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const newAudio = new Audio(audioFiles[currentAudioIndex].url);
        setAudio(newAudio);

        localStorage.setItem('currentAudioIndex', currentAudioIndex);

        newAudio.addEventListener('ended', () => {
            if (currentAudioIndex < audioFiles.length - 1) {
                setCurrentAudioIndex(currentAudioIndex + 1);
            } else {
                setCurrentAudioIndex(0);
            }
        });

        newAudio.addEventListener('timeupdate', () => {
            setCurrentTime(newAudio.currentTime);
            setDuration(newAudio.duration);
        });

        return () => {
            newAudio.pause();
            newAudio.removeEventListener('ended', () => {});
            newAudio.removeEventListener('timeupdate', () => {});
        };
    }, [currentAudioIndex, audioFiles, setCurrentAudioIndex]);

    const togglePlayPause = () => {
        if (audio.paused) {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error('Failed to play audio:', error);
            });
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="audio-player-container">
            <h2 className="now-playing">Now Playing: {audioFiles[currentAudioIndex].name}</h2>
            <div className="audio-controls">
                <audio controls autoPlay={false} onEnded={() => setIsPlaying(false)}>
                    <source src={audioFiles[currentAudioIndex].url} type="audio/mp3" />
                    Your browser does not support the audio tag.
                </audio>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>
                <div className="time">
                    <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                </div>
                <div className="buttons-container">
                    <button className={`play-pause-button`} onClick={togglePlayPause} style={{ backgroundColor: isPlaying ? 'Orange' : 'green', border: 'none' }}>{isPlaying ? 'Pause' : 'Play'}</button>
                </div>
            </div>
        </div>
    );
};

export default Aud;
