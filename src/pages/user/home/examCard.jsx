import {
    Button,
    Card,
    CardActions,
    CardContent,
    Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { backendURL, secureStorage } from "../../../config";
import Style from "./home.module.scss";
import DownloadIcon from "@material-ui/icons/CloudDownloadOutlined";
import ExamIcon from "@material-ui/icons/DoneOutlineRounded";
import axios from "axios";

const ExamCard = ({ item, index }) => {
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
        axios
            .get(`${backendURL}/exam/download`, { headers: { id: item._id } })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Card variant="outlined" elevation={4} style={{ marginTop: "2rem" }}>
            <CardContent>
                <Typography color="textPrimary" variant="h6">
                    {item.title || "N/A"}
                </Typography>
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
            </CardContent>
            <CardActions style={{ paddingBottom: "1rem", paddingLeft: "1rem" }}>
                <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={downloadExam}
                >
                    Download
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    disabled={!secureStorage.getItem(item._id)}
                    startIcon={<ExamIcon />}
                >
                    Start exam
                </Button>
            </CardActions>
        </Card>
    );
};

export default ExamCard;
