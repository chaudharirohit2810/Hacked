import { Button, Divider, Grid, Typography } from "@material-ui/core";
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
            loading: true,
            marksObtained: 0,
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
            // console.log(questionAnswer);
            this.setState({
                questionAnswer,
                marksObtained: marks,
                loading: false,
            });
        } catch (error) {
            console.log(error.message);
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        const { questionAnswer, loading, marksObtained } = this.state;
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
                        <div>
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
