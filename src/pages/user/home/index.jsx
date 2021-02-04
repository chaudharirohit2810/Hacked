import React, { useEffect, useState } from "react";
import Style from "./home.module.scss";
import ExamCard from "./examCard";
import { Divider, Snackbar } from "@material-ui/core";
import axios from "axios";
import { backendURL, secureStorage } from "../../../config";
import Loading from "../../../components/loading";
import PasswordModal from "./passwordModal";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

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
            .get(`${backendURL}/exam/`)
            .then((res) => {
                secureStorage.setItem("exams", JSON.stringify(res.data));
                setExams(res.data);
            })
            .catch((err) => {
                console.log(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);
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
            <h1>Available exam papers</h1>
            <Divider />
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
