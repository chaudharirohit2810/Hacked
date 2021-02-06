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
    TextField,
    Snackbar,
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import SubmitDialog from "./submitDialog";
import DateFnsUtils from "@date-io/date-fns";
import MuiAlert from "@material-ui/lab/Alert";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker,
} from "@material-ui/pickers";
import QuestionModal from "./QuestionModal";
import Style from "./form.module.scss";
import { backendURL } from "../../../config";
import axios from "axios";
import LoadingDialog from "./loadingDialog";
import SuccessDialog from "./successDialog";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
            confirmOpen: false,
            successOpen: false,
            SMSmsg: "",
            SMSOpen: false,
            msg: "Exam Saved Successfully",
            key: "",
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            answer: "1",
            marks: 0,
            title: "",
            subTitle: "",
            validationMsg: "",
            Questions: [],
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
    handleSMSModal = () => {
        this.setState({
            SMSOpen: !this.state.SMSOpen,
        });
    };
    handleSMS = (key) => {
        axios
            .post(`${backendURL}/exam/sendSMS`, { KEY: key })
            .then((response) => {
                this.setState({
                    SMSmsg: "SMS Sent successfully !",
                });
                this.handleSMSModal();
                console.log(response.data);
            })
            .catch((error) => console.log(error.message));
    };
    handlePaperSubmit = () => {
        const {
            selectedDate,
            startTime,
            endTime,
            Questions,
            title,
            subTitle,
        } = this.state;
        if (title === "") {
            this.setState({ validationMsg: "Please enter title of quiz!" });
            return;
        }
        if (subTitle === "") {
            this.setState({ validationMsg: "Please enter subtitle of quiz!" });
            return;
        }
        if (startTime >= endTime) {
            this.setState({
                validationMsg: "Start time and end time cannot be same",
            });
            return;
        }
        const Paper = {
            selectedDate: new Date(selectedDate).valueOf(),
            startTime: new Date(startTime).valueOf(),
            endTime: new Date(endTime).valueOf(),
            Questions,
            title,
            subTitle,
        };
        this.setState({ loading: true });
        axios
            .post(`${backendURL}/exam`, Paper)
            .then((res) => {
                // console.log(res.data);
                this.setState({
                    loading: false,
                    successOpen: true,
                    msg: "Exam Saved Successfully",
                    key: res.data.key,
                });
                /*
          UNCOMMENT THIS 
          TO ACTIVATE SMS SERVICE
        */
                this.handleSMS(res.data.key);
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    successOpen: true,
                    msg: "Something Went Wrong! Please Try again",
                });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    handleConfirmModalOpen = () => {
        this.setState({ confirmOpen: true });
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
                <Snackbar
                    open={this.state.SMSOpen}
                    autoHideDuration={4000}
                    onClose={this.handleSMSModal}
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                >
                    <Alert severity="success">{this.state.SMSmsg}</Alert>
                </Snackbar>
                <Snackbar
                    open={this.state.validationMsg !== ""}
                    autoHideDuration={3000}
                    onClose={() => this.setState({ validationMsg: "" })}
                    anchorOrigin={{ horizontal: "center", vertical: "top" }}
                >
                    <Alert severity="warning">{this.state.validationMsg}</Alert>
                </Snackbar>
                <SuccessDialog
                    open={this.state.successOpen}
                    handleConfirm={() => this.props.history.replace("/admin")}
                    setOpen={(v) => this.setState({ successOpen: v })}
                    msg={this.state.msg}
                    password={this.state.key}
                />
                <LoadingDialog open={this.state.loading} />
                <SubmitDialog
                    open={this.state.confirmOpen}
                    setOpen={(v) => this.setState({ confirmOpen: v })}
                    handlePaperSubmit={this.handlePaperSubmit}
                />
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
                        <Typography variant="h3">Set Paper</Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            // onClick={this.handlePaperSubmit}
                            onClick={this.handleConfirmModalOpen}
                            style={{
                                backgroundColor: "#1ab2ff",
                                color: "white",
                                marginRight: "1.4rem",
                            }}
                            variant="contained"
                        >
                            Submit Paper
                        </Button>
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
                <div className={Style.title_container}>
                    <TextField
                        label="Title of quiz"
                        style={{ flex: 1, marginRight: "1rem" }}
                        onChange={(e) =>
                            this.setState({ title: e.target.value })
                        }
                    />
                    <TextField
                        label="Subtitle of quiz"
                        style={{ flex: 1 }}
                        onChange={(e) =>
                            this.setState({ subTitle: e.target.value })
                        }
                    />
                </div>
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
                                  <Typography
                                      key={i}
                                      component="div"
                                      variant="h2"
                                  >
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
                                                  <Typography>{`${
                                                      index + 1
                                                  }. ${op}`}</Typography>
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
