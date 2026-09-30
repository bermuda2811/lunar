import React from 'react';
import { Cake, Plane, Users, Heart, Star, Flame, Sparkles, Ellipsis } from 'lucide-react-native';

interface ReminderIconProps {
  icon: string;
  size?: number;
  color?: string;
}

export const ReminderIcon: React.FC<ReminderIconProps> = ({ icon, size = 20, color = '#B3261E' }) => {
  switch (icon) {
    case 'cake':
      return <Cake size={size} color={color} />;
    case 'altar':
      // Bát hương / Lư hương cúng giỗ
      return <Flame size={size} color={color} />;
    case 'lotus':
      // Hoa sen / Đèn lồng Trung Thu
      return <Sparkles size={size} color={color} />;
    case 'plane':
      return <Plane size={size} color={color} />;
    case 'family':
      return <Users size={size} color={color} />;
    case 'heart':
      return <Heart size={size} color={color} />;
    case 'star':
      return <Star size={size} color={color} />;
    case 'more':
    default:
      return <Ellipsis size={size} color={color} />;
  }
};
