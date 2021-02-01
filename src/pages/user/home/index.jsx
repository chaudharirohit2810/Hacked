import React from "react";
import Style from "./home.module.scss";
import ExamCard from "./examCard";
import { Divider } from "@material-ui/core";

const UserHome = () => {
    return (
        <div className={Style.user_home_container}>
            <h1>Available exam papers</h1>
            <Divider />
            <ExamCard />
        </div>
    );
};

export default UserHome;
