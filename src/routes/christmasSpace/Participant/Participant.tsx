import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Typography
} from '@mui/material';

import { GameResponse } from '../../../api/types/games';
import AlertModal from '../../../components/AlertModal/AlertModal';
import gift from '../assets/gift.png';
import ham from '../assets/ham.png';
import styles from './Participant.module.css';

function Participant() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [game, setGame] = useState<GameResponse>();
  const { participantId } = useParams();
  const { gameId } = useParams();

  const [showRecipient, setShowRecipient] = useState(false);

  useEffect(() => {
    fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}/${participantId}`).then(
      (response) => {
        setLoading(false);
        if (!response.ok) {
          setError(response.statusText);
        }

        response.json().then((data) => setGame(data as GameResponse));
      },
      (error) => {
        setLoading(false);
        console.log(error.message);
        setError(error.message);
      }
    );
  }, []);

  let startDate: Date | undefined;
  if (game && game.autoOpen) {
    startDate = new Date(Date.parse(game.autoOpen));
  }

  let descArray: string[] | undefined;
  if (game && game.desc) {
    descArray = game.desc.split('\n');
  }

  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickFood = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  if (game) {
    return (
      <div className={styles.main}>
        <h1 className={styles.header}>{game.title}</h1>
        <div className={styles.wrapper}>
          <nav>
            <ButtonGroup
              className={styles.navBtnGrp}
              fullWidth
              disableElevation
              variant="outlined"
              aria-label="Disabled elevation buttons"
            >
              <Button className={styles.navBtn} variant="contained">
                <img src={gift} height="16px" />
                Klappsbyte
              </Button>
              <Button className={styles.navBtn} onClick={handleClickFood}>
                <img src={ham} height="18px" />
                Knytkalas
              </Button>
            </ButtonGroup>
          </nav>
          <div className={styles.dataContainer}>
            {game.me && (
              <p className={styles.dataText}>
                Givare:
                <span className={styles.dataText}> {game.me.name}</span>
              </p>
            )}
            <p className={styles.dataText}>
              Pris:
              <span className={styles.dataText}> 250 kr</span>
            </p>
          </div>
          {descArray && (
            <Accordion className={styles.desc}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Beskrivning</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {descArray.map((d, k) => (
                  <Typography key={k} className={styles.descItem} align={'left'}>
                    {d}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          )}
          {game.participants.length && (
            <Accordion className={styles.desc}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Andra deltagare</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {game.participants.map((p, k) => (
                  <Typography key={k} align={'left'}>
                    {p.name}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          )}
          {startDate && (
            <div className={styles.releaseContainer}>
              <p className={styles.releaseIngress}>
                {showRecipient
                  ? 'Du ska  ge till'
                  : game.isOpen
                  ? 'Klicka för att se mottgare'
                  : 'Vem du ska ge till lottas'}
              </p>

              {!game.isOpen && (
                <>
                  <p className={styles.releaseDate}>
                    {`${startDate.toLocaleString('sv-SE', {
                      weekday: 'long'
                    })} ${startDate.getDate()}/${startDate.getMonth() + 1}`}
                  </p>
                  <p className={styles.releaseDate}>
                    {`kl ${startDate.getHours()}:${
                      startDate.getMinutes() < 10 ? '0' : ''
                    }${startDate.getMinutes()}`}
                  </p>
                </>
              )}
              {game.isOpen && game.me && showRecipient && (
                <p className={styles.releaseDate}>{game.me.givingTo}</p>
              )}
            </div>
          )}

          <Button
            variant="contained"
            onClick={() => setShowRecipient(!showRecipient)}
            disabled={!game.isOpen}
          >
            {showRecipient ? 'Dölj mottagare' : 'Visa mottagare'}
          </Button>
        </div>
        <AlertModal
          onClose={handleCloseAlert}
          open={alertOpen}
          title={'Nyheter på väg'}
          message={
            'Här kommer vi tillsammans planera maten. Planerad lansering Lördag 19 december.'
          }
        />
      </div>
    );
  }

  return <div className={styles.main}></div>;
}

export default Participant;
