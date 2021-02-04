import {
    CircularProgress,
    Dialog,
    DialogContent,
    Typography,
} from "@material-ui/core";
import React from "react";

const LoadingDialog = ({ open }) => {
    return (
        <Dialog
            open={open}
            style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                padding: "2rem",
            }}
        >
            <DialogContent
                style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "2rem",
                }}
            >
                <CircularProgress size="3.5rem" />
                <Typography variant="h4" style={{ marginTop: "2rem" }}>
                    Submitting Exam Paper...
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

export default LoadingDialog;
