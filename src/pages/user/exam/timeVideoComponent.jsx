import React from "react";
import Style from "./exam.module.scss";
import CountDownTimer from "./countdownTimer";
import { Paper, Typography } from "@material-ui/core";
import Video from "./video";

const TimeVideoComponent = ({ endTime, warnings, setWarnings }) => {
    return (
        <Paper className={Style.time_container} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>
                Time remaining:{" "}
            </Typography>
            <CountDownTimer endTime={endTime} />
            {/* <Typography variant="subtitle1" style={{ marginTop: "1rem" }}>
                Video component will be right here
            </Typography> */}
            <Video warnings={warnings} setWarnings={setWarnings} />
        </Paper>
    );
};

export default TimeVideoComponent;
