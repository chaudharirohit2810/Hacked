import {
    Button,
    FormControlLabel,
    Icon,
    Paper,
    Radio,
    RadioGroup,
    Typography,
} from "@material-ui/core";
import ArrowRight from "@material-ui/icons/ArrowForwardOutlined";
import _ from "lodash";
import React, { useState } from "react";
import Style from "./exam.module.scss";

const QuestionCard = ({ currentQuestion, setCurrentQuestion }) => {
    const [selected, setselected] = useState("option0");
    return (
        <Paper className={Style.question_container} variant="outlined">
            <Typography variant="h5" gutterBottom>
                What is a question {currentQuestion} ?
            </Typography>
            <RadioGroup
                value={selected}
                onChange={(e) => setselected(e.target.value)}
            >
                {_.times(4, (i) => (
                    <FormControlLabel
                        control={<Radio />}
                        value={`option${i + 1}`}
                        key={i}
                        label={`Option ${i + 1}`}
                    />
                ))}
            </RadioGroup>

            <Button
                variant="contained"
                color="primary"
                style={{ justifySelf: "end", alignSelf: "flex-end" }}
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                endIcon={<ArrowRight />}
            >
                Next
            </Button>
        </Paper>
    );
};

export default QuestionCard;
