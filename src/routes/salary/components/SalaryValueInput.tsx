import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IconButton, Slider, Stack, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { StepCalculator } from '../../../utils/Slider';

function SalaryValueInput(props: {
  name: string;
  defaultValue?: number;
  onChange?: (newValue: number) => void;
  textFieldSx: {};
  register: UseFormRegister<FieldValues>;
  useFormSetValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  sliderStep?: number;
  sliderMax?: number;
  hideSlider?: boolean;
}) {
  const [isEdit, setIsEdit] = useState(false);

  const [defaultValue, setDefaultValue] = useState(props.defaultValue || 0);
  const currentValue =
    typeof props.watch(props.name) == 'number' ? props.watch(props.name) : defaultValue;

  // initial load
  useEffect(() => {
    if (isEdit) {
      setDefaultValue(currentValue);
    }
  }, [currentValue, defaultValue, isEdit]);

  const calcStep = useCallback(StepCalculator, []);

  const step = useMemo<number>(() => {
    return props.sliderStep || calcStep(Math.abs(defaultValue * 0.1), 0.5, 10);
  }, [defaultValue, props.sliderStep, calcStep]);

  const max = useMemo<number>(() => {
    return props.sliderMax || (defaultValue ? defaultValue * 2 : 100);
  }, [defaultValue, props.sliderMax]);

  const handleSliderClickChange = (direction: 'up' | 'down') => {
    const newValue = direction == 'up' ? currentValue + step : currentValue - step;
    if (newValue < 0) return;
    props.useFormSetValue(props.name, newValue);
    props.onChange && props.onChange(newValue);
  };

  return (
    <>
      <Typography>{currentValue}</Typography>
      <Stack
        display="flex"
        mt={2}
        mb={0}
        justifyContent="space-between"
        direction="row"
        spacing={0}
        alignItems={'center'}
      >
        <Typography minWidth="8em" align="left">
          Begärd justering:
        </Typography>
        <div
          style={{
            marginLeft: 0,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '50px'
          }}
        >
          {isEdit ? (
            <TextField
              focused={isEdit}
              autoFocus
              size={'small'}
              defaultValue={defaultValue}
              type="number"
              label={undefined}
              variant="standard"
              sx={{
                ...props.textFieldSx,
                marginLeft: '0px',
                'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0
                },
                'input[type=number]': {
                  MozAppearance: 'textfield'
                }
              }}
              inputProps={{
                style: { textAlign: 'right' }
              }}
              {...props.register(props.name, {
                valueAsNumber: true,
                onChange: (e) => {
                  if (props.onChange) props.onChange(Number(e.target.value));
                }
              })}
              onBlur={(event) => {
                setIsEdit(false);
              }}
            />
          ) : (
            <Typography>
              {currentValue ? `${currentValue > 0 ? '+' : ''}${currentValue}` : '—'}{' '}
            </Typography>
          )}
          <Typography ml={'0.3em'}>SEK</Typography>
          <IconButton onClick={() => setIsEdit(!isEdit)}>
            {isEdit ? (
              <CheckIcon fontSize="small" color={'success'} />
            ) : (
              <EditIcon fontSize="small" color={'primary'} />
            )}
          </IconButton>
        </div>
      </Stack>
      <Stack mt={0} mb={2} direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={() => handleSliderClickChange('down')}>
          <ThumbDownIcon color="error" />
        </IconButton>
        <Slider
          onChange={(e, newValue) => {
            if (props.onChange) props.onChange(newValue as number);
            props.useFormSetValue(props.name, newValue);
          }}
          value={Number(currentValue)}
          aria-label="nominal change"
          min={0}
          max={max}
          step={step}
        ></Slider>
        <IconButton onClick={() => handleSliderClickChange('up')}>
          <ThumbUpIcon color="success" />
        </IconButton>
      </Stack>
    </>
  );
}

export default SalaryValueInput;
