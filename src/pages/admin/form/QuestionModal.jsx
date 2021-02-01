import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

export default function QuestionModal(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    open,
    handleModal,
    handleModalSubmit,
    handleChange,
    marks,
    question,
    option1,
    option2,
    option3,
    option4,
    answer,
  } = props;

  const [selectOpen, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        // onClose={handleModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Add new Question"}
        </DialogTitle>
        <DialogContent>
          <form noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  value={question}
                  id="question"
                  label="Question"
                  name="question"
                  autoComplete="question"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="option1"
                  name="option1"
                  value={option1}
                  variant="outlined"
                  required
                  fullWidth
                  id="option1"
                  label="First Option"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="option2"
                  value={option2}
                  label="Second Option"
                  name="option2"
                  autoComplete="option2"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="option3"
                  value={option3}
                  label="Third Option"
                  name="option3"
                  autoComplete="option3"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="option4"
                  label="Fourth Option"
                  name="option4"
                  value={option4}
                  onChange={handleChange}
                  autoComplete="option4"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="marks"
                  label="Marks"
                  type="number"
                  name="marks"
                  value={marks}
                  onChange={handleChange}
                  fullWidth
                  //   InputLabelProps={{
                  //     shrink: true,
                  //   }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl required fullWidth>
                  <InputLabel id="answer">Answer</InputLabel>
                  <Select
                    labelId="answer"
                    id="answer"
                    name="answer"
                    open={selectOpen}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    value={answer}
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>First</MenuItem>
                    <MenuItem value={2}>Second</MenuItem>
                    <MenuItem value={3}>Third</MenuItem>
                    <MenuItem value={4}>Fourth</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleModalSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
