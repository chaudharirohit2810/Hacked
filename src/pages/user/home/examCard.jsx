import React, { useState } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
    makeStyles,
    Snackbar,
} from "@material-ui/core";
import {
    CloudDownloadOutlined as DownloadIcon,
    DoneOutlineOutlined as ExamIcon,
} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";

import { backendURL, secureStorage } from "../../../config";
import crypto from "crypto-js";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ExamCard = ({ item, index, isadmin, setPasswordOpen, setExamid }) => {
    const classes = useStyles();
    const vertical = "top",
        horizontal = "center";

    const [downloaded, setDownloaded] = useState(
        secureStorage.getItem(item._id)
    );

    const [infoOpen, setInfoOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [msg, setMsg] = useState("");

    const handleInfoClick = () => {
        setInfoOpen(true);
    };

    const handleInfoClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setInfoOpen(false);
    };

    const handleSuccessClick = () => {
        setSuccessOpen(true);
    };

    const handleSuccessClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setSuccessOpen(false);
    };

    const formatDate = (date) => {
        date = new Date(date);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
    };

    const downloadExam = () => {
        handleInfoClick();
        axios
            .get(`${backendURL}/exam/download`, { headers: { id: item._id } })
            .then((res) => {
                handleInfoClose();
                setMsg("Paper Downloaded!");
                secureStorage.setItem(item._id, res.data);
                setDownloaded(true);
                handleSuccessClick();
            })
            .catch((err) => {
                console.log(err);
                setMsg("Something went wrong! Please try again");
                handleInfoClose(false);
                handleSuccessClick();
            });
    };

    return (
        <div>
            <div className={classes.root}>
                <Snackbar
                    open={successOpen}
                    autoHideDuration={3000}
                    onClose={handleSuccessClose}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                >
                    <Alert
                        onClose={handleSuccessClose}
                        severity={msg.startsWith("P") ? "success" : "warning"}
                    >
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
            <div className={classes.root}>
                <Snackbar
                    open={infoOpen}
                    //   autoHideDuration={3000}
                    onClose={handleInfoClose}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                >
                    <Alert onClose={handleInfoClose} severity="info">
                        Please wait, Paper is downloading !
                    </Alert>
                </Snackbar>
            </div>

            <Card
                variant="outlined"
                elevation={4}
                style={{ marginTop: "2rem" }}
            >
                <CardContent>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography color="textPrimary" variant="h6">
                            {item.title || "N/A"}
                        </Typography>

                        {!isadmin && (
                            <Typography
                                variant="caption"
                                className="status_info_text"
                            >
                                {(!downloaded && "Paper not Dowloaded yet") ||
                                    (item.startTime > new Date().valueOf() &&
                                        "Exam not started yet") ||
                                    (item.endTime < new Date().valueOf() &&
                                        "Exam time finished") ||
                                    "Ready to start"}
                            </Typography>
                        )}
                    </div>
                    <Typography variant="subtitle1" gutterBottom>
                        {item.subTitle || "N/A"}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>Start Time: </b> {formatDate(item.startTime)}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>End Time: </b> {formatDate(item.endTime)}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>Number of Questions: </b> {item.totalQuestions}
                    </Typography>

                    <Typography color="textSecondary" variant="body2">
                        <b>Total Marks: </b> {item.totalMarks}
                    </Typography>
                    {isadmin && (
                        <Typography color="textSecondary" variant="body2">
                            <b>Password: </b> {item.key}
                        </Typography>
                    )}
                </CardContent>
                <CardActions
                    style={{ paddingBottom: "1rem", paddingLeft: "1rem" }}
                >
                    {!isadmin && (
                        <>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                disabled={downloaded ? true : false}
                                startIcon={<DownloadIcon />}
                                onClick={downloadExam}
                            >
                                Download
                            </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                size="small"
                                disabled={
                                    !downloaded ||
                                    !(
                                        item.startTime < new Date().valueOf() &&
                                        item.endTime > new Date().valueOf()
                                    )
                                }
                                onClick={() => {
                                    setPasswordOpen(true);
                                    setExamid(item._id);
                                }}
                                startIcon={<ExamIcon />}
                            >
                                Start exam
                            </Button>
                        </>
                    )}
                </CardActions>
            </Card>
        </div>
    );
};

export default ExamCard;
