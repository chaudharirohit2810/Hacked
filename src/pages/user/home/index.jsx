import React, { useEffect, useState } from "react";
import Style from "./home.module.scss";
import ExamCard from "./examCard";
import { Divider } from "@material-ui/core";
import axios from "axios";
import { backendURL, secureStorage } from "../../../config";
import Loading from "../../../components/loading";

const UserHome = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <h1>Available exam papers</h1>
            <Divider />
            {exams.map((item, index) => (
                <ExamCard key={index} item={item} index={index} />
            ))}
        </div>
    );
};

export default UserHome;
