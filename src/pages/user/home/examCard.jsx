import {
    Button,
    Card,
    CardActions,
    CardContent,
    makeStyles,
    Snackbar,
    Typography,
} from "@material-ui/core";
import {
    CloudDownloadOutlined as DownloadIcon,
    DoneOutlineOutlined as ExamIcon,
    PublishTwoTone as SubmitIcon,
    RateReview as RateReviewIcon,
} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { backendURL, secureStorage } from "../../../config";

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

    const history = useHistory();

    const EXAMID = item._id;
    const [savedAnswers, setSavedAnswers] = useState(
        secureStorage.getItem(`${EXAMID}_answer`)
    );

    const [answerInfoOpen, setAnswerInfoOpen] = useState(false);
    const [answerSuccessOpen, setAnswerSuccessOpen] = useState(false);
    const [reviewEnabled, setReviewEnabled] = useState(item.answer);

    const [isSavedAnswer, setIsSavedAnswer] = useState(
        savedAnswers !== null && savedAnswers !== undefined
    );

    const [downloaded, setDownloaded] = useState(
        secureStorage.getItem(item._id)
    );

    const [isSubmitted, setSubmitted] = useState(() => {
        let arr = secureStorage.getItem("submittedQuiz");
        if (!arr) {
            return false;
        }
        // arr = JSON.parse(arr);
        if (arr.find((it) => it === item._id)) {
            return true;
        }
        return false;
    });

    const [infoOpen, setInfoOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [msg, setMsg] = useState("");

    const handleAnswerSuccessClick = () => {
        setAnswerSuccessOpen(true);
    };

    const handleAnswerSuccessClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAnswerSuccessOpen(false);
    };

    const handleInfoClick = () => {
        setInfoOpen(true);
    };

    const handleAnswerInfoClick = () => {
        setAnswerInfoOpen(true);
    };

    const handleAnswerInfoClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setAnswerInfoOpen(false);
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

    const submitAnswers = () => {
        handleAnswerInfoClick();
        const data = {
            examID: item._id,
            collegeID: secureStorage.getItem("collegeID"),
            answers: savedAnswers,
            tabSwitched: secureStorage.getItem("notFocusedCount"),
            faceWarnings: secureStorage.getItem(`${item._id}_faceWarnings`),
        };
        axios
            .post(`${backendURL}/answer/submitAnswers`, data)
            .then((response) => {
                handleAnswerInfoClose();
                // console.log(response.data);
                setMsg(response.data);
                // setIsSavedAnswer(false);
                secureStorage.removeItem("notFocusedCount");
                let arr = secureStorage.getItem("submittedQuiz");
                if (!arr) {
                    arr = [];
                }
                setSubmitted(true);
                setReviewEnabled(true);
                arr.push(item._id);
                secureStorage.setItem("submittedQuiz", arr);
                secureStorage.removeItem(`${data.examID}_answer`);
                secureStorage.removeItem(`${item._id}_faceWarnings`);
                handleAnswerSuccessClick();
            })
            .catch((error) => {
                console.log(error.message);
                setMsg("Something went wrong! Please try again");
                handleAnswerInfoClose();
                handleAnswerSuccessClick();
            });
    };

    const checkReview = () => {
        secureStorage.setItem("reviewExam", item);
        history.push("/review");
    };

    return (
        <div>
            <div className={classes.root}>
                <Snackbar
                    open={answerSuccessOpen}
                    autoHideDuration={3000}
                    onClose={handleAnswerSuccessClose}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                >
                    <Alert
                        onClose={handleAnswerSuccessClose}
                        severity={msg.startsWith("Ans") ? "success" : "warning"}
                    >
                        {msg}
                    </Alert>
                </Snackbar>
            </div>
            <div className={classes.root}>
                <Snackbar
                    open={answerInfoOpen}
                    //   autoHideDuration={3000}
                    onClose={handleAnswerInfoClose}
                    anchorOrigin={{ vertical, horizontal }}
                    key={vertical + horizontal}
                >
                    <Alert onClose={handleAnswerInfoClose} severity="info">
                        Please wait, your answers are being submitted !
                    </Alert>
                </Snackbar>
            </div>
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
                                    ((isSubmitted || isSavedAnswer) &&
                                        "Exam Completed") ||
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
                            {!reviewEnabled && (
                                <>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        disabled={
                                            downloaded ||
                                            item.endTime < new Date().valueOf()
                                        }
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
                                                item.startTime <
                                                    new Date().valueOf() &&
                                                item.endTime >
                                                    new Date().valueOf()
                                            ) ||
                                            isSubmitted ||
                                            isSavedAnswer
                                        }
                                        onClick={() => {
                                            setPasswordOpen(true);
                                            setExamid(item._id);
                                        }}
                                        startIcon={<ExamIcon />}
                                    >
                                        Start exam
                                    </Button>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        size="small"
                                        disabled={isSubmitted || !isSavedAnswer}
                                        onClick={() => {
                                            submitAnswers();
                                        }}
                                        startIcon={<SubmitIcon />}
                                    >
                                        Submit Answers
                                    </Button>
                                </>
                            )}
                            <Button
                                color="secondary"
                                variant="contained"
                                size="small"
                                disabled={!reviewEnabled}
                                onClick={() => {
                                    history.push(`/userReview/${item._id}`);
                                }}
                                startIcon={<SubmitIcon />}
                            >
                                Check Review
                            </Button>
                        </>
                    )}
                    {isadmin && (
                        <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            onClick={() => {
                                checkReview();
                            }}
                            startIcon={<RateReviewIcon />}
                        >
                            View Review
                        </Button>
                    )}
                </CardActions>
            </Card>
        </div>
    );
};

export default ExamCard;
