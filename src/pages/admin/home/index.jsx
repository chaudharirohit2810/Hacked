import React, { useEffect, useState } from "react";
import Style from "../../user/home/home.module.scss";
import ExamCard from "../../user/home/examCard";
import { Button, Divider } from "@material-ui/core";
import axios from "axios";
import { backendURL, secureStorage } from "../../../config";
import Loading from "../../../components/loading";
import { useHistory } from "react-router-dom";

const UserHome = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const his = useHistory();

    useEffect(() => {
        axios
            .get(`${backendURL}/exam/`, {
                headers: {
                    isadmin: true,
                },
            })
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
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    paddingBottom: "1rem",
                }}
            >
                <h1 style={{ margin: "0" }}>Available exam papers</h1>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => his.push("/adminForm")}
                >
                    Add new exam
                </Button>
            </div>
            <Divider />
            {exams.map((item, index) => (
                <ExamCard
                    key={index}
                    item={item}
                    index={index}
                    isadmin={true}
                />
            ))}
        </div>
    );
};

export default UserHome;
