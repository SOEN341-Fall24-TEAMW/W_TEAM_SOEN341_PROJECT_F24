import React, { useState, useEffect } from "react";
import { Button, Group, Notification, Tooltip, Text, Portal } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

const ResolveButton = ({ selectedStudent, setSelectedStudent }) => {
    const [showActions, setShowActions] = useState(false);
    const [notification, setNotification] = useState(null);

    const [evaluations, setEvaluations] = useState([]);
    const [evaluationId, setEvaluationId] = useState([]);
    const [disputed, setDisputed] = useState(false);
    const [reevaluated, setReevaluated] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [resolved, setResolved] = useState(false);


    const notifySuccess = () => {
        setNotification({
            type: "success",
            message: "Operation completed successfully!",
        });
    };

    const notifyFailure = () => {
        setNotification({
            type: "error",
            message: "Failed to dismiss dispute.",
        });
    };

    useEffect(() => {
        const firstEvaluation = evaluations.length > 0 ? evaluations[0] : null;
        if (firstEvaluation) {
            setDisputed(firstEvaluation.disputed);
            setReevaluated(firstEvaluation.reevaluated);
            setDismissed(firstEvaluation.dismissed);
            setResolved(firstEvaluation.resolved);
        }
    }, [selectedStudent, evaluations])

    useEffect(() => {
        console.log("Notification updated: ", notification);
    }, [notification]);

    useEffect(() => {
        const fetchStudentRecords = async () => {
            try {
                const response = await fetch('http://localhost:3080/get-student-records', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: selectedStudent.id }),
                });

                const data = await response.json();

                if (data.message === 'success') {
                    console.log('Evaluations:', data.results); // Debug log for evaluations

                    // Update states based on results
                    setEvaluations(data.results);

                    // Separate evaluationId,  dismissed, and  resolved into individual arrays
                    setEvaluationId(data.results.map(evaluation => evaluation.evaluationId));
                    setDisputed(data.results.some(evaluation => evaluation.disputed));
                    setReevaluated(data.results.some(evaluation => evaluation.reevaluated));
                    setDismissed(data.results.some(evaluation => evaluation.dismissed));
                    setResolved(data.results.some(evaluation => evaluation.resolved));
                } else {
                    console.error('Failed to fetch evaluations:', data.message);
                }
            } catch (error) {
                console.error('Error fetching evaluations:', error);
            }
        };

        fetchStudentRecords();
    }, [selectedStudent]);


    const handleDismiss = async () => {
        try {
            const response = await fetch("http://localhost:3080/dispute-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    evaluationId,
                    dismissed: true,
                    resolved,
                }),
            });

            const result = await response.json();
            if (result.message === "success") {
                notifySuccess();
                setTimeout(() => {
                    setDismissed(true);
                }, 3000); 
            } else {
                notifyFailure();
            }
        } catch (error) {
            console.error("Error dismissing dispute:", error);
            setNotification({
                type: "error",
                message: "An error occurred while dismissing the dispute.",
            });
        }
    };

    const handleContactTA = async () => {
        try {
            const response = await fetch("http://localhost:3080/dispute-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    evaluationId,
                    dismissed,
                    resolved: true,
                }),
            });

            const result = await response.json();
            if (result.message === "success") {
                notifySuccess();
                setTimeout(() => {
                    setResolved(true); // Update the dismissed state after the notification is rendered
                }, 3000); 
            } else {
                notifyFailure();
            }
        } catch (error) {
            console.error("Error contacting TA:", error);
            setNotification({
                type: "error",
                message: "An error occurred while contacting the TA.",
            });
        }
    };


    useEffect(() => {
        if (notification) {
            // Automatically clear the notification after 3 seconds
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);

            return () => clearTimeout(timer); // Cleanup timeout on component unmount
        }
    }, [notification]);

    useEffect(() => {
        console.log("Notification updated:", notification);
        console.log("Show Actions:", showActions);
    }, [notification, showActions]);

    if ((!disputed || !reevaluated) && !dismissed) {
        return <Tooltip label="No conflicts!" withArrow><Text size="xl" role="img" aria-label="white-flag" className="wobble-important">🏳️</Text></Tooltip>
    }

    if (dismissed) {
        return <Tooltip label="Dispute dismissed!" withArrow><Button disabled variant="filled" color="green" className="wobble-important">Dismissed</Button></Tooltip>
    }

    if (resolved) {
        return <Tooltip label="Dispute resolved!" withArrow><Button disabled variant="filled" color="green" className="wobble-important">Resolved</Button></Tooltip>
    }

    return (
        <div>
            <Group spacing="xs">
                <Button
                    color="green"
                    onClick={(e) => {
                        handleDismiss();
                        e.stopPropagation();
                    }}
                >
                    Dismiss
                </Button>
                <Button
                    color="blue"
                    onClick={(e) => {
                        handleContactTA();
                        e.stopPropagation();
                    }}
                >
                    Contact TA
                </Button>
            </Group>

            <Portal target="#notification-container">
                {notification ? (
                    <Notification
                        color={notification.type === "success" ? "green" : "red"}
                        icon={
                            notification.type === "success" ? (
                                <IconCheck size={18} />
                            ) : (
                                <IconAlertCircle size={18} />
                            )
                        }
                        title={notification.type === "success" ? "Success" : "Error"}
                        onClose={() => setNotification(null)}
                        style={{
                            width: "300px",
                            zIndex: 1000,
                        }}
                    >
                        {notification.message}
                    </Notification>
                ) : null}
            </Portal>
        </div>
    );

};

export default ResolveButton;