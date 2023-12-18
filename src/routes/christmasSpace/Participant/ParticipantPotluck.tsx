import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GameResponse, ParticipantResponse } from '../../../api/types/games';
import styles from './ParticipantPotluck.module.css';
import AlertModal from '../../../components/AlertModal/AlertModal';
import {
  PotluckItem,
  PotluckItemOrder,
  PotluckItemTemp,
  PotluckItemType
} from '../../../api/types/potluck';
import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  useTheme
} from '@mui/material';
import ColdIcon from '@mui/icons-material/AcUnit';
import HotIcon from '@mui/icons-material/Whatshot';
import AlcoholIcon from '@mui/icons-material/Liquor';
import DrinkIcon from '@mui/icons-material/LocalDrink';
import DessertIcon from '@mui/icons-material/Cake';

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

  const showOption = {
    showMine: 'SHOW_MINE',
    showMenu: 'SHOW_MENU',
    showByResponsible: 'SHOW_BY_RESPONSIBLE'
  };

  const getShowOptionLabel = (option: string) => {
    switch (option) {
      case showOption.showMine:
        return 'Mina';
      case showOption.showByResponsible:
        return 'Per ansvarig';
      case showOption.showMenu:
        return 'Meny';
    }
  };

  const [showOptionIs, setShowOptionIs] = useState<string>(showOption.showMenu);
  const handleSelectOnChange = (option: string) => {
    setShowOptionIs(option);
    localStorage.setItem('showOption', option);
  };
  const tempPotluck: PotluckItem[] = [
    {
      title: 'Gravad lax',
      responsible: ['Ewa-Lena', 'Anders'],
      temp: 'cold',
      type: 'food'
    },
    {
      title: 'Rom',
      responsible: ['Robert', 'Yuliet'],
      type: 'alcohol'
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
      title: 'Ägghalvor',
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
    }
  ];

  useEffect(() => {
    const storedShowOption = localStorage.getItem('showOption');
    if (storedShowOption) setShowOptionIs(storedShowOption);
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

  const getPotluckItems = (
    include?: potluckFilter[],
    exclude?: potluckFilter[],
    responsible?: string
  ): PotluckItem[] => {
    if (!potluck) return [];
    let result: PotluckItem[] = [];
    if (include) {
      include.forEach((filter) => {
        result.push(
          ...potluck.filter(
            (item) =>
              potluckItemMatchFilter(item, filter) && !result.some((e) => e.title === item.title)
          )
        );
      });
    }
    if (exclude) {
      exclude.forEach((filter) => {
        result = result.filter((item) => !potluckItemMatchFilter(item, filter));
      });
    }
    if (responsible) {
      result = result.filter((item) => item.responsible.includes(responsible));
    }
    return result;
  };

  const groupBy = <K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> => {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  };

  const getPotluckItemsPerResponsible = () => {
    if (potluck) {
      return groupBy(potluck, (item) => item.responsible.toString());
    }
    return new Map<string, Array<PotluckItem>>();
  };

  const renderPotluckItemsGroupedByResponsible = () => {
    const grouped = getPotluckItemsPerResponsible();
    return Array.from(grouped.keys()).map((group) => {
      const item = grouped.get(group);
      if (item) {
        item.sort((a, b) => a.title.localeCompare(b.title, 'sv'));
        return (
          <Paper sx={{ mb: '10px' }} key={group}>
            <List>
              <ListSubheader sx={{ fontSize: '20px' }}>{group}</ListSubheader>
              {item.map((item) => makeListItem(item, true))}
            </List>
          </Paper>
        );
      }
    });
  };

  const renderPotluckItemGroup = (
    title: string,
    icon?: React.ReactElement,
    filter?: { include?: potluckFilter[]; exclude?: potluckFilter[] }
  ) => {
    const include = filter ? filter.include : undefined;
    const exclude = filter ? filter.exclude : undefined;
    const responsible = game.me && showOptionIs === showOption.showMine ? game.me.name : undefined;
    const items = getPotluckItems(include, exclude, responsible);
    if (items.length > 0) {
      return (
        <Paper sx={{ mb: '10px' }}>
          <List>
            <ListSubheader sx={{ fontSize: '20px' }}>
              <>
                {title}
                {icon && icon}
              </>
            </ListSubheader>
            {items
              .sort((a, b) => a.title.localeCompare(b.title, 'sv'))
              .map((item) => makeListItem(item, showOptionIs === showOption.showMine))}
          </List>
        </Paper>
      );
    }
  };

  const makeListItem = (item: PotluckItem, hideSecondaryLabel?: boolean) => (
    <ListItem key={item.title} disablePadding sx={{ pl: '20px' }}>
      <ListItemText
        primary={item.title}
        secondary={hideSecondaryLabel ? undefined : item.responsible.toString()}
        key={item.title}
      />
      {item.type && (item.type == 'beverage' || item.type == 'alcohol') && (
        <ListItemIcon>
          {item.type == 'beverage' ? <DrinkIcon sx={{ fontSize: 'medium' }} /> : <AlcoholIcon />}
        </ListItemIcon>
      )}
    </ListItem>
  );
  const theme = useTheme();
  const lightSelectStyle = {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText',
      '.MuiSvgIcon-root': {
        color: 'primary.contrastText'
      }
    },
    '.MuiFormLabel-root': {
      color: 'primary',
      '&.Mui-focused': {
        color: 'primary.contrastText'
      }
    }
  };

  return (
    <>
      <Paper
        sx={{
          mb: '10px',
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor: 'transparent'
        }}
      >
        <FormControl
          variant="standard"
          sx={{ m: 1, width: '80%', minWidth: 120, ...lightSelectStyle }}
        >
          <InputLabel sx={{ color: 'white' }} id="group-by-label">
            Visa
          </InputLabel>
          <Select
            value={showOptionIs}
            onChange={(event) => handleSelectOnChange(event.target.value)}
            label="Visa"
          >
            <MenuItem value={showOption.showMenu}>Meny</MenuItem>
            <MenuItem value={showOption.showMine}>Mina</MenuItem>
            <MenuItem value={showOption.showByResponsible}>Per ansvarig</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <>
        {showOptionIs === showOption.showByResponsible ? (
          <>{renderPotluckItemsGroupedByResponsible()}</>
        ) : (
          <>
            {renderPotluckItemGroup('Tillbehör/Övrigt', undefined, {
              include: [{ type: 'accessories' }],
              exclude: [{ order: 'dessert' }]
            })}
            {renderPotluckItemGroup('Kalla rätter', <ColdIcon fontSize={'small'} />, {
              include: [{ temp: 'cold' }],
              exclude: [{ type: 'beverage' }, { type: 'accessories' }]
            })}
            {renderPotluckItemGroup('Varma rätter', <HotIcon fontSize={'small'} />, {
              include: [{ temp: 'warm' }]
            })}
            {renderPotluckItemGroup(
              'Efterätt',
              <DessertIcon sx={{ ml: '5px' }} fontSize={'small'} />,
              { include: [{ order: 'dessert' }] }
            )}
            {renderPotluckItemGroup('Dryck', undefined, {
              include: [{ type: 'beverage' }, { type: 'alcohol' }]
            })}
          </>
        )}
      </>
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
