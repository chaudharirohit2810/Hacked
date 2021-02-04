import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Button,
    Divider,
} from "@material-ui/core";
import React, { useState } from "react";
import { secureStorage } from "../../../config";
import crypto from "crypto-js";

const PasswordModal = ({
    open,
    setOpen,
    examid,
    setExamid,
    setError,
    error,
    navigateToExam,
}) => {
    const [password, setPassword] = useState("");
    const handleSubmit = () => {
        try {
            if (password === "") {
                setError("Please enter password");
                return;
            }
            var exam = secureStorage.getItem(examid);
            var decrypted = crypto.AES.decrypt(exam, password);
            var data = decrypted.toString(crypto.enc.Utf8);
            secureStorage.setItem(examid, data);
            secureStorage.setItem("selectedQuiz", examid);
            navigateToExam();
        } catch (error) {
            setError("Invalid Password");
        }
    };
    return (
        <Dialog
            open={open}
            onClose={() => {
                setOpen(false);
                setExamid("");
            }}
            style={{ padding: "2rem" }}
        >
            <DialogTitle>
                Enter Exam Password
                <Divider />
            </DialogTitle>
            <DialogContent>
                <Grid style={{ width: "300px" }}>
                    <TextField
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="question"
                        label="Password"
                        name="password"
                        autoComplete="password"
                        autoFocus
                    />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        setOpen(false);
                        setExamid("");
                    }}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" autoFocus>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordModal;
