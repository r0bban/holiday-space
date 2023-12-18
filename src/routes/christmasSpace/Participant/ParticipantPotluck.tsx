import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameResponse } from '../../../api/types/games';
import styles from './ParticipantPotluck.module.css';
import AlertModal from '../../../components/AlertModal/AlertModal';
import {
  PotluckItem,
  PotluckItemOrder,
  PotluckItemTemp,
  PotluckItemType
} from '../../../api/types/potluck';
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from '@mui/material';
import ColdIcon from '@mui/icons-material/AcUnit';
import HotIcon from '@mui/icons-material/Whatshot';
import AlcoholIcon from '@mui/icons-material/Liquor';
import DrinkIcon from '@mui/icons-material/LocalDrink';

type ParticipantPotluckProps = {
  game: GameResponse;
  setGame: (input: GameResponse | undefined) => void;
  introOpen: boolean;
  handleCloseIntro: () => void;
};

const ParticipantPotluck: FC<ParticipantPotluckProps> = ({
  game,
  setGame,
  introOpen,
  handleCloseIntro
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const { participantId } = useParams();
  const [potluck, setPotluck] = useState<PotluckItem[]>();

  const tempPotluck: PotluckItem[] = [
    {
      title: 'Gravad lax',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Varmrökt lax',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Kallrökt lax',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Janssons frestelse',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'warm',
      type: 'food'
    },
    {
      title: 'Skinka',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Köttbullar',
      responsible: ['Robert', 'Yuliet'],
      temp: 'warm',
      type: 'food'
    },
    {
      title: 'Prinskorv',
      responsible: ['Robert', 'Yuliet'],
      temp: 'warm',
      type: 'food'
    },
    {
      title: 'Potatis',
      responsible: ['Robert', 'Yuliet'],
      temp: 'warm',
      type: 'food'
    },
    {
      title: 'Senap',
      responsible: ['Robert', 'Yuliet'],
      temp: 'cold',
      type: 'accessories'
    },
    {
      title: 'Bröd',
      responsible: ['Robert', 'Yuliet'],
      temp: 'cold',
      type: 'accessories'
    },
    {
      title: 'Smör',
      responsible: ['Robert', 'Yuliet'],
      temp: 'cold',
      type: 'accessories'
    },
    {
      title: 'Sill (3 st)',
      responsible: ['Diana', 'Daniel'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Bubbelvatten & Julmust',
      responsible: ['Diana', 'Daniel'],
      temp: 'cold',
      type: 'beverage'
    },
    {
      title: 'Julgodis',
      responsible: ['Diana', 'Daniel'],
      type: 'accessories',
      order: 'dessert'
    },
    {
      title: 'Rödbetssallad',
      responsible: ['Diana', 'Daniel'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Efterrätt',
      responsible: ['Diana', 'Daniel'],
      type: 'food',
      order: 'dessert'
    },
    {
      title: 'Ost till kex',
      responsible: ['Daimara'],
      type: 'food',
      order: 'dessert'
    },
    {
      title: 'Kex',
      responsible: ['Daimara'],
      type: 'food',
      order: 'dessert'
    },
    {
      title: 'Vindruvor',
      responsible: ['Daimara'],
      type: 'food',
      order: 'dessert'
    },
    {
      title: 'Julost',
      responsible: ['Daimara'],
      type: 'accessories'
    },
    {
      title: 'Rom',
      responsible: ['Robert', 'Yuliet'],
      type: 'alcohol'
    }
  ];

  useEffect(() => {
    setPotluck(tempPotluck);
  }, []);

  type potluckFilter = {
    type?: PotluckItemType;
    order?: PotluckItemOrder;
    temp?: PotluckItemTemp;
  };

  const potluckItemMatchFilter = (item: PotluckItem, filter: potluckFilter): boolean => {
    if (filter.type) {
      if (filter.type != item.type) return false;
    }
    if (filter.temp) {
      if (filter.temp != item.temp) return false;
    }
    if (filter.order) {
      if (filter.order != item.order) return false;
    }

    return true;
  };

  const getPotluckItems = (include?: potluckFilter[], exclude?: potluckFilter[]): PotluckItem[] => {
    if (!potluck) return [];
    let result: PotluckItem[] = potluck;
    if (include) {
      include.forEach((filter) => {
        result = result.filter((item) => potluckItemMatchFilter(item, filter));
      });
    }
    if (exclude) {
      exclude.forEach((filter) => {
        result = result.filter((item) => !potluckItemMatchFilter(item, filter));
      });
    }
    return result;
  };

  const makeListItem = (item: PotluckItem) => (
    <ListItem key={item.title}>
      <ListItemText primary={item.title} secondary={item.responsible.toString()} key={item.title} />
      {item.type && (item.type == 'beverage' || item.type == 'alcohol') && (
        <ListItemIcon>
          {item.type == 'beverage' ? <DrinkIcon sx={{ fontSize: 'medium' }} /> : <AlcoholIcon />}
        </ListItemIcon>
      )}
    </ListItem>
  );

  return (
    <>
      <Paper sx={{ mb: '10px' }}>
        <List>
          <ListSubheader sx={{ fontSize: '20px' }}>Tillbehör/Övrigt</ListSubheader>
          {getPotluckItems([{ type: 'accessories' }], [{ order: 'dessert' }]).map((item) =>
            makeListItem(item)
          )}
        </List>
      </Paper>

      <Paper sx={{ mb: '10px' }}>
        <List>
          <ListSubheader sx={{ fontSize: '20px' }}>
            Kalla rätter <ColdIcon fontSize={'small'} />
          </ListSubheader>
          {getPotluckItems([{ temp: 'cold' }], [{ type: 'beverage' }, { type: 'accessories' }]).map(
            (item) => makeListItem(item)
          )}
        </List>
      </Paper>
      <Paper sx={{ mb: '10px' }}>
        <List>
          <ListSubheader sx={{ fontSize: '20px' }}>
            Varma rätter <HotIcon />
          </ListSubheader>
          {getPotluckItems([{ temp: 'warm' }]).map((item) => makeListItem(item))}
        </List>
      </Paper>
      <Paper sx={{ mb: '10px' }}>
        <List>
          <ListSubheader sx={{ fontSize: '20px' }}>Efterätt</ListSubheader>
          {getPotluckItems([{ order: 'dessert' }]).map((item) => makeListItem(item))}
        </List>
      </Paper>
      <Paper sx={{ mb: '10px' }}>
        <List>
          <ListSubheader sx={{ fontSize: '20px' }}>Dryck</ListSubheader>
          {getPotluckItems([{ type: 'beverage' }]).map((item) => makeListItem(item))}
          {getPotluckItems([{ type: 'alcohol' }]).map((item) => makeListItem(item))}
        </List>
      </Paper>

      <AlertModal
        onClose={handleCloseIntro}
        open={introOpen}
        title={'Nyheter på väg'}
        message={'Här kommer vi tillsammans planera maten. Planerad lansering Måndag 18 december.'}
        confirmLabel={'Ok'}
      ></AlertModal>
    </>
  );
};

export default ParticipantPotluck;
