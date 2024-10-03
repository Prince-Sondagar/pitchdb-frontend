import { useEffect, useState } from 'react';
import { timeZoneoptions, weekDaysCheckboxes } from '../../../../../constants/calendar';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import styles from '../../../Account.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { addEmailConfig, userSelectors } from '../../../../../redux/user';
import { ICheckboxesDays } from '../../../../../types';

interface ISendingCalendarProps {
  userId: string | null;
}

export const SendingCalendarTab: React.FC<ISendingCalendarProps> = ({ userId }) => {
  const currentEmailConfig = useAppSelector(userSelectors.emailConfig);
  const dispatch = useAppDispatch();

  const startFixTime = new Date();
  startFixTime.setHours(8);
  startFixTime.setMinutes(0);
  startFixTime.setSeconds(0);

  const endFixTime = new Date();
  endFixTime.setHours(18);
  endFixTime.setMinutes(0);
  endFixTime.setSeconds(0);

  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(startFixTime.toISOString()));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(startFixTime.toISOString()));
  const [timeZone, setTimeZone] = useState('(GMT+00:00) Casablanca, Monrovia, Reykjavik');
  const [selectedDays, setSelectedDays] = useState<ICheckboxesDays>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  useEffect(() => {
    if (currentEmailConfig) {
      setSelectedDays(currentEmailConfig?.selectedDays);
      setStartTime(dayjs(currentEmailConfig?.startTime));
      setEndTime(dayjs(currentEmailConfig?.endTime));
      setTimeZone(currentEmailConfig?.timeZone);
    }
  }, [currentEmailConfig]);

  const handleChangeCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDays({
      ...selectedDays,
      [event.target.name]: event.target.checked,
    });
  };

  const handleStartTimeChange = (time: Dayjs | null) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    setEndTime(time);
  };

  const handleTimeZoneChange = (event: SelectChangeEvent) => {
    setTimeZone(event.target.value);
  };

  const handleSubmit = () => {
    if (userId) {
      const requestdata = {
        userId: userId,
        selectedDays: selectedDays,
        startTime: dayjs(startTime).toDate(),
        endTime: dayjs(endTime).toDate(),
        timeZone: timeZone,
      };
      dispatch(addEmailConfig(requestdata));
    }
  };

  return (
    <div className={`${styles.contentWrapper}`}>
      <Typography variant="h3">Send on these days</Typography>
      <FormGroup className={styles.FormGroup}>
        {weekDaysCheckboxes.map((day) => (
          <FormControlLabel
            className={styles.FormControlLabel}
            key={day.key}
            control={
              <Checkbox
                checked={selectedDays[day.name as keyof ICheckboxesDays]}
                onChange={handleChangeCheckBox}
                name={day.name}
                color="primary"
              />
            }
            label={day.label}
          />
        ))}
      </FormGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']} sx={{ mx: 'auto' }}>
          <TimePicker
            className={styles.timePicker}
            label="Start Time of Day"
            value={startTime}
            onChange={handleStartTimeChange}
          />
          <Typography variant="body1">to</Typography>
          <TimePicker
            className={styles.timePicker}
            label="End Time of Day"
            value={endTime}
            onChange={handleEndTimeChange}
          />
        </DemoContainer>
      </LocalizationProvider>

      <Select className={styles.multiSelect} value={timeZone} onChange={handleTimeZoneChange}>
        {timeZoneoptions.map((timeZone) => (
          <MenuItem className={styles.menuItem} key={timeZone.key} value={timeZone.label}>
            {timeZone.label}
          </MenuItem>
        ))}
      </Select>
      <Button className={styles.buttonSave} onClick={handleSubmit} variant="contained">
        Save
      </Button>
    </div>
  );
};
