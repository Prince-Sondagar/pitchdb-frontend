import { useCallback, useEffect, useState } from 'react';
import { Tabs, Tab, Typography, Button } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { useAppSelector } from '../../../../redux/hooks';
import { userSelectors } from '../../../../redux/user';
import { addProfileData, getProfileData, profileSelectors } from '../../../../redux/profile';
import { useAppDispatch } from '../../../../redux/hooks';
import { ContactInfo, TabPanel, SpeakingTopics, PastAppearences, UploadImage } from './components';
import { Genre, IProfileData } from '../../../../types';
import { getGenres } from '../../../../redux/searchParameters';
import { openConfirmation } from '../../../../redux/alerts';
import styles from '../../Account.module.css';

export function Profile() {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector(profileSelectors.profileData);
  const userData = useAppSelector(userSelectors.userData);

  const [value, setValue] = useState(0);
  const [userProfile, setUserProfile] = useState<IProfileData | null>({});
  const [unPublishProfile, setUnPublishProfile] = useState(false);

  const getProfile = useCallback(async () => {
    const userId = userData?._id;

    if (userId) {
      const params = {
        userId: userId,
      };

      await dispatch(getProfileData(params));
      await dispatch(getGenres());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    setUserProfile(profileData || null);
    setUnPublishProfile(profileData?.unPublishProfile || false);
  }, [profileData]);

  const handleChange = (_event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  const handleNextButtonClick = async () => {
    if (value < 3) {
      setValue((prevValue) => prevValue + 1);
    } else {
      const confirmation = await dispatch(
        openConfirmation({
          message: 'Do you want to save the changes made to your profile?',
          confirmMessage: 'Confirm save',
        }),
      ).unwrap();

      if (confirmation && userProfile) {
        const params = {
          data: userProfile,
        };

        dispatch(addProfileData(params));
      }
    }
  };

  const onUnPublishProfileChange = async (booleanSelection: boolean) => {
    const word = booleanSelection ? 'unpublish' : 'publish';

    const confirmation = await dispatch(
      openConfirmation({
        message: 'Do you want to ' + word + ' your profile?',
        confirmMessage: 'Confirm',
      }),
    ).unwrap();

    if (confirmation && userProfile) {
      setUnPublishProfile(booleanSelection);

      const params = {
        data: {
          ...userProfile,
          unPublishProfile: booleanSelection,
        },
      };

      dispatch(addProfileData(params));
    }
  };

  const handleSetProfileData = (name: string, value: string | boolean | Genre[]) => {
    setUserProfile((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className={`${styles.content}`}>
      <div style={{ margin: '2rem 0' }}>
        <Typography variant="h3">Profile</Typography>
      </div>
      <div className={styles.visibilityWrapper}>
        <Typography variant="body2" color="text.secondary">
          <b>Visibility</b>
          <br />
          {unPublishProfile ? 'Your profile is not published' : 'Your profile is published'}
        </Typography>
        <Button
          variant={unPublishProfile ? 'contained' : 'outlined'}
          color={unPublishProfile ? 'primary' : 'error'}
          onClick={() => onUnPublishProfileChange(unPublishProfile ? false : true)}
        >
          {unPublishProfile ? 'Publish profile' : 'Unpublish profile'}
        </Button>
      </div>
      <div className={styles.profileOptionsWrapper}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          className={styles.tabMenuProfileAndConfiguration}
          variant="fullWidth"
        >
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<AddPhotoAlternateOutlinedIcon />}
            label="Profile image"
          />
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<AccountCircleOutlinedIcon />}
            label="Contact info"
          />
          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<LayersOutlinedIcon />}
            label="Speaking topics"
          />

          <Tab
            className={styles.tabMenuWrapperIcons}
            icon={<ClassOutlinedIcon />}
            label="Previous occasions"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <UploadImage userId={profileData?.userId || ''} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ContactInfo data={userProfile} handleSetProfileData={handleSetProfileData} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SpeakingTopics data={userProfile} handleSetProfileData={handleSetProfileData} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <PastAppearences data={userProfile} handleSetProfileData={handleSetProfileData} />
        </TabPanel>
        <div className={styles.buttonContainer}>
          <Button variant="contained" color="primary" size="large" onClick={handleNextButtonClick}>
            {value < 3 ? 'Next' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
