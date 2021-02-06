import React, { Component } from "react";
import {
    Typography,
    Accordion as MuiAccordion,
    AccordionSummary as MuiAccordionSummary,
    AccordionDetails as MuiAccordionDetails,
    withStyles,
    Grid,
    Divider,
    Button,
} from "@material-ui/core";
import {
    ExpandMore as ExpandMoreIcon,
    ArrowBack,
    CancelSharp,
    CheckCircleSharp,
} from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import axios from "axios";
import { backendURL, secureStorage } from "../../../config";

const Accordion = withStyles({
    root: {
        border: "1px solid rgba(0, 0, 0, .125)",
        boxShadow: "none",
        "&:not(:last-child)": {
            borderBottom: 0,
        },
        "&:before": {
            display: "none",
        },
        "&$expanded": {
            margin: "auto",
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: "rgba(0, 0, 0, .03)",
        borderBottom: "1px solid rgba(0, 0, 0, .125)",
        marginBottom: -1,
        minHeight: 56,
        "&$expanded": {
            minHeight: 56,
        },
    },
    content: {
        "&$expanded": {
            margin: "12px 0",
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            examData: [],
            loading: true,
            exam: {},
            marksObtained: 0,
        };
    }
    async componentDidMount() {
        try {
            const reviewExam = secureStorage.getItem("reviewExam");
            const examID = reviewExam._id;
            const response = await axios.get(
                `${backendURL}/answer/getAnswers/${examID}`
            );
            const examResponse = await axios.get(
                `${backendURL}/exam/getExam/${examID}`
            );
            let newAnswers = [];
            response.data.forEach((data, index) => {
                const d = {
                    _id: data._id,
                    answers: JSON.parse(data.answers),
                    collegeID: data.collegeID,
                    examID: data.examID,
                    faceWarnings: data.faceWarnings,
                    tabSwitched: data.tabSwitched,
                };
                newAnswers.push(d);
            });

            let marksObtained = 0;
            newAnswers.forEach((data, i) => {
                data.answers.forEach((ans, index) => {
                    const data = examResponse.data.exam.Questions[index];
                    if (ans === data.options[data.answer]) {
                        marksObtained += Number(data.marks);
                    }
                });
            });
            this.setState({
                examData: newAnswers,
                exam: examResponse.data,
                marksObtained,
                loading: false,
            });
        } catch (error) {
            console.log(error.message);
            this.setState({
                loading: false,
            });
        }
    }
    // componentWillUnmount() {
    //   if (secureStorage.getItem("reviewExam") !== null) {
    //     secureStorage.removeItem("reviewExam");
    //   }
    // }
    render() {
        const { examData, loading, exam, marksObtained } = this.state;
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
                    {loading
                        ? [...Array(4)].map((d, i) => {
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
                        : examData.map((q, i) => {
                              return (
                                  <Accordion
                                      style={{
                                          marginBottom: "0.9rem",
                                      }}
                                      key={i}
                                  >
                                      <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          aria-controls="panel1a-content"
                                          id={`panel1a-header-${i}`}
                                      >
                                          <Typography>{q.collegeID}</Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                          <Typography
                                              style={{
                                                  marginTop: "0.5rem",
                                              }}
                                          >{`Total Exam Marks :- ${exam.totalMarks}`}</Typography>
                                      </AccordionDetails>
                                      <AccordionDetails>
                                          <Typography
                                              style={{
                                                  marginTop: "0.5rem",
                                              }}
                                          >{`Marks Obtained :- ${marksObtained}`}</Typography>
                                      </AccordionDetails>
                                      <AccordionDetails>
                                          <Typography
                                              style={{
                                                  marginTop: "0.5rem",
                                              }}
                                          >{`Tab Switched :- ${q.tabSwitched} time(s)`}</Typography>
                                      </AccordionDetails>
                                      <AccordionDetails>
                                          <Typography
                                              style={{
                                                  marginTop: "0.5rem",
                                              }}
                                          >{`Face warnings :- ${
                                              q.faceWarnings
                                                  ? q.faceWarnings
                                                  : 0
                                          } time(s)`}</Typography>
                                      </AccordionDetails>
                                      <Divider
                                          style={{
                                              marginTop: "0.5rem",
                                              marginBottom: "1rem",
                                          }}
                                      />
                                      {q.answers.map((op, index) => {
                                          const data =
                                              exam.exam.Questions[index];
                                          return (
                                              <AccordionDetails key={index}>
                                                  <Typography>{`${
                                                      index + 1
                                                  }. ${op}`}</Typography>{" "}
                                                  {op ===
                                                  data.options[data.answer] ? (
                                                      <CheckCircleSharp
                                                          style={{
                                                              marginLeft:
                                                                  "1rem",
                                                              color: "green",
                                                          }}
                                                      />
                                                  ) : (
                                                      <CancelSharp
                                                          style={{
                                                              marginLeft:
                                                                  "1rem",
                                                              color: "red",
                                                          }}
                                                      />
                                                  )}
                                              </AccordionDetails>
                                          );
                                      })}
                                  </Accordion>
                              );
                          })}
                </div>
            </div>
        );
    }
}

export default Review;
