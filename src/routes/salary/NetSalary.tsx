import React, { useCallback, useState } from 'react';
import styles from './NetSalary.module.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import AlertModal from '../../components/AlertModal/AlertModal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NetSalaryResponse, SalaryRequest } from '../../api/types/salary';

const NetSalary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState<
    { title: string; msg: string } | undefined
  >(undefined);
  const [result, setResult] = React.useState<NetSalaryResponse>();

  const setAlert = (msg: string, title?: string) => {
    setAlertContent({ title: title || '', msg: msg });
    setAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setAlertContent(undefined);
  };

  const {
    register: registerSalary,
    getValues,
    handleSubmit: handleSubmitCalcSalary,
    watch: watchSalaryInput,
    formState: { errors: errorsLogin },
    control
  } = useForm();

  const onCalc: SubmitHandler<FieldValues> = (salaryData) => {
    getSalary();
  };

  const getSalaryFormInput = () => {
    const input: SalaryRequest = {
      ...getValues()
    } as SalaryRequest;

    input.companyCar = { ...getValues('companyCar') };
    //nonCarCompensation

    if (input.companyCar) {
      const nonCarCompensation = getValues('companyCar.nonCarCompensation');
      if (nonCarCompensation) {
        console.log(`nonCarCompensation: ${nonCarCompensation}`);
        input.grossSalary = input.grossSalary + nonCarCompensation;
        const grossDeduction = input.companyCar.grossDeduction || 0;
        input.companyCar.grossDeduction = grossDeduction + nonCarCompensation;
        console.log(`grossDeduction + nonCarCompensation: ${grossDeduction + nonCarCompensation}`);
        console.log(`input.companyCar.grossDeduction: ${input.companyCar.grossDeduction}`);
      }
      if (input.companyCar.grossDeductionPct) {
        input.companyCar.grossDeductionPct = input.companyCar.grossDeductionPct / 100;
      }
    }

    return input;
  };

  const getSalary = useCallback(() => {
    setLoading(true);
    fetch(`https://christmas-space-s7sdcyjejq-lz.a.run.app/salary/calc-netSalary`, {
      //fetch(`http://localhost:8080/salary/calc-netSalary`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(getSalaryFormInput())
    }).then(
      (response) => {
        setLoading(false);
        if (!response.ok) {
          setError(response.statusText);
        }

        response.json().then((data) => {
          setResult(data as NetSalaryResponse);
          console.log(data);
        });
      },
      (error) => {
        setLoading(false);
        alert(error.message);
        setError(error.message);
      }
    );
  }, []);

  const taxTables = [29, 30, 31, 32, 33, 34, 35, 36, 37, 38];
  const lightSelectStyle = {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText',
      '.MuiSvgIcon-root': {
        color: 'primary.contrastText'
      }
    },
    '.MuiFormLabel-root': {
      color: 'primary.light',
      '&.Mui-focused': {
        color: 'primary.light'
      }
    }
  };

  const lightFieldStyle = {
    '& .MuiInputBase-root': {
      color: 'primary.contrastText'
    },
    '.MuiFormLabel-root': {
      color: 'primary.light'
    }
  };

  return (
    <>
      <div className={styles.main}>
        <h1 className={styles.header}>{'Lönekalkylator!'}</h1>
        <div className={styles.wrapper}>
          <form onSubmit={handleSubmitCalcSalary(onCalc)}>
            <TextField
              defaultValue={localStorage.getItem('grossSalary')}
              type="number"
              label="Din bruttolön"
              variant="filled"
              fullWidth
              sx={{ ...lightFieldStyle }}
              {...registerSalary('grossSalary', {
                valueAsNumber: true,
                onChange: (e) => {
                  localStorage.setItem('grossSalary', e.target.value);
                }
              })}
            />
            <FormControl fullWidth sx={{ mt: '6px', ...lightSelectStyle }}>
              <InputLabel variant={'filled'}>{'Skattetabell'}</InputLabel>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <Select
                    variant="filled"
                    onChange={(e) => {
                      onChange(e);
                      localStorage.setItem('table', e.target.value);
                    }}
                    value={value}
                  >
                    {taxTables.map((person) => (
                      <MenuItem key={person} value={person}>
                        {person}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                control={control}
                name={'table'}
                defaultValue={() => {
                  const t = localStorage.getItem('table');
                  return t ? parseInt(t, 10) : 30;
                }}
              />
            </FormControl>
            <Accordion sx={{ mt: '12px' }} className={styles.desc}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Tjänstebil</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Policy:</Typography>
                <TextField
                  defaultValue={localStorage.getItem('companyCar.nonCarCompensation')}
                  type="number"
                  label="Lönetillägg utan bil SEK"
                  variant="filled"
                  fullWidth
                  {...registerSalary('companyCar.nonCarCompensation', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      localStorage.setItem('companyCar.nonCarCompensation', e.target.value);
                    }
                  })}
                />
                <TextField
                  defaultValue={localStorage.getItem('companyCar.grossDeduction')}
                  type="number"
                  label="Bruttolöneavdrag SEK"
                  variant="filled"
                  fullWidth
                  {...registerSalary('companyCar.grossDeduction', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      localStorage.setItem('companyCar.grossDeduction', e.target.value);
                    }
                  })}
                />
                <TextField
                  defaultValue={localStorage.getItem('companyCar.rossDeductionPct')}
                  type="number"
                  label="Bruttolöneavdrag % av leasingavgift"
                  variant="filled"
                  fullWidth
                  {...registerSalary('companyCar.grossDeductionPct', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      localStorage.setItem('companyCar.rossDeductionPct', e.target.value);
                    }
                  })}
                />
                <Typography>Bil:</Typography>
                <TextField
                  defaultValue={localStorage.getItem('companyCar.leasingFee')}
                  type="number"
                  label="Leasingavgift"
                  variant="filled"
                  fullWidth
                  {...registerSalary('companyCar.leasingFee', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      localStorage.setItem('companyCar.leasingFee', e.target.value);
                    }
                  })}
                />
                <TextField
                  defaultValue={localStorage.getItem('companyCar.taxableBenefit')}
                  type="number"
                  label="Förmånsvärde"
                  variant="filled"
                  fullWidth
                  {...registerSalary('companyCar.taxableBenefit', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      localStorage.setItem('companyCar.taxableBenefit', e.target.value);
                    }
                  })}
                />
              </AccordionDetails>
            </Accordion>
            <Button sx={{ mt: '12px' }} type="submit" variant="outlined" fullWidth>
              Beräkna
            </Button>
          </form>
        </div>
        {result && (
          <div className={styles.wrapper}>
            <Typography mt={2}>Utan bil</Typography>
            <Box display="flex" justifyContent={'space-between'}>
              <Typography>Bruttolön:</Typography>
              <Typography>{result.grossSalary}</Typography>
            </Box>
            <Box display="flex" justifyContent={'space-between'}>
              <Typography>Skatt:</Typography>
              <Typography>{result.tax * -1}</Typography>
            </Box>
            <Box display="flex" justifyContent={'space-between'}>
              <Typography sx={{ fontWeight: 'bold' }}>Nettolön:</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{result.netSalary}</Typography>
            </Box>
            {result.withCar && (
              <>
                <Typography mt={2}>Med bil</Typography>
                <Box display="flex" justifyContent={'space-between'}>
                  <Typography>Bruttolön:</Typography>
                  <Typography>{result.grossSalary - result.withCar.totalGrossDeduction}</Typography>
                </Box>
                <Box display="flex" justifyContent={'space-between'}>
                  <Typography>Skatt:</Typography>
                  <Typography>{result.withCar.tax * -1}</Typography>
                </Box>
                <Box display="flex" justifyContent={'space-between'}>
                  <Typography sx={{ fontWeight: 'bold' }}>Nettolön:</Typography>
                  <Typography sx={{ fontWeight: 'bold' }}>{result.withCar.netSalary}</Typography>
                </Box>
                <Box display="flex" justifyContent={'space-between'}>
                  <Typography>Kostnad bil:</Typography>
                  <Typography>{result.withCar.totalNetCost}</Typography>
                </Box>
              </>
            )}
          </div>
        )}
      </div>
      <AlertModal
        onClose={handleCloseAlert}
        open={alertOpen}
        title={alertContent ? alertContent.title : undefined}
        message={alertContent ? alertContent.msg : undefined}
      />
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

export default NetSalary;
