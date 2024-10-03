import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../../../Account.module.css';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import {
  emailSelectors,
  getEmailSignature,
  updateEmailSignature,
} from '../../../../../redux/email';

interface ISignatureProps {
  userId: string;
}

export const SignatureTab: React.FC<ISignatureProps> = ({ userId }) => {
  const currentSignature = useAppSelector(emailSelectors.emailSignatureData);

  const [signature, setSignature] = useState('');

  const dispatch = useAppDispatch();

  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    dispatch(getEmailSignature(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setSignature(currentSignature);
  }, [currentSignature]);

  const handleChange = (text: string) => {
    setSignature(text);
  };

  const handleSaveButton = () => {
    const data = {
      signaturedata: editorRef.current?.getEditor().root.innerHTML?.trim() || '',
      userId: userId,
    };

    dispatch(updateEmailSignature(data));
  };

  return (
    <div className={`${styles.content}`}>
      <ReactQuill
        ref={editorRef}
        value={signature}
        onChange={handleChange}
        style={{ height: '40vh', margin: '2rem 2rem 3rem 2rem' }}
      />

      <div className={`${styles.buttonContainer}`}>
        <Button variant="outlined" style={{ marginRight: '1rem' }}>
          Send Email Test
        </Button>
        <Button variant="outlined" onClick={handleSaveButton}>
          Save
        </Button>
      </div>
    </div>
  );
};
