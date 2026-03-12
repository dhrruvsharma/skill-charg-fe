import { useRef, useState } from "react";

type VoiceState = "idle" | "recording" | "processing";

export function useVoiceRecorder() {
    const [state, setState] = useState<VoiceState>("idle");
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setState("recording");
    };

    const stop = (): Promise<Blob> => {
        return new Promise((resolve) => {
            const recorder = mediaRecorderRef.current;
            if (!recorder) return;

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                recorder.stream.getTracks().forEach((t) => t.stop());
                setState("idle");
                resolve(blob);
            };

            recorder.stop();
            setState("processing");
        });
    };

    return { state, start, stop };
}