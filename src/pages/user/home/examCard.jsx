import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Style from "./home.module.scss";

const ExamCard = () => {
    return (
        <Link to="/exam" className={Style.card_link}>
            <Card
                variant="outlined"
                elevation={4}
                style={{ marginTop: "2rem" }}
            >
                <CardContent>
                    <Typography color="textPrimary" variant="h6">
                        Title of Quiz
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        SubTitle
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>Time: </b> 1hr
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>Number of Questions: </b> 50
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        <b>Total Marks: </b> 100
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ExamCard;
