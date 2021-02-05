import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

const VideoComponent = () => {
    const videoCompo = useRef(null);

    const loadLabeledImages = () => {
        const labels = ["Prashant Kumar"]; // for WebCam
        return Promise.all(
            labels.map(async (label) => {
                const descriptions = [];
                for (let i = 1; i <= 2; i++) {
                    const img = await faceapi.fetchImage(
                        `${process.env.PUBLIC_URL}/labeled_images/${label}/${i}.jpg`
                    );

                    const detections = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    // console.log(label + i + JSON.stringify(detections));
                    descriptions.push(detections.descriptor);
                }
                // document.body.append(label + " Faces Loaded | ");
                return new faceapi.LabeledFaceDescriptors(label, descriptions);
            })
        );
    };

    async function recognizeFaces() {
        const labeledDescriptors = await loadLabeledImages();
        // console.log(labeledDescriptors);
        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

        videoCompo.current.addEventListener("play", async () => {
            // console.log("Playing");
            const canvas = faceapi.createCanvasFromMedia(videoCompo.current);
            document.body.append(canvas);

            const displaySize = {
                width: videoCompo.current.width,
                height: videoCompo.current.height,
            };

            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                const detections = await faceapi
                    .detectAllFaces(videoCompo.current)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(
                    detections,
                    displaySize
                );

                canvas
                    .getContext("2d")
                    .clearRect(0, 0, canvas.width, canvas.height);

                const results = resizedDetections.map((d) => {
                    return faceMatcher.findBestMatch(d.descriptor);
                });
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, {
                        label: result.toString(),
                    });
                    drawBox.draw(canvas);
                });
            }, 100);
        });
    }

    useEffect(() => {
        async function setupVideo() {
            try {
                const model_path = `${process.env.PUBLIC_URL}/models`;
                await faceapi.nets.ssdMobilenetv1.loadFromUri(model_path);
                await faceapi.nets.faceRecognitionNet.loadFromUri(model_path);
                await faceapi.nets.faceLandmark68Net.loadFromUri(model_path);

                console.log("Models loaded");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                videoCompo.current.srcObject = stream;
                recognizeFaces();
            } catch (error) {
                console.log(error.message);
            }
        }
        setupVideo();
    }, []);

    return (
        <>
            <video
                id="videoInput"
                width="300"
                height="240"
                muted
                style={{ border: "2px solid red" }}
                ref={videoCompo}
                // controls
                autoPlay
            />
        </>
    );
};

export default VideoComponent;
