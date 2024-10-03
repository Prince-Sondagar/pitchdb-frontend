import microsoftLogo from '../../../assets/logos/microsoft-logo.png';
import googleLogo from '../../../assets/logos/google-logo.png';
import linkedinLogo from '../../../assets/logos/linkedin-logo.png';
import facebookLogo from '../../../assets/logos/facebook-logo.png';
import { socialNetworks } from '../../../constants';
import { formatToTitleCase } from '../../../utils';
import styles from './styles/SocialAuthenticationButton.module.css';
import { Typography } from '@mui/material';

interface IProps {
  network: socialNetworks;
  idPrefix?: string;
  onClick: () => void;
}

export function SocialAuthenticationButton({ network, onClick, idPrefix }: IProps) {
  const getImageSource = () => {
    switch (network) {
      case socialNetworks.LINKEDIN:
        return linkedinLogo;
      case socialNetworks.FACEBOOK:
        return facebookLogo;
      case socialNetworks.MICROSOFT:
        return microsoftLogo;
      default:
        // case socialNetworks.GOOGLE
        return googleLogo;
    }
  };

  return (
    <div className={styles.socialAuthButton}>
      <button id={`${idPrefix ?? ''}${network}`} className={network} onClick={onClick}>
        <div className={`${styles.logoWrapper} ${styles[network]}`}>
          <img src={getImageSource()} alt="Social log in" />
        </div>
        <div className={`${styles.textWrapper} ${styles[network]}`}>
          <Typography variant="body1">{`Log in with ${formatToTitleCase(network)}`}</Typography>
        </div>
      </button>
    </div>
  );
}
