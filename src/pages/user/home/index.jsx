import { Button, Divider, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import Loading from "../../../components/loading";
import { backendURL, secureStorage } from "../../../config";
import ExamCard from "./examCard";
import Style from "./home.module.scss";
import PasswordModal from "./passwordModal";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UserHome = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [examid, setExamid] = useState("");
    const [error, setError] = useState("");

    const his = useHistory();

    const navigateToExam = () => {
        his.push("/exam");
    };

    useEffect(() => {
        axios
            .get(`${backendURL}/exam/`, {
                headers: {
                    collegeID: secureStorage.getItem("collegeID"),
                },
            })
            .then((res) => {
                secureStorage.setItem("exams", JSON.stringify(res.data));
                setExams(res.data);
            })
            .catch((err) => {
                console.log(err.message);
                setExams(JSON.parse(secureStorage.getItem("exams")));
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
    if (
        !secureStorage.getItem("collegeID") ||
        !secureStorage.getItem("userImage")
    ) {
        return <Redirect to="/login" />;
    }
    if (loading) {
        return <Loading />;
    }
    return (
        <div className={Style.user_home_container}>
            <Snackbar
                open={error !== ""}
                autoHideDuration={3000}
                onClose={() => setError("")}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
            <PasswordModal
                open={passwordOpen}
                setOpen={setPasswordOpen}
                examid={examid}
                setExamid={setExamid}
                error={error}
                setError={setError}
                navigateToExam={navigateToExam}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    alignItems: "center",
                    paddingBottom: "1rem",
                    marginTop: "0.5rem",
                }}
            >
                <h1>Available exam papers</h1>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        secureStorage.clear();
                        his.replace("/login");
                    }}
                >
                    LogOut
                </Button>
            </div>
            <Divider style={{ margin: 0 }} />
            {exams.map((item, index) => (
                <ExamCard
                    key={index}
                    item={item}
                    index={index}
                    setPasswordOpen={setPasswordOpen}
                    setExamid={setExamid}
                />
            ))}
        </div>
    );
};

export default UserHome;
