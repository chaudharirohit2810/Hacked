import { CircularProgress } from "@material-ui/core";
import React from "react";

const Loading = () => {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress size="3.5rem" />
        </div>
    );
};

export default Loading;
