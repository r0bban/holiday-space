import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Backdrop, Button, ButtonGroup, CircularProgress, Snackbar } from '@mui/material';

import { GameResponse } from '../../../api/types/games';
import gift from '../assets/gift.png';
import ham from '../assets/ham.png';
import styles from './Participant.module.css';
import ParticipantGame from './ParticipantGame';
import ParticipantPotluck from './ParticipantPotluck';

const Participant = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [game, setGame] = useState<GameResponse>();
  const { participantId } = useParams();
  const { gameId } = useParams();

  type view = 'GAME' | 'POTLUCK';
  type viewsProps = {
    game: view;
    potluck: view;
  };
  const views: viewsProps = {
    game: 'GAME',
    potluck: 'POTLUCK'
  };

  const [view, setView] = useState<view>(views.game);

  useEffect(() => {
    fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}/${participantId}`).then(
      //fetch(`http://localhost:8080/games/${gameId}/${participantId}`).then(
      (response) => {
        setLoading(false);
        if (!response.ok) {
          if (response.statusText) {
            setError(response.statusText);
            return;
          }
          response.json().then((data) => {
            setError(data);
          });
          return;
        }
        response.json().then((data) => {
          if (!(data as GameResponse).me) {
            setError('Felaktig deltagarkod');
            return;
          }
          setGame(data as GameResponse);
        });
      },
      (error) => {
        setLoading(false);
        console.log(error.message);
        setError(error.message);
      }
    );
  }, []);

  const [potluckIntroOpen, setPotluckIntroOpen] = React.useState(false);
  const [gameIntroOpen, setGameIntroOpen] = React.useState(true);

  const handleClickFood = () => {
    setView(views.potluck);
  };
  const handleClickGame = () => {
    setView(views.game);
  };

  const handleClosePotluckIntro = () => {
    setPotluckIntroOpen(false);
  };
  const handleCloseGameIntro = () => {
    setGameIntroOpen(false);
  };

  return (
    <>
      <div className={styles.main}>
        {game && (
          <>
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
                  <Button
                    className={styles.navBtn}
                    variant={view == views.game ? 'contained' : 'outlined'}
                    onClick={handleClickGame}
                  >
                    <img src={gift} height="16px" />
                    Klappsbyte
                  </Button>
                  <Button
                    className={styles.navBtn}
                    variant={view == views.potluck ? 'contained' : 'outlined'}
                    onClick={handleClickFood}
                  >
                    <img src={ham} height="18px" />
                    Knytkalas
                  </Button>
                </ButtonGroup>
              </nav>

              {view == views.game && (
                <ParticipantGame
                  game={game}
                  setGame={setGame}
                  introOpen={gameIntroOpen}
                  handleCloseIntro={handleCloseGameIntro}
                />
              )}
              {view == views.potluck && (
                <ParticipantPotluck
                  game={game}
                  setGame={setGame}
                  introOpen={potluckIntroOpen}
                  handleCloseIntro={handleClosePotluckIntro}
                />
              )}
            </div>
          </>
        )}
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={!!error} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Participant;
