import { Divider, Paper, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { secureStorage } from "../../../config";
import useSecureStorage from "../../../hooks/useSecureStorage";
import Style from "./exam.module.scss";
import QuestionCard from "./questionCard";
import QuestionNumberCard from "./questionNumberCard";
import TimeVideoComponent from "./timeVideoComponent";

let notFocusedCount = 0;
let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

const Exam = () => {
    const his = useHistory();
    const [ isFocused, setIsFocused ] = useState("show");
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const exam = JSON.parse(
        secureStorage.getItem(secureStorage.getItem("selectedQuiz"))
    );
    const handleVisibility = () => {
        if(document[hidden]) {
            // alert("Changed Window")
            ++notFocusedCount;
            // console.log(notFocusedCount);
            setIsFocused("hide");
        } else {
            setIsFocused("show")
        }
    }

    useEffect(() => {
        document.addEventListener(visibilityChange, handleVisibility, false);
        return () => {
            document.removeEventListener(visibilityChange, handleVisibility)
        }
    }, [])

    const totalQuestions = exam ? exam.Questions.length : 0;

    const [answers, setAnswers] = useSecureStorage(
        "answers",
        Array.apply(null, Array(totalQuestions)).map(function () {
            return undefined;
        })
    );

    const [warnings, setWarnings] = useSecureStorage("warnings", 0);

    const onSubmit = () => {
        const newAnswer = JSON.stringify(answers);
        const ID = String(exam._id);
        secureStorage.setItem(`${ID}_answer`, newAnswer);
        // console.log(notFocusedCount);
        secureStorage.setItem("notFocusedCount", String(notFocusedCount));
        secureStorage.removeItem("selectedQuiz");
        his.replace("/");
    };

    if (!exam || !secureStorage.getItem("userImage")) {
        return (
            <>
                {secureStorage.removeItem("answers")}
                <Redirect to="/" />;
            </>
        );
    }

    return (
        <Paper className={Style.main_container}>
            <Typography variant="h4">Title of Quiz</Typography>
            <Divider />
            {/* {console.log(isFocused)} */}
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
                        question={exam.Questions[currentQuestion - 1]}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        totalQuestions={totalQuestions}
                        answers={answers}
                        setAnswers={setAnswers}
                        onSubmit={onSubmit}
                    />
                )}
                <TimeVideoComponent
                    endTime={exam.endTime}
                    warnings={warnings}
                    setWarnings={setWarnings}
                />
            </Paper>
        </Paper>
    );
};

export default Exam;
