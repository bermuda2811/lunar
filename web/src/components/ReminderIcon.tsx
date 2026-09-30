import React from 'react';
import { Cake, Plane, Users, Heart, Star, Flame, Sparkles, MoreHorizontal } from 'lucide-react';

interface ReminderIconProps {
  icon: string;
  className?: string;
  size?: number;
}

export const ReminderIcon: React.FC<ReminderIconProps> = ({ icon, className = '', size = 20 }) => {
  switch (icon) {
    case 'cake':
      return <Cake size={size} className={className} />;
    case 'altar':
      // Bát hương / Lư hương cúng giỗ
      return <Flame size={size} className={className} />;
    case 'lotus':
      // Hoa sen / Đèn lồng Trung Thu
      return <Sparkles size={size} className={className} />;
    case 'plane':
      return <Plane size={size} className={className} />;
    case 'family':
      return <Users size={size} className={className} />;
    case 'heart':
      return <Heart size={size} className={className} />;
    case 'star':
      return <Star size={size} className={className} />;
    case 'more':
    default:
      return <MoreHorizontal size={size} className={className} />;
  }
};
