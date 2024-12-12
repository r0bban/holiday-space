import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import styles from './ChristmasHome.module.css';
import { GameResponse, ParticipantResponse } from '../../../api/types/games';
import AlertModal from '../../../components/AlertModal/AlertModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

function ChristmasHome() {
  const defaultValuesGame: GameResponse = {
    declareForAll: false,
    declareMyGiver: false,
    id: '',
    isOpen: false,
    openForTips: false,
    participants: [{} as ParticipantResponse],
    title: ''
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [game, setGame] = useState<GameResponse>();
  const [updatedGame, setUpdatedGame] = useState<GameResponse>({ ...defaultValuesGame });
  const [gameTitle, setGameTitle] = useState<string>(
    `Julklappsspelet ${new Date().getFullYear.toString()}`
  );
  const { gameId } = useParams();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickImAdmin = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSharing = async (participant: ParticipantResponse) => {
    if (navigator.share) {
      try {
        await navigator
          .share({
            title: 'Julklappsspelet 2024',
            url: `https://r0bban.github.io/holiday-space/christmas/game/${gameId}/${participant.id}`,
            text: `Hej ${participant.name}, hjärtligt välkommen till julklappsspelet: ${gameTitle}`
          })
          .then(() => console.log('Hooray! Your content was shared to tha world'));
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      // fallback code
      console.log(
        'Web share is currently not supported on this browser. Please provide a callback'
      );
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: watchLogin,
    formState: { errors: errorsLogin }
  } = useForm();

  const onLogIn: SubmitHandler<FieldValues> = (loginData) => {
    getGame(loginData['adminToken']);
    handleCloseAlert();
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues: getGameData,
    reset: resetGameForm
  } = useForm<GameResponse>({
    defaultValues: { ...game }
  });

  const lightFieldStyle = {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText'
    },
    '.MuiFormLabel-root': {
      color: 'primary.light'
    }
  };

  const getGame = useCallback((pass: string) => {
    fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}`, {
      //fetch(`http://localhost:8080/games/${gameId}`, {
      headers: {
        Authorization: `AdminToken ${pass}`
      }
    }).then(
      (response) => {
        setLoading(false);
        if (!response.ok) {
          setError(response.statusText);
          sessionStorage.removeItem('adminKey');
          alert(response.statusText);
        }

        response.json().then((data) => {
          setGame(data as GameResponse);
          setUpdatedGame(data as GameResponse);
          setGameTitle((data as GameResponse).title);
          resetGameForm(data);
          sessionStorage.setItem('adminKey', pass);
        });
      },
      (error) => {
        setLoading(false);
        alert(error.message);
        setError(error.message);
      }
    );
  }, []);

  const handleFormOnChange =
    (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUpdatedGame({
        ...updatedGame,
        [fieldName]: event.target.value
      });
    };

  return (
    <div className={styles.main}>
      <h1 className={styles.header}>This is home for game: {gameId}</h1>
      <div className={styles.wrapper}>
        {!game && (
          <Button variant="contained" onClick={() => handleClickImAdmin()}>
            I am admin
          </Button>
        )}
        {game && (
          <>
            <form onSubmit={() => alert('update')}>
              <TextField
                sx={lightFieldStyle}
                margin="normal"
                label="Game title"
                variant="filled"
                fullWidth
                {...register('title')}
              />
              <TextField
                multiline
                sx={lightFieldStyle}
                margin="normal"
                label="Game Description"
                variant="filled"
                fullWidth
                onChange={handleFormOnChange('desc')}
                defaultValue={updatedGame.desc}
              />
              <MobileDateTimePicker
                sx={lightFieldStyle}
                defaultValue={dayjs(getGameData('autoOpen'))}
              />
              <FormControlLabel
                labelPlacement="start"
                control={<Switch defaultChecked={game.isOpen} />}
                label="Game is open?"
                {...register('isOpen')}
              />
              <MobileDateTimePicker
                sx={lightFieldStyle}
                defaultValue={dayjs(getGameData('lastRecipientTips'))}
              />
              <FormControlLabel
                labelPlacement="start"
                control={<Switch defaultChecked={game.declareForAll} />}
                label="Declare for all?"
                {...register('declareForAll')}
              />
              <FormControlLabel
                labelPlacement="start"
                control={<Switch defaultChecked={game.declareMyGiver} />}
                label="Declare giver?"
                {...register('declareMyGiver')}
              />
              <Button
                onClick={() => console.log(updatedGame.desc)}
                type="submit"
                variant="outlined"
                fullWidth
              >
                Update
              </Button>
            </form>
            {game.participants.map((p, k) => (
              <Box key={p.id}>
                <Button
                  sx={{ margin: '10px 0' }}
                  fullWidth
                  onClick={() => handleSharing(p)}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  {p.name}
                </Button>
              </Box>
            ))}
          </>
        )}
      </div>
      <AlertModal onClose={handleCloseAlert} open={alertOpen} title={'Login'}>
        <form onSubmit={handleSubmitLogin(onLogIn)}>
          <TextField
            defaultValue={sessionStorage.getItem('adminKey')}
            type="password"
            label="Admin key"
            variant="outlined"
            fullWidth
            {...registerLogin('adminToken')}
          />
          <Button type="submit" variant="outlined" fullWidth>
            Login
          </Button>
        </form>
      </AlertModal>
    </div>
  );
}

export default ChristmasHome;
