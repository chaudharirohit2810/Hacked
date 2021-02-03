import React from "react";
import _ from "lodash";
import { Paper, Typography } from "@material-ui/core";
import Style from "./exam.module.scss";

const QuestionNumberCard = ({
  totalQuestions,
  setCurrentQuestion,
  currentQuestion,
}) => {
  return (
    <Paper className={Style.question_numbers_container} variant="outlined">
      <Typography variant="subtitle1" gutterBottom>
        Question numbers:{" "}
      </Typography>
      <Paper className={Style.question_number_wrapper}>
        {_.times(totalQuestions, (i) => (
          <Paper
            key={i}
            className={Style.question_number_div}
            variant="outlined"
            elevation={i + 1 === currentQuestion ? 24 : 0}
            style={{
              backgroundColor:
                i + 1 === currentQuestion ? "#ececec" : "initial",
            }}
            onClick={() => setCurrentQuestion(i + 1)}
          >
            {i + 1}
          </Paper>
        ))}
      </Paper>
    </Paper>
  );
};

export default QuestionNumberCard;
