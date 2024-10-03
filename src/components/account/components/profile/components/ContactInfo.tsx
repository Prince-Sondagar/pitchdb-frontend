import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { Genre, IProfileData } from '../../../../../types';
import styles from '../../../Account.module.css';

export interface IProps {
  data: IProfileData | null;
  handleSetProfileData: (name: string, value: string | boolean | Genre[]) => void;
}

export const ContactInfo: React.FC<IProps> = ({ data, handleSetProfileData }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    handleSetProfileData(name, value);
  };

  return (
    <div className={styles.contactInfoWrapper}>
      <TextField name="name" label="Name" onChange={handleInputChange} value={data?.name} />
      <TextField
        value={data?.email}
        type="email"
        name="email"
        label="Email"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.businessname}
        name="businessname"
        label="Business name"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.website}
        type="url"
        name="website"
        label="Website URL"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.socialMediaLink1}
        name="socialMediaLink1"
        label="Social media link #1"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.socialMediaLink2}
        name="socialMediaLink2"
        label="Social media link #2"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.socialMediaLink3}
        name="socialMediaLink3"
        label="Social media link #3"
        onChange={handleInputChange}
      />
      <TextField
        value={data?.Equipment}
        name="Equipment"
        label="Equipment"
        onChange={handleInputChange}
        multiline
        rows={2}
      />
      <TextField
        value={data?.additionalinfo}
        name="additionalinfo"
        label="Additional info"
        onChange={handleInputChange}
        multiline
        rows={2}
      />
      <TextField
        value={data?.optionalcontactmethod}
        name="optionalcontactmethod"
        label="Optional contact method"
        onChange={handleInputChange}
      />
    </div>
  );
};
