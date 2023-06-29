import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import React, { useState } from "react";

const MediaRecorderComponent: React.FC = () => {
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
        null
    );
    const [recording, setRecording] = useState(false);
    const [videoOutputStatus, setVideoOutputStatus] = useState("");

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        const recorder = new MediaRecorder(stream);

        let chunks: BlobPart[] = [];

        recorder.ondataavailable = (e: BlobEvent) => {
            chunks.push(e.data);
        };

        recorder.onstop = async () => {
            setVideoOutputStatus("Processing...");
            const webmBlob = new Blob(chunks, { type: "video/webm" });

            const transcodeToMp4 = async (webmBlob: Blob) => {
                try {
                    const ffmpeg = createFFmpeg({ log: true });
                    await ffmpeg.load();
                    ffmpeg.FS(
                        "writeFile",
                        "video.webm",
                        await fetchFile(webmBlob)
                    );
                    await ffmpeg.run("-i", "video.webm", "video.mp4");
                    return ffmpeg.FS("readFile", "video.mp4");
                } catch (e) {
                    console.error("Error during video transcoding:", e);
                    setVideoOutputStatus(
                        "Error during video transcoding. Check console for details."
                    );
                }
            };

            const mp4Data = await transcodeToMp4(webmBlob);
            if (!mp4Data) return; // Check if transcoding was successful

            const mp4Blob = new Blob([mp4Data.buffer], { type: "video/mp4" });
            setVideoOutputStatus(`Video file size: ${mp4Blob.size / 1000} KB`);

            const url = URL.createObjectURL(mp4Blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = url;
            a.download = "video.mp4";
            a.click();
            window.URL.revokeObjectURL(url);
            chunks = [];
        };

        recorder.start();

        setMediaRecorder(recorder);
        setRecording(true);
    };

    const stopRecording = () => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        setRecording(false);
    };

    return (
        <div>
            <button onClick={startRecording} disabled={recording}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!recording}>
                Stop Recording
            </button>
            <p>{videoOutputStatus}</p>
        </div>
    );
};

export default MediaRecorderComponent;
