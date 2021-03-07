import {
    Button,
    CardContent,
    Divider,
    Card,
    Grid,
    Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import axios from "axios";
import React, { Component } from "react";
import { backendURL, secureStorage } from "../../../config";
import QuestionCard from "./questionCard";

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionAnswer: [],
            exam: {},
            answer: {},
            loading: true,
            marksObtained: 0,
            totalMarks: 0,
        };
    }
    async componentDidMount() {
        try {
            const response = await axios.get(`${backendURL}/exam/review/`, {
                headers: {
                    examID: this.props.match.params.examID,
                    collegeID: secureStorage.getItem("collegeID"),
                },
            });
            const { exam, answer } = response.data;
            var answers = JSON.parse(answer.answers);
            const questions = exam.Questions;
            var marks = 0;
            const questionAnswer = [];
            answers.map((item, index) => {
                const mainQuestion = questions[index];
                questionAnswer.push({
                    ...mainQuestion,
                    correct: mainQuestion.options[mainQuestion.answer] === item,
                });
                if (mainQuestion.options[mainQuestion.answer] === item) {
                    marks += parseInt(mainQuestion.marks);
                }
            });
            var totalMarks = 0;
            for (var index in exam.Questions) {
                totalMarks += parseInt(exam.Questions[index]["marks"]);
            }
            this.setState({
                exam,
                answer,
                questionAnswer,
                marksObtained: marks,
                loading: false,
                totalMarks,
            });
        } catch (error) {
            console.log(error.message);
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        const {
            questionAnswer,
            loading,
            marksObtained,
            exam,
            totalMarks,
            answer,
        } = this.state;
        return (
            <div>
                <div
                    style={{
                        margin: "0px auto",
                        maxWidth: "68rem",
                    }}
                >
                    <Grid
                        style={{
                            marginTop: "1rem",
                        }}
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Typography variant="h4">Review Answers</Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<ArrowBack />}
                                onClick={() => this.props.history.goBack()}
                            >
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider
                        style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                        }}
                    />
                    {loading ? (
                        [...Array(4)].map((d, i) => {
                            return (
                                <Typography
                                    key={i}
                                    component="div"
                                    variant="h2"
                                >
                                    <Skeleton />
                                </Typography>
                            );
                        })
                    ) : (
                        <div style={{ margin: "0 1rem" }}>
                            <Typography variant="h5">Details</Typography>
                            <Divider />
                            <Card
                                variant="outlined"
                                elevation={4}
                                style={{ margin: "1rem auto" }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="subtitle2"
                                        color="textPrimary"
                                    >
                                        Title: {`${exam.title}`}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="textPrimary"
                                    >
                                        Subtitle: {`${exam.subTitle}`}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="textPrimary"
                                    >
                                        Marks Obtained:{" "}
                                        {`${marksObtained}/${totalMarks}`}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="textPrimary"
                                    >
                                        Tab switching count:{" "}
                                        {answer.tabSwitched}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        color="textPrimary"
                                    >
                                        Face warnings: {answer.faceWarnings}
                                    </Typography>
                                    {exam.faceSwitchingLimit !== 0 &&
                                        exam.tabSwitchingLimit !== 0 && (
                                            <Typography
                                                variant="subtitle2"
                                                style={{ color: "red" }}
                                            >
                                                {(answer.faceWarnings >
                                                    parseInt(
                                                        exam.faceSwitchingLimit
                                                    ) ||
                                                    answer.tabSwitched >
                                                        parseInt(
                                                            exam.tabSwitchingLimit
                                                        )) &&
                                                    `You have exceeded the limit of tab switching (${exam.tabSwitchingLimit}) or face warnings (${exam.faceSwitchingLimit}). You will be regarded as fail`}
                                            </Typography>
                                        )}
                                </CardContent>
                            </Card>
                            <Typography
                                variant="h5"
                                style={{ marginTop: "2rem" }}
                            >
                                Questions & Answers:
                            </Typography>
                            <Divider />
                            {questionAnswer.map((item, index) => (
                                <QuestionCard
                                    item={item}
                                    key={index}
                                    index={index + 1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default Review;
