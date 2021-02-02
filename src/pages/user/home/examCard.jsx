import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { secureStorage } from "../../../config";
import Style from "./home.module.scss";

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

    const calculateMarks = () => {
        let totalMarks = 0;
        for (var it in item.Questions) {
            totalMarks += parseInt(item.Questions[it]["marks"]);
        }
        return totalMarks;
    };

    return (
        <Link
            to="/exam"
            className={Style.card_link}
            onClick={() => secureStorage.setItem("selectedQuiz", index)}
        >
            <Card
                variant="outlined"
                elevation={4}
                style={{ marginTop: "2rem" }}
            >
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
                        <b>Number of Questions: </b> {item.Questions.length}
                    </Typography>

                    <Typography color="textSecondary" variant="body2">
                        <b>Total Marks: </b> {calculateMarks()}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ExamCard;
