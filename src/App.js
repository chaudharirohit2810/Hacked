import "./App.css";
import {
    UserHome,
    UserExam,
    Form,
    Register,
    Login,
    AdminHome,
    Review,
    UserReview,
} from "./pages";
import { BrowserRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Route exact path="/" component={UserHome} />
                <Route exact path="/exam" component={UserExam} />
                {/* <Route exact path="/password" component={UserPassword} /> */}
                <Route exact path="/adminForm" component={Form} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/admin" component={AdminHome} />
                <Route exact path="/review" component={Review} />
                <Route
                    exact
                    path="/userReview/:examID"
                    component={UserReview}
                />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
