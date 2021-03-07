import React, { useState } from "react";
import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  Grid,
  Modal,
  Backdrop,
  Fade,
  GridList,
  GridListTile,
} from "@material-ui/core";
import ArrowRight from "@material-ui/icons/ArrowForwardOutlined";
import ArrowLeft from "@material-ui/icons/ArrowBackOutlined";
import _ from "lodash";

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
  const [open, setOpen] = useState(false);
  const handleModal = () => {
    setOpen((prevState) => !prevState);
  };
  return (
    <Paper className={Style.question_container} variant="outlined">
      <Grid container direction="row" style={{ flex: "1" }}>
        <Grid item xs={12}>
          <Modal
            open={open}
            // onClose={handleModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div
                style={{
                  width: "90%",
                  marginTop: "1rem",
                  position: "absolute",
                  top: `${50}%`,
                  left: `${50}%`,
                  transform: `translate(-${50}%, -${50}%)`,
                  margin: "30px auto",
                  backgroundColor: "white",
                  maxWidth: `${window.innerWidth > 1000 ? "60%" : "100%"}`,
                  padding: "20px 20px",
                  boxShadow:
                    "0px 20px 30px rgba(0, 0, 0, 0.1), 0px 8px 8px rgba(0, 0, 0, 0.15),0px 4px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    overflow: "hidden",
                    backgroundColor: "white",
                  }}
                >
                  <GridList
                    style={{
                      width: "100%",
                      height: 600,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {question.images.length === 0 || question.images === [] ? (
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <h5>No Images Attached</h5>
                      </div>
                    ) : (
                      question.images.map((ele, key, index) => {
                        return (
                          <GridListTile
                            key={key}
                            cols={window.innerWidth > 1000 ? 1 : 2}
                            style={{
                              padding: 1,
                              margin: "10px",
                              height: "450px",
                              width: "70%",
                            }}
                          >
                            <img
                              src={ele}
                              alt={"Question-" + key.toString()}
                              height="250px"
                              width="200px"
                            />
                          </GridListTile>
                        );
                      })
                    )}
                  </GridList>
                </div>
                <br />
                <Grid
                  style={{ flex: "1" }}
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Button color="primary" onClick={handleModal}>
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          </Modal>
        </Grid>
      </Grid>
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
          marginTop: "1rem",
        }}
      >
        {/* {question.images.map((element, key) => {
          return {
            <Grid item key={key}>
            </Grid>
          }
        })} */}
        <Button variant="contained" onClick={handleModal} color="primary">
          View Image
        </Button>
      </div>
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
