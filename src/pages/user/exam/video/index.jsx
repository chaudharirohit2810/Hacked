import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { secureStorage } from "../../../../config";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const VideoComponent = ({ warnings, setWarnings }) => {
    const videoCompo = useRef(null);

    let stopSetInterval = null;

    const [labeledDescriptors, setLabeledDescriptors] = useState(null);
    let stream = null;
    let warningCount = secureStorage.getItem("faceWarnings")
        ? parseInt(secureStorage.getItem("faceWarnings"))
        : 0;
    const [error, setError] = useState("");

    const loadLabeledImages = () => {
        const labels = ["Student"]; // for WebCam
        return Promise.all(
            labels.map(async (label) => {
                const descriptions = [];
                const images = JSON.parse(secureStorage.getItem("userImage"));
                for (let i = 0; i < images.length; i++) {
                    const imgEle = document.createElement("img");
                    imgEle.src = images[i];
                    const detections = await faceapi
                        .detectSingleFace(imgEle)
                        .withFaceLandmarks()
                        .withFaceDescriptor();

                    descriptions.push(detections.descriptor);
                }

                return new faceapi.LabeledFaceDescriptors(label, descriptions);
            })
        );
    };

    async function startVideoListener(e) {
        const mainVideo = e.target;
        const videoContainer = document.getElementById("canvasContainer");
        if (labeledDescriptors) {
            const canvas = faceapi.createCanvasFromMedia(mainVideo);
            videoContainer.innerHTML = "";
            videoContainer.append(canvas);

            const faceMatcher = new faceapi.FaceMatcher(
                labeledDescriptors,
                0.7
            );

            const displaySize = {
                width: videoCompo.current.width,
                height: videoCompo.current.height,
            };

            faceapi.matchDimensions(canvas, displaySize);

            stopSetInterval = setInterval(async () => {
                // console.log("Inside interval");
                const detections = await faceapi
                    .detectAllFaces(mainVideo)
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
                // console.log(results);
                if (results.length !== 1) {
                    warningCount += 1;
                    secureStorage.setItem("faceWarnings", warningCount);
                    setError(`Your face is not getting detected.`);
                    return;
                }
                if (results[0]._label !== "Student") {
                    warningCount += 1;
                    secureStorage.setItem("faceWarnings", warningCount);
                    setError(`Your face is not getting detected.`);
                    return;
                }
                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, {
                        label: result.toString(),
                    });
                    drawBox.draw(canvas);
                });
            }, 3000);
        }
    }

    useEffect(() => {
        async function setupVideo() {
            try {
                const model_path = `${process.env.PUBLIC_URL}/models`;
                await faceapi.nets.ssdMobilenetv1.loadFromUri(model_path);
                await faceapi.nets.faceRecognitionNet.loadFromUri(model_path);
                await faceapi.nets.faceLandmark68Net.loadFromUri(model_path);

                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                videoCompo.current.srcObject = stream;
                const tempLabel = await loadLabeledImages();
                setLabeledDescriptors(tempLabel);
                videoCompo.current.play();
            } catch (error) {
                setError(error.message);
                console.log(error.message);
            }
        }
        setupVideo();

        return function cleanup() {
            clearInterval(stopSetInterval);
            // videoCompo.current.pause();
            if (stream) {
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });
            }
        };
    }, []);

    return (
        <div
            id="videoContainer"
            style={{
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Snackbar
                open={error !== ""}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
            <div
                style={{
                    width: "300px",
                    height: "240px",
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                id="canvasContainer"
            ></div>
            <video
                id="videoInput"
                width="300"
                height="240"
                muted
                ref={videoCompo}
                onPlay={startVideoListener}
                autoPlay={false}
            />
        </div>
    );
};

export default VideoComponent;
