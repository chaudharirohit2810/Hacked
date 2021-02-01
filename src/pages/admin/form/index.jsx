import React, { Component } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  withStyles,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import QuestionModal from "./QuestionModal";

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

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      loading: true,
      modalOpen: false,
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "1",
      marks: 0,
      Questions: [
        {
          question: "This is the first question.",
          marks: "5",
          options: [
            "First Option",
            "Second Option",
            "Third Option",
            "Fourth Option",
          ],
          answer: "0",
        },
      ],
    };
  }
  componentDidMount() {
    this.setState({
      loading: !this.state.loading,
    });
  }
  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
    });
  };
  handleStartTime = (time) => {
    this.setState({
      startTime: time,
    });
  };
  handleEndTime = (time) => {
    this.setState({
      endTime: time,
    });
  };
  handleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };
  addData = (data) => {
    let Questions = [...this.state.Questions];
    let options = [];
    options.push(data.option1, data.option2, data.option3, data.option4);
    let newQuestion = {
      question: data.question,
      options,
      marks: data.marks || 0,
      answer: data.answer,
    };
    Questions.push(newQuestion);
    this.setState({
      Questions,
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "1",
      marks: 0,
    });
  };
  handleModalSubmit = () => {
    const {
      question,
      option1,
      option2,
      option3,
      option4,
      answer,
      marks,
    } = this.state;
    console.log(question, option1, option2, option3, option4, answer, marks);
    const data = {
      question,
      option1,
      option2,
      option3,
      option4,
      marks,
      answer: Number(answer) - 1,
    };

    this.addData(data);

    this.handleModal();
  };
  handlePaperSubmit = () => {
    const { selectedDate, startTime, endTime, Questions } = this.state;
    const Paper = {
      selectedDate,
      startTime,
      endTime,
      Questions,
    };
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  render() {
    const {
      selectedDate,
      startTime,
      endTime,
      Questions,
      modalOpen,
      loading,
    } = this.state;
    return (
      <div
        style={{
          margin: "0px auto",
          maxWidth: "68rem",
        }}
      >
        <QuestionModal
          marks={this.state.marks}
          question={this.state.question}
          option1={this.state.option1}
          option2={this.state.option2}
          option3={this.state.option3}
          option4={this.state.option4}
          answer={this.state.answer}
          open={modalOpen}
          handleModal={this.handleModal}
          handleModalSubmit={this.handleModalSubmit}
          handleChange={this.handleChange}
        />
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
            <Button
              onClick={this.handlePaperSubmit}
              style={{
                backgroundColor: "#1ab2ff",
                color: "white",
              }}
              variant="contained"
            >
              Submit Paper
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="h3">Set Paper</Typography>
          </Grid>
          <Grid item>
            <Button
              onClick={this.handleModal}
              color="primary"
              variant="contained"
            >
              Add Question
            </Button>
          </Grid>
        </Grid>

        <Divider
          style={{
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Select Exam Date"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={this.handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="start-time-picker"
              label="Set Start Time"
              value={startTime}
              onChange={this.handleStartTime}
              KeyboardButtonProps={{
                "aria-label": "change start time",
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="end-time-picker"
              label="Set End Time"
              value={endTime}
              onChange={this.handleEndTime}
              KeyboardButtonProps={{
                "aria-label": "change end time",
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <div
          style={{
            marginTop: "1.5rem",
          }}
        >
          {loading
            ? [...Array(4)].map((d, i) => {
                return (
                  <Typography key={i} component="div" variant="h2">
                    <Skeleton />
                  </Typography>
                );
              })
            : Questions.map((q, i) => {
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
                      <Typography>{q.question}</Typography>
                    </AccordionSummary>
                    {q.options.map((op, index) => {
                      return (
                        <AccordionDetails key={index}>
                          <Typography>{`${index + 1}. ${op}`}</Typography>
                        </AccordionDetails>
                      );
                    })}
                    <AccordionDetails>
                      <Typography>{`Answer :- ${
                        q.options[q.answer]
                      }`}</Typography>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
        </div>
      </div>
    );
  }
}

export default Form;
