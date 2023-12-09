import React, {useCallback, useState} from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, FormControlLabel, Switch,
  TextField,
} from '@mui/material';

import styles from './ChristmasHome.module.css';
import { GameResponse } from '../../../api/types/games';
import AlertModal from '../../../components/AlertModal/AlertModal';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import {MobileDateTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";


function ChristmasHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [game, setGame] = useState<GameResponse>();
  const {gameId} = useParams();
  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickImAdmin = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSharing = async () => {
    if (navigator.share) {
      try {
        await navigator
            .share({title: "testShare", url: "google.com", text: "Hej, välkkommen till julklappsspelet. Bromsvägen 2023" })
            .then(() =>
                console.log("Hooray! Your content was shared to tha world")
            );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      // fallback code
      console.log(
          "Web share is currently not supported on this browser. Please provide a callback"
      );
    }
  };

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    watch: watchLogin,
    formState: {errors: errorsLogin}
  } = useForm();

  const onLogIn: SubmitHandler<FieldValues> = (loginData) => {
    getGame(loginData['adminToken']);
    handleCloseAlert();
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    getValues: getGameData,
    reset: resetGameForm
  } = useForm<GameResponse>({
    defaultValues: {...game}
  });

  const lightFieldStyle = {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText'
    },
    '.MuiFormLabel-root': {
      color: 'primary.light'
    }
  }

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
  return (
    <div className={styles.main}>
      <h1 className={styles.header}>This is home for game: {gameId}</h1>
      <div className={styles.wrapper}>
        {!game ? (
          <Button variant="contained" onClick={() => handleClickImAdmin()}>
            I am admin
          </Button>
        ) : (
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
              sx={lightFieldStyle}
              margin="normal"
              label="Game Description"
              variant="filled"
              fullWidth
              {...register('desc')}
            />
            <MobileDateTimePicker sx={lightFieldStyle} defaultValue={dayjs(getGameData('autoOpen'))} />
            <FormControlLabel labelPlacement="start" control={<Switch defaultChecked={game.isOpen} />} label="Game is open?" {...register('isOpen')}/>
            <MobileDateTimePicker sx={lightFieldStyle} defaultValue={dayjs(getGameData('lastRecipientTips'))} />
            <FormControlLabel labelPlacement="start" control={<Switch defaultChecked={game.declareForAll} />} label="Declare for all?" {...register('declareForAll')}/>
            <FormControlLabel labelPlacement="start" control={<Switch defaultChecked={game.declareMyGiver} />} label="Declare giver?" {...register('declareMyGiver')}/>
            <Button type="submit" variant="outlined" fullWidth>
              Update
            </Button>
          </form>
        )}
        <Button onClick={()=> handleSharing()}>Dela mig!</Button>
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
