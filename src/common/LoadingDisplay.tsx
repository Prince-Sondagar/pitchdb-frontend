import { LoadingIcon } from '.';
import { loadingDisplayTypes } from '../types';

interface IProps {
  type: loadingDisplayTypes;
}

export function LoadingDisplay({ type }: IProps) {
  const getStyle = (property: 'width' | 'height') => {
    switch (type) {
      case loadingDisplayTypes.entireComponent:
        return '100%';
      case loadingDisplayTypes.entireScreen:
        return `100sv${property === 'width' ? 'w' : 'h'}`;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: getStyle('height'),
        width: getStyle('width'),
      }}
    >
      <LoadingIcon size={type === loadingDisplayTypes.entireScreen ? 'loading-huge' : ''} />
    </div>
  );
}
