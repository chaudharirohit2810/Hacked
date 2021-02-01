import "./App.css";
import { UserHome, UserExam } from "./pages";
import { BrowserRouter, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Route exact path="/" component={UserHome} />
                <Route exact path="/exam" component={UserExam} />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
