import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import ArrowRight from "@material-ui/icons/ArrowForwardOutlined";
import ArrowLeft from "@material-ui/icons/ArrowBackOutlined";
import _ from "lodash";
import React from "react";
import Style from "./exam.module.scss";

const QuestionCard = ({
  currentQuestion,
  setCurrentQuestion,
  question,
  totalQuestions,
  answers,
  setAnswers,
  onSubmit,
}) => {
  return (
    <Paper className={Style.question_container} variant="outlined">
      <Typography variant="h5">{question.question}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Marks: {question.marks}
      </Typography>
      <RadioGroup
        value={answers[currentQuestion - 1]}
        onChange={(e) => {
          var temp = [...answers];
          temp[currentQuestion - 1] = e.target.value;
          setAnswers(temp);
        }}
      >
        {_.times(4, (i) => (
          <FormControlLabel
            control={<Radio />}
            value={question.options[i]}
            key={i}
            label={question.options[i]}
          />
        ))}
      </RadioGroup>

      <div
        style={{
          width: "100%",
          marginTop: "1.5rem",
        }}
      >
        {currentQuestion !== 1 && (
          <Button
            variant="contained"
            color="secondary"
            style={{ float: "left" }}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            endIcon={<ArrowLeft />}
          >
            Prev
          </Button>
        )}

        {totalQuestions !== currentQuestion ? (
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            endIcon={<ArrowRight />}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onSubmit}
            style={{
              float: "right",
              backgroundColor: "#1ab2ff",
              color: "white",
            }}
          >
            Submit
          </Button>
        )}
      </div>
    </Paper>
  );
};

export default QuestionCard;
