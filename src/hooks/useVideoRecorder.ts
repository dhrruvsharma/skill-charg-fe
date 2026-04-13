import { useRef, useState } from "react";

type VideoState = "idle" | "recording" | "processing";

export function useVideoRecorder() {
    const [state, setState] = useState<VideoState>("idle");
    const streamRef = useRef<MediaStream | null>(null);

    // Full-session recorder — runs the entire call duration
    const fullRecorderRef = useRef<MediaRecorder | null>(null);
    const fullChunksRef = useRef<Blob[]>([]);

    // Per-message segment recorder — starts/stops per user answer
    const segmentRecorderRef = useRef<MediaRecorder | null>(null);
    const segmentChunksRef = useRef<Blob[]>([]);

    const resolveMimeType = () =>
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
            ? "video/webm;codecs=vp9,opus"
            : "video/webm";

    /** Open camera/mic and start the continuous full-session recorder. */
    const start = async (): Promise<MediaStream> => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        streamRef.current = stream;
        fullChunksRef.current = [];

        const fullRecorder = new MediaRecorder(stream, { mimeType: resolveMimeType() });
        fullRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) fullChunksRef.current.push(e.data);
        };
        fullRecorder.start(1000); // flush a chunk every second so data isn't lost
        fullRecorderRef.current = fullRecorder;

        return stream;
    };

    /** Start recording a per-message segment (does NOT affect the full recorder). */
    const startSegment = () => {
        const stream = streamRef.current;
        if (!stream) return;

        segmentChunksRef.current = [];
        const segmentRecorder = new MediaRecorder(stream, { mimeType: resolveMimeType() });
        segmentRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) segmentChunksRef.current.push(e.data);
        };
        segmentRecorder.start();
        segmentRecorderRef.current = segmentRecorder;
        setState("recording");
    };

    /** Stop the current segment and return its blob for upload. Full recorder keeps going. */
    const stopSegment = (): Promise<Blob> => {
        return new Promise((resolve) => {
            const recorder = segmentRecorderRef.current;
            if (!recorder) {
                setState("idle");
                resolve(new Blob([], { type: "video/webm" }));
                return;
            }
            recorder.onstop = () => {
                const blob = new Blob(segmentChunksRef.current, { type: "video/webm" });
                setState("idle");
                resolve(blob);
            };
            recorder.stop();
            setState("processing");
        });
    };

    /** Stop the full-session recorder, kill the stream, and return the complete recording blob. */
    const stop = (): Promise<Blob> => {
        return new Promise((resolve) => {
            const fullRecorder = fullRecorderRef.current;
            const cleanup = () => {
                streamRef.current?.getTracks().forEach((t) => t.stop());
                streamRef.current = null;
                fullRecorderRef.current = null;
            };

            if (!fullRecorder || fullRecorder.state === "inactive") {
                cleanup();
                resolve(new Blob(fullChunksRef.current, { type: "video/webm" }));
                return;
            }

            fullRecorder.onstop = () => {
                const blob = new Blob(fullChunksRef.current, { type: "video/webm" });
                cleanup();
                resolve(blob);
            };
            fullRecorder.stop();
        });
    };

    return { state, start, startSegment, stopSegment, stop };
}
