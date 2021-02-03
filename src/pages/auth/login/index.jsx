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
import axios from "axios";
import { backendURL } from "../../../config";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link
        style={{
          textDecoration: "none",
        }}
        color="inherit"
        to="/"
      >
        LeoCode
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeID: "",
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
    const { collegeID, password } = this.state;
    const data = {
      collegeID,
      password,
    };
    axios
      .post(`${backendURL}/user/login`, data)
      .then((response) => {
        // console.log(response.data);
        if (!response.data.error) {
          this.props.history.push("/");
        } else {
          alert(response.data.result);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          alert(error.response.data.result);
        }
        console.log(error.message);
      });
  };
  render() {
    const { collegeID, password } = this.state;
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
            Sign in
          </Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1.8rem",
            }}
            noValidate
          >
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
            <TextField
              value={password}
              onChange={this.handleChange}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              onClick={this.handleSubmit}
              variant="contained"
              color="primary"
              style={{
                margin: "1.5rem 0 1rem",
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  style={{
                    textDecoration: "none",
                  }}
                  to="/register"
                  variant="body2"
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default Login;
