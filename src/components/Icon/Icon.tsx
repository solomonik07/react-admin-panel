import React from 'react';
import ArrowLeftIcon from '../../assets/icons/arrowLeft.svg';
import ArrowRightIcon from '../../assets/icons/arrowRight.svg';
import CloseIcon from '../../assets/icons/close.svg';
import DotsThreeCircleIcon from '../../assets/icons/dotsThreeCircle.svg';
import EyeOffIcon from '../../assets/icons/eyeOff.svg';
import LockIcon from '../../assets/icons/lock.svg';
import LogoIcon from '../../assets/icons/logo.svg';
import PlusIcon from '../../assets/icons/plus.svg';
import PlusCircleIcon from '../../assets/icons/plusCircle.svg';
import RefreshIcon from '../../assets/icons/refresh.svg';
import SearchIcon from '../../assets/icons/search.svg';
import UserIcon from '../../assets/icons/user.svg';


export type IconName =
  | 'arrowLeft'
  | 'arrowRight'
  | 'close'
  | 'dotsThreeCircle'
  | 'eyeOff'
  | 'lock'
  | 'logo'
  | 'plus'
  | 'plusCircle'
  | 'refresh'
  | 'search'
  | 'user';

interface IconProps {
  name: IconName;
  className?: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  color?: string;
}

const iconMap: Record<IconName, string> = {
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  close: CloseIcon,
  dotsThreeCircle: DotsThreeCircleIcon,
  eyeOff: EyeOffIcon,
  lock: LockIcon,
  logo: LogoIcon,
  plus: PlusIcon,
  plusCircle: PlusCircleIcon,
  refresh: RefreshIcon,
  search: SearchIcon,
  user: UserIcon,
};

const Icon: React.FC<IconProps> = ({
   name,
   className,
   onClick,
   width = 20,
   height = 20,
   color
 }) => {
  const iconSrc = iconMap[name];

  if (!iconSrc) {
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={`${name} icon`}
      className={className}
      onClick={onClick}
      width={width}
      height={height}
      style={{ color, fill: color }}
    />
  );
};

export default Icon;