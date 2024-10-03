import React, { useRef } from 'react';
import { Typography, Button } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
  addUserProfileImage,
  deleteUserProfileImage,
  profileSelectors,
} from '../../../../../redux/profile';
import { errorAlert, openConfirmation } from '../../../../../redux/alerts';
import styles from '../../../Account.module.css';

interface IProps {
  userId: string;
}

export const UploadImage: React.FC<IProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const userImagePath = useAppSelector(profileSelectors.userImagePath);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeImage = () => {
    if (fileInputRef && fileInputRef.current) {
      const selectedFile = fileInputRef.current.files?.[0];

      if (!selectedFile) {
        return;
      }

      const fileSizeMB = selectedFile.size / (1024 * 1024); // Convert size to megabytes
      if (fileSizeMB <= 1) {
        const formData = new FormData();
        formData.append('profileImg', selectedFile);
        dispatch(addUserProfileImage(formData));
      } else {
        dispatch(errorAlert('The image size must be less than 1 MB'));
      }
    }
  };

  const deleteImage = async () => {
    const confirmation = await dispatch(
      openConfirmation({
        message: 'Do you want to delete your image profile?',
        confirmMessage: 'Confirm delete',
      }),
    ).unwrap();

    if (confirmation && userId) {
      dispatch(deleteUserProfileImage(userId));
    }
  };

  return (
    <div className={`${styles.uploadImageContainer}`}>
      {userImagePath ? (
        <div className={`${styles.uploadImageContainer}`}>
          <img
            alt="Profile picture"
            src={import.meta.env.VITE_PROFILE_ENDPOINT_URL + userImagePath}
            width="100%"
            height="100%"
          />
          <div className={`${styles.avatarContainer}`}>
            <IconButton aria-label="change-image">
              <EditIcon />
              <input type="file" accept="image/*" hidden onChange={handleChangeImage} />
            </IconButton>
            <IconButton aria-label="change-image" onClick={deleteImage}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="h3">Upload Profile Picture</Typography>
          <Button
            variant="contained"
            className={`${styles.uploadButton}`}
            endIcon={<CloudUploadIcon />}
          >
            Upload Image
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleChangeImage}
            />
          </Button>
        </div>
      )}
    </div>
  );
};
