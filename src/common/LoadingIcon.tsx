import spinner from '../assets/gifts/spinner.gif';
import './styles/LoadingIcon.styles.css';

export interface ILoadingIcon {
  size?: string;
  hidden?: boolean;
}

export const LoadingIcon = ({ hidden, size }: ILoadingIcon) => (
  <img
    src={spinner}
    alt="loading-icon"
    className={
      'loading-icon' + (hidden ? ' hidden' : '') + (size ? ' ' + size : ' loading-default')
    }
  />
);
