import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
  Chip,
  Grid,
  Typography,
  useTheme
} from '@mui/material';

import { GameResponse } from '../../../api/types/games';
import styles from './ParticipantGame.module.css';
import AlertModal from '../../../components/AlertModal/AlertModal';

type ParticipantGameProps = {
  game: GameResponse;
  setGame: (input: GameResponse | undefined) => void;
  introOpen: boolean;
  handleCloseIntro: () => void;
};

const ParticipantGame: FC<ParticipantGameProps> = ({
  game,
  setGame,
  introOpen,
  handleCloseIntro
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const { participantId } = useParams();
  const [newGiftTips, setNewGiftTips] = React.useState<string | undefined>(undefined);
  const [openForTips, setOpenForTips] = React.useState<boolean>(false);
  const [persistedGiftTips, setPersistedGiftTips] = React.useState<string | undefined>(undefined);

  const [showRecipient, setShowRecipient] = useState(false);

  const saveTips = useCallback(
    (tips: string | undefined) => {
      fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/games/${game.id}/${participantId}`, {
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
            if (game.me) {
              setGame({ ...game, me: { ...game.me, tips: data } });
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

  const latestTipsStr = useCallback(
    (weekday?: boolean) => {
      if (game.lastRecipientTips) {
        const latestDate = new Date(Date.parse(game.lastRecipientTips));
        return `${
          weekday
            ? `${latestDate.toLocaleString('sv-SE', {
                weekday: 'long'
              })} den`
            : ''
        }${latestDate.getDate()}:e kl ${latestDate.getHours()}:${
          latestDate.getMinutes() < 10 ? '0' : ''
        }${latestDate.getMinutes()}`;
      }
      return undefined;
    },
    [game]
  );

  let descArray: string[] | undefined;
  if (game.desc) {
    descArray = game.desc.split('\n');
  }

  useEffect(() => {
    if (game.me) {
      setPersistedGiftTips(game.me.tips);
      setNewGiftTips(game.me.tips);
    }
    setOpenForTips(game.openForTips);
    //setOpenForTips(true);
  }, [game]);

  const giftChanged = useMemo(() => {
    return newGiftTips != persistedGiftTips;
  }, [newGiftTips, persistedGiftTips]);

  const getMyTips = () => {
    if (game.me) {
      return game.me.tips;
    }
    return undefined;
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
          disabled={!openForTips && tipsStr != newGiftTips}
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

  return (
    <>
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
            {latestTipsStr(false) && (
              <Chip
                sx={{ marginLeft: '3px', color: openForTips ? 'error' : 'theme.palette.grey' }}
                size={'small'}
                label={`${openForTips ? 'senast ' + latestTipsStr() : 'tidsfrist passerad'}`}
              />
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography textAlign={'left'}>
              {openForTips
                ? 'Klicka på en typ av klapp du önskar dig för att tipsa din givare.'
                : 'Tidsfristen för att lämna eller byta tips är passerad.'}
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
                  onClick={() => setNewGiftTips(getMyTips())}
                  disabled={!openForTips && !giftChanged}
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
                  disabled={!openForTips && !giftChanged}
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
              ? `Du ${game.declareMyGiver ? 'har fått från' : 'ska  ge till'}`
              : game.isOpen
              ? `Klicka för att se ${game.declareMyGiver ? 'givare' : 'mottgare'}`
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
            <p className={styles.releaseDate}>
              {game.declareMyGiver ? game.me.receivingFrom : game.me.givingTo}
            </p>
          )}
        </div>
      )}
      <Button
        variant="contained"
        onClick={() => setShowRecipient(!showRecipient)}
        disabled={!game.isOpen}
      >
        {showRecipient
          ? `Dölj ${game.declareMyGiver ? 'givare' : 'mottagare'}`
          : `Visa ${game.declareMyGiver ? 'givare' : 'mottagare'}`}
      </Button>
      <AlertModal
        onClose={handleCloseIntro}
        open={introOpen && !!openForTips}
        title={game.title}
        confirmLabel={'Ok'}
      >
        {game && game.lastRecipientTips && (
          <Typography color={theme.palette.text.primary}>
            Du rekommenderas att{' '}
            <Typography
              display={'inline'}
              color={theme.palette.text.primary}
              sx={{ textDecoration: 'underline' }}
            >
              inte köpa din julklapp
            </Typography>{' '}
            förrän efter{' '}
            <Typography
              display={'inline'}
              color={theme.palette.text.primary}
              sx={{ fontWeight: 'bold' }}
            >
              {latestTipsStr(true)}
            </Typography>{' '}
            eftersom din mottagare fram till dess kan lämna tips på vilken typ av klapp den önskar.
            <Typography variant={'h6'} mt={2} color={theme.palette.text.primary}>
              Ge ditt egna tips (frivilligt)
            </Typography>
            <Typography mt={1} color={theme.palette.text.primary}>
              Du kan kan själv ge tips på vad du önskar så syns det för din givare när denne går in
              här på sidan. Kom bara ihåg att lämna ditt tips innan {latestTipsStr(true)}.
            </Typography>
            <Typography mt={1} color={theme.palette.text.primary}>
              Klicka på "Jag vill tipsa", välja ditt tips, och klicka sedan på "Spara" för att lämna
              ditt tips.
            </Typography>
          </Typography>
        )}
      </AlertModal>
    </>
  );
};

export default ParticipantGame;