import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneIcon from "@material-ui/icons/DoneAllRounded";
import WarningIcon from "@material-ui/icons/WarningRounded";
import React from "react";

export default function SuccessDialog({
    open,
    handleConfirm,
    msg,
    setOpen,
    password,
}) {
    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent style={{ textAlign: "center" }}>
                    <DialogContentText>
                        {password !== "" ? (
                            <DoneIcon
                                style={{
                                    fontSize: "50px",
                                    padding: "10px",
                                    border: "2px solid",
                                    borderRadius: "40px",
                                }}
                                color="primary"
                            />
                        ) : (
                            <WarningIcon
                                style={{
                                    fontSize: "50px",
                                    padding: "10px",
                                    border: "2px solid",
                                    borderRadius: "40px",
                                }}
                                color="error"
                            />
                        )}
                        <Typography variant="h4">{msg}</Typography>
                        {password !== "" && (
                            <Typography variant="subtitle1">
                                {" "}
                                Generated password for exam is {password}
                            </Typography>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            handleConfirm();
                        }}
                        color="primary"
                        autoFocus
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
