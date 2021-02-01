import React from "react";
import Style from "./exam.module.scss";
import CountDownTimer from "./countdownTimer";
import { Paper, Typography } from "@material-ui/core";

const TimeVideoComponent = () => {
    return (
        <Paper className={Style.time_container} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>
                Time remaining:{" "}
            </Typography>
            <CountDownTimer />
            <Typography variant="subtitle1" style={{ marginTop: "1rem" }}>
                Video component will be right here
            </Typography>
        </Paper>
    );
};

export default TimeVideoComponent;
