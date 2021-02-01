import React, { useState } from "react";
import { Divider, Paper, Typography } from "@material-ui/core";
import Style from "./exam.module.scss";
import QuestionCard from "./questionCard";
import QuestionNumberCard from "./questionNumberCard";
import TimeVideoComponent from "./timeVideoComponent";
const Exam = () => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 50;
    return (
        <Paper className={Style.main_container}>
            <Typography variant="h4">Title of Quiz</Typography>
            <Divider />

            <Paper variant="elevation" className={Style.components_container}>
                <QuestionNumberCard
                    totalQuestions={totalQuestions}
                    setCurrentQuestion={setCurrentQuestion}
                    currentQuestion={currentQuestion}
                />
                {currentQuestion > totalQuestions ? (
                    <Paper
                        className={Style.question_container}
                        variant="outlined"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h4"
                            style={{ textAlign: "center" }}
                        >
                            Congratulations <br></br>Question Paper Submitted!
                        </Typography>
                    </Paper>
                ) : (
                    <QuestionCard
                        number={1}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                    />
                )}
                <TimeVideoComponent />
            </Paper>
        </Paper>
    );
};

export default Exam;
