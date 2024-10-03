import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { Genre, IProfileData } from '../../../../../types';
import styles from '../../../Account.module.css';

interface IProps {
  data: IProfileData | null;
  handleSetProfileData: (name: string, value: string | boolean | Genre[]) => void;
}

export const PastAppearences: React.FC<IProps> = ({ data, handleSetProfileData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    handleSetProfileData(name, value);
  };

  return (
    <div className={styles.contactInfoWrapper}>
      <TextField
        multiline
        rows={4}
        placeholder="Promotion Plan"
        name="promotionPlan"
        label="Promotion plan"
        value={data?.promotionPlan}
        onChange={handleInputChange}
      />
      <TextField
        multiline
        rows={4}
        placeholder="Sample question"
        name="sampleQuestion"
        label="Sample question"
        value={data?.sampleQuestion}
        onChange={handleInputChange}
      />
      <TextField
        placeholder="Own Podcast"
        value={data?.ownpodcast}
        name="ownpodcast"
        label="Own podcast"
        onChange={handleInputChange}
      />
      <TextField
        placeholder="Past Apperance #1"
        value={data?.past_appereance1?.title}
        name="past_appereance1"
        label="Past appereance #1"
        onChange={handleInputChange}
      />
      <TextField
        placeholder="Past Apperance #2"
        value={data?.past_appereance2?.title}
        name="past_appereance2"
        label="Past appereance #2"
        onChange={handleInputChange}
      />
      <TextField
        placeholder="Past Apperance #3"
        value={data?.past_appereance3?.title}
        name="past_appereance3"
        label="Past appereance #3"
        onChange={handleInputChange}
      />
    </div>
  );
};
