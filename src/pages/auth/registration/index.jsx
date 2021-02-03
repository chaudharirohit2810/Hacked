import React from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        style={{
          textDecoration: "none",
        }}
        to="/"
      >
        LeoCode
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      collegeName: "",
      collegeID: "",
      contactNumber: "",
      password: "",
    };
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    event.persist();
    console.log(this.state);
  };
  render() {
    const {
      firstName,
      lastName,
      collegeID,
      collegeName,
      contactNumber,
      password,
    } = this.state;
    return (
      <Container component="main" maxWidth="xs">
        <div
          style={{
            marginTop: "4.8rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            style={{
              margin: "1rem",
              backgroundColor: "#ffad33",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1.8rem",
            }}
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={firstName}
                  onChange={this.handleChange}
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={lastName}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={collegeName}
                  onChange={this.handleChange}
                  autoComplete="cname"
                  name="collegeName"
                  variant="outlined"
                  required
                  fullWidth
                  id="collegeName"
                  label="College Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={collegeID}
                  onChange={this.handleChange}
                  autoComplete="cID"
                  name="collegeID"
                  variant="outlined"
                  required
                  fullWidth
                  id="collegeID"
                  label="College ID"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={contactNumber}
                  onChange={this.handleChange}
                  id="contactNumber"
                  name="contactNumber"
                  label="Contact Number"
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={password}
                  onChange={this.handleChange}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              onClick={this.handleSubmit}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{
                margin: "1.5rem 0 1rem",
              }}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                  }}
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default Register;
