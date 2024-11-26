import React, { useEffect, useState } from "react";
import { Button, Group } from "@mantine/core";

const DisputeButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [evaluations, setEvaluations] = useState([]);
    const [evaluationId, setEvaluationId] = useState([]);
    const [disputed, setDisputed] = useState(false);
    const [reevaluated, setReevaluated] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [resolved, setResolved] = useState(false);

    const user = localStorage.getItem("id");

    useEffect(() => {
        const firstEvaluation = evaluations.length > 0 ? evaluations[0] : null;
        if (firstEvaluation) {
            setDisputed(firstEvaluation.disputed);
            setReevaluated(firstEvaluation.reevaluated);
            setDismissed(firstEvaluation.dismissed);
            setResolved(firstEvaluation.resolved);
            console.log("firstEvaluation: ", firstEvaluation);
            console.log("disputed: ", disputed);
            console.log("evaluations: ", evaluations);
            console.log("reevaluated: ", reevaluated);
            console.log("evaluationId: ", evaluationId);
            console.log("dismissed: ", dismissed);
            console.log("resolved: ", resolved);
        }
    }, [evaluations, evaluationId, disputed, reevaluated, setDisputed, setReevaluated])

    useEffect(() => {
        const fetchStudentRecords = async () => {
            try {
                const response = await fetch('http://localhost:3080/get-student-records', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user }),
                });

                const data = await response.json();

                if (data.message === 'success') {
                    console.log('Evaluations:', data.results); // Debug log for evaluations

                    // Update states based on results
                    setEvaluations(data.results);

                    // Separate evaluationId, disputed, and reevaluated into individual arrays
                    setEvaluationId(data.results.map(evaluation => evaluation.evaluationId));
                } else {
                    console.error('Failed to fetch evaluations:', data.message);
                }
            } catch (error) {
                console.error('Error fetching evaluations:', error);
            }
        };

        fetchStudentRecords();
    }, [user, disputed, reevaluated]);

    const handleDispute = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3080/update-dispute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    evaluationId,
                    disputed: true,
                    reevaluated: false,
                }),
            });

            const result = await response.json();
            if (result.message === "success") {
                setDisputed(true);
                setReevaluated(false);
            } else {
                alert("Failed to update dispute status.");
            }
        } catch (error) {
            console.error("Error updating dispute status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEscalate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:3080/update-dispute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    evaluationId,
                    disputed: true,
                    reevaluated: true,
                }),
            });

            const result = await response.json();
            if (result.message === "success") {
                setDisputed(true);
                setReevaluated(true);
            } else {
                alert("Failed to escalate dispute.");
            }
        } catch (error) {
            console.error("Error escalating dispute:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Group justify="center">
            {!disputed && !reevaluated ? (
                <Button onClick={handleDispute} loading={isLoading} variant="outline" color="red">
                    Dispute
                </Button>
            ) : disputed && !reevaluated ? (
                <Button onClick={handleEscalate} loading={isLoading} variant="outline" color="orange">
                    Escalate
                </Button>
            ) : !dismissed && !resolved ? (
                <Button disabled variant="filled" color="green" className="wobble-important">
                    Waiting...
                </Button>
            ) : dismissed && !resolved ? (
                <Button disabled variant="filled" color="green" className="wobble-important">
                    Refused!
                </Button>
            ): !dismissed && resolved ? (
                <Button disabled variant="filled" color="green" className="wobble-important">
                    Resolved!
                </Button>
            ) : null }
        </Group>
    );
};

export default DisputeButton;