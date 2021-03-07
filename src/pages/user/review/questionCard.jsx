import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";

export default function QuestionCard({ item, index }) {
    return (
        <Card
            variant="outlined"
            elevation={4}
            title={item.question}
            style={{ margin: "1rem auto" }}
        >
            <CardContent>
                <Typography color="textPrimary" variant="h6" gutterBottom>
                    {`${index}. ${item.question}` || "N/A"}
                </Typography>
                {item.options.map((item2, index) => (
                    <Typography
                        variant="body2"
                        color="textPrimary"
                        key={index}
                        style={{
                            fontWeight:
                                item.options[item.answer] === item2
                                    ? "bold"
                                    : "300",
                        }}
                    >
                        {index + 1}. {item2}
                    </Typography>
                ))}
                <Typography
                    variant="body2"
                    style={{
                        marginTop: "0.75rem",
                        color: item.correct ? "green" : "red",
                    }}
                >
                    {item.correct ? (
                        "Your answer is correct"
                    ) : (
                        <span>
                            Your answer is incorrect
                            <br></br>
                            {` The correct answer is
                            ${item.options[item.answer]}`}
                        </span>
                    )}
                </Typography>
            </CardContent>
        </Card>
    );
}
