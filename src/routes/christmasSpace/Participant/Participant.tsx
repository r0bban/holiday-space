import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {GameResponse} from "../../../api/types/games";

import styles from "./Participant.module.css"
import {Accordion, AccordionSummary, AccordionDetails, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Participant() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [game, setGame] = useState<GameResponse>();
    let { participantId } = useParams();
    let { gameId } = useParams();

    const [showRecipient, setShowRecipient] = useState(false);


    useEffect(() => {
        fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}/${participantId}`)
            .then(
                (response) => {
                    setLoading(false)
                    if (!response.ok) {
                        setError(response.statusText)
                    }

                    response.json().then(data => setGame(data as GameResponse))
                },
                (error) => {
                    setLoading(false)
                    console.log(error.message)
                    setError(error.message)
                }
            )
    }, [])

    let startDate: Date | undefined
    if (game && game.autoOpen) {
        startDate = new Date(Date.parse(game.autoOpen))
    }

    let descArray: string[] | undefined
    if (game && game.desc) {
        descArray = game.desc.split("\n")
    }

    console.log(game)

    if (game) {
        return (
            <div className={styles.main}>
                <h1 className={styles.header}>
                    {game.title}
                </h1>
                <div className={styles.wrapper}>
                    <div className={styles.dataContainer}>
                        {game.me && (
                            <p className={styles.dataText}>Givare:
                                <span className={styles.dataText}> {game.me.name}</span>
                            </p>
                        )}
                        <p className={styles.dataText}>Pris:
                            <span className={styles.dataText}> 250 kr</span>
                        </p>
                    </div>
                    {descArray &&
                        (<Accordion
                            className={styles.desc}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Beskrivning</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {descArray.map(d => (
                                    <Typography className={styles.descItem} align={"left"} >
                                        {d}
                                    </Typography>
                                    ))}
                            </AccordionDetails>
                        </Accordion>)
                    }
                    {game.participants.length && (
                        <Accordion
                            className={styles.desc}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Andra deltagare</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {game.participants.map(p => (
                                    <Typography align={"left"}>
                                        {p.name}
                                    </Typography>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {startDate && (
                    <div className={styles.releaseContainer}>
                        <p className={styles.releaseIngress}>{showRecipient ? "Du ska  ge till" : (game.isOpen ? "Klicka för att se mottgare" : "Vem du ska ge till lottas")}</p>


                        {!game.isOpen && (
                            <>
                            <p className={styles.releaseDate}>
                                {`${startDate.toLocaleString("sv-SE",
                                    {
                                        weekday: "long",
                                    })} ${startDate.getDate()}/${startDate.getMonth()+1}`}
                            </p>
                            <p className={styles.releaseDate}>
                        {`kl ${startDate.getHours()}:${startDate.getMinutes() < 10 ? "0" : ""}${startDate.getMinutes()}`}
                            </p>
                            </>
                        )}
                        {game.isOpen && game.me && showRecipient && (
                                <p className={styles.releaseDate}>
                                    {game.me.givingTo}
                                </p>
                        )}
                    </div>
                    )}

                    <Button
                        variant="contained"
                        onClick={() => setShowRecipient(!showRecipient)}
                        disabled={!game.isOpen}
                    >
                        {showRecipient ? "Dölj mottagare" : "Visa mottagare"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.main}>

        </div>
    )

}

export default Participant;