import { Paper } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const CountDownTimer = ({ endTime }) => {
    const calculateTimeLeft = () => {
        let difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: (
                    "0" + Math.floor((difference / 1000 / 60) % 60)
                ).slice(-2),
                seconds: ("0" + Math.floor((difference / 1000) % 60)).slice(-2),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <Paper
                style={{
                    padding: "1rem",
                    textAlign: "center",
                }}
                key={interval}
                variant="outlined"
            >
                <div>
                    <span style={{ fontSize: "1.75rem" }}>
                        {timeLeft[interval]}
                    </span>
                </div>
                <div>{interval}</div>
            </Paper>
        );
    });

    return (
        <div>
            <div style={{ display: "flex" }}>
                {timerComponents.length ? (
                    timerComponents
                ) : (
                    <span>Time's up!</span>
                )}
            </div>
        </div>
    );
};

export default CountDownTimer;
