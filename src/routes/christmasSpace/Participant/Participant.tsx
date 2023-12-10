import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WidgetsIcon from '@mui/icons-material/Widgets';
import WavesIcon from '@mui/icons-material/Waves';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleFilledIcon from '@mui/icons-material/CheckCircle';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Typography,
  useTheme
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
  const [newGiftTips, setNewGiftTips] = React.useState<string | undefined>(undefined);
  const [persistedGiftTips, setPersistedGiftTips] = React.useState<string | undefined>(undefined);

  const [showRecipient, setShowRecipient] = useState(false);

  useEffect(() => {
    fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}/${participantId}`).then(
      //fetch(`http://localhost:8080/games/${gameId}/${participantId}`).then(
      (response) => {
        setLoading(false);
        if (!response.ok) {
          setError(response.statusText);
        }
        response.json().then((data) => {
          setGame(data as GameResponse);
          const me = (data as GameResponse).me;
          if (me) {
            setPersistedGiftTips(me.tips);
            setNewGiftTips(me.tips);
          }
        });
      },
      (error) => {
        setLoading(false);
        console.log(error.message);
        setError(error.message);
      }
    );
  }, []);

  const saveTips = useCallback(
    (tips: string | undefined) => {
      console.log(game);
      fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${gameId}/${participantId}`, {
        //fetch(`http://localhost:8080/games/${gameId}/${participantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tips: tips })
      }).then(
        (response) => {
          setLoading(false);
          if (!response.ok) {
            setError(response.statusText);
            alert(response.statusText);
          }
          response.json().then((data) => {
            if (game && game.me) {
              game.me.tips = data;
              setPersistedGiftTips(data);
              setNewGiftTips(data);
            }
          });
        },
        (error) => {
          setLoading(false);
          alert(error.message);
          setError(error.message);
        }
      );
    },
    [game, newGiftTips]
  );

  let startDate: Date | undefined;
  if (game && game.autoOpen) {
    startDate = new Date(Date.parse(game.autoOpen));
  }

  const latestTipsStr = useMemo(() => {
    if (game && game.lastRecipientTips) {
      const latestDate = new Date(Date.parse(game.lastRecipientTips));
      return `${latestDate.getDate()}:e kl ${latestDate.getHours()}:${
        latestDate.getMinutes() < 10 ? '0' : ''
      }${latestDate.getMinutes()}`;
    }
  }, [game]);

  let descArray: string[] | undefined;
  if (game && game.desc) {
    descArray = game.desc.split('\n');
  }

  useEffect(() => {
    if (game && game.me) setNewGiftTips(game.me.tips);
  }, [game]);

  const giftChanged = useMemo(() => {
    return newGiftTips != persistedGiftTips;
  }, [newGiftTips, persistedGiftTips]);

  const resetGift = () => {
    if (game && game.me) {
      return game.me.tips;
    }
    return undefined;
  };

  const [alertOpen, setAlertOpen] = React.useState(false);

  const handleClickFood = () => {
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const giftIconsLabel = useCallback(
    (str: string, size?: 'large' | 'medium' | 'small' | 'inherit' | undefined) => {
      const fontSize = size ? size : 'large';
      return new Map<string, { icon: any; label: string }>([
        ['hard', { icon: <WidgetsIcon fontSize={fontSize} />, label: 'hård klapp' }],
        ['soft', { icon: <WavesIcon fontSize={fontSize} />, label: 'mjuk klapp' }],
        ['bodySoul', { icon: <SelfImprovementIcon fontSize={fontSize} />, label: 'Kropp & Själ' }],
        ['useful', { icon: <BeachAccessIcon fontSize={fontSize} />, label: 'Användabart' }],
        ['surprise', { icon: <AutoAwesomeIcon fontSize={fontSize} />, label: 'Överaska mig' }],
        ['fun', { icon: <EmojiEmotionsIcon fontSize={fontSize} />, label: 'Roligt' }]
      ]).get(str);
    },
    []
  );

  const getTipsIcon = useCallback(
    (str: string, size?: 'large' | 'medium' | 'small' | 'inherit' | undefined) => {
      const icon = giftIconsLabel(str, size);
      if (icon) return icon.icon;
      return undefined;
    },
    []
  );

  const getTipsLabel = useCallback((str: string) => {
    const label = giftIconsLabel(str);
    if (label) return label.label;
    return undefined;
  }, []);

  const giftTipsButton = (tipsStr: string) => {
    const tips = giftIconsLabel(tipsStr);
    return (
      <Grid item xs={8} mt={1} mb={1}>
        <Button
          fullWidth
          sx={{ display: 'flex', flexDirection: 'column' }}
          variant={tipsStr == newGiftTips ? 'contained' : 'outlined'}
          onClick={() => setNewGiftTips(tipsStr)}
          aria-label="soft"
          color={tipsStr == newGiftTips ? 'success' : 'info'}
          size={'small'}
        >
          <Box sx={{ display: 'flex', width: '100%' }} justifyContent="flex-end" height="10px">
            {tipsStr == newGiftTips && <CheckCircleFilledIcon fontSize={'small'} />}
          </Box>
          {tips && tips.icon}
          {tips && tips.label}
        </Button>
      </Grid>
    );
  };

  const theme = useTheme();

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
              <span className={styles.dataText}> 350 kr</span>
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
          {game.me && (
            <Accordion className={styles.desc}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Jag vill tipsa</Typography>
                {latestTipsStr && (
                  <Chip
                    sx={{ marginLeft: '3px' }}
                    size={'small'}
                    color={'error'}
                    label={'senast ' + latestTipsStr}
                  />
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Typography textAlign={'left'}>
                  Klicka på en typ av klapp du önskar dig för att tipsa din givare.
                </Typography>
                <Grid container justifyContent={'space-between'} columns={17}>
                  {giftTipsButton('hard')}
                  {giftTipsButton('soft')}
                  {giftTipsButton('bodySoul')}
                  {giftTipsButton('useful')}
                  {giftTipsButton('fun')}
                  {giftTipsButton('surprise')}
                  <Grid item xs={8} mt={1} mb={1}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setNewGiftTips(resetGift())}
                      disabled={!giftChanged}
                      color={'error'}
                      endIcon={<RestoreIcon />}
                    >
                      Ångra
                    </Button>
                  </Grid>
                  <Grid item xs={8} mt={1} mb={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      color={'primary'}
                      onClick={() => saveTips(newGiftTips)}
                      disabled={!giftChanged}
                      endIcon={<SaveIcon />}
                    >
                      Spara
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
          {game.me && game.me.givingToTips && (
            <Box
              sx={{
                marginTop: '10px',
                borderRadius: '5px',
                paddingBottom: '10px',
                border: `1px solid ${theme.palette.secondary.main}`,
                backgroundColor: 'transparent'
              }}
            >
              <Typography color={theme.palette.getContrastText(theme.palette.primary.main)}>
                {`${
                  game.isOpen && game.me && showRecipient ? game.me.givingTo : 'Din mottagare'
                } tipsar:`}
              </Typography>
              <Button
                variant="contained"
                color={'secondary'}
                endIcon={getTipsIcon(game.me.givingToTips, 'large')}
                size={'small'}
              >
                {getTipsLabel(game.me.givingToTips)}
              </Button>
            </Box>
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
          confirmLabel={'Ok'}
        />
      </div>
    );
  }

  return <div className={styles.main}></div>;
}

export default Participant;
