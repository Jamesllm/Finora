/**
 * CategoryIcon Component
 * Renderiza iconos de categoría usando lucide-react
 */

import {
    ShoppingCart, Utensils, Home, Lightbulb, Car, Bus, Heart, Pill, Shirt, Gift,
    GraduationCap, Book, Gamepad2, Plane, Dog, Wrench, Calendar, Package,
    Pizza, Coffee, Film, Dumbbell, Briefcase, Music, Smartphone, Monitor,
    Trophy, Palette, Wallet, DollarSign, Building2, Gem, TrendingUp, BarChart3,
    Handshake, Star, Target, HelpCircle
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, LucideIcon> = {
    ShoppingCart,
    Utensils,
    Home,
    Lightbulb,
    Car,
    Bus,
    Heart,
    Pill,
    Shirt,
    Gift,
    GraduationCap,
    Book,
    Gamepad2,
    Plane,
    Dog,
    Wrench,
    Calendar,
    Package,
    Pizza,
    Coffee,
    Film,
    Dumbbell,
    Briefcase,
    Music,
    Smartphone,
    Monitor,
    Trophy,
    Palette,
    Wallet,
    DollarSign,
    Building2,
    Gem,
    TrendingUp,
    BarChart3,
    Handshake,
    Star,
    Target,
};

interface CategoryIconProps {
    iconName?: string;
    className?: string;
    color?: string;
    size?: number;
}

export function CategoryIcon({ iconName, className = '', color, size }: CategoryIconProps) {
    const Icon = iconName && iconMap[iconName] ? iconMap[iconName] : HelpCircle;

    const style = color ? { color } : undefined;
    const sizeClass = size ? `w-${size} h-${size}` : 'w-6 h-6';

    return <Icon className={`${sizeClass} ${className}`} style={style} />;
}

export function getIconComponent(iconName?: string): LucideIcon {
    return iconName && iconMap[iconName] ? iconMap[iconName] : HelpCircle;
}

export const ICON_LIST = [
    // Gastos
    { icon: ShoppingCart, name: 'ShoppingCart' },
    { icon: Utensils, name: 'Utensils' },
    { icon: Home, name: 'Home' },
    { icon: Lightbulb, name: 'Lightbulb' },
    { icon: Car, name: 'Car' },
    { icon: Bus, name: 'Bus' },
    { icon: Heart, name: 'Heart' },
    { icon: Pill, name: 'Pill' },
    { icon: Shirt, name: 'Shirt' },
    { icon: Gift, name: 'Gift' },
    { icon: GraduationCap, name: 'GraduationCap' },
    { icon: Book, name: 'Book' },
    { icon: Gamepad2, name: 'Gamepad2' },
    { icon: Plane, name: 'Plane' },
    { icon: Dog, name: 'Dog' },
    { icon: Wrench, name: 'Wrench' },
    { icon: Calendar, name: 'Calendar' },
    { icon: Package, name: 'Package' },
    { icon: Pizza, name: 'Pizza' },
    { icon: Coffee, name: 'Coffee' },
    { icon: Film, name: 'Film' },
    { icon: Dumbbell, name: 'Dumbbell' },
    { icon: Briefcase, name: 'Briefcase' },
    { icon: Music, name: 'Music' },
    { icon: Smartphone, name: 'Smartphone' },
    { icon: Monitor, name: 'Monitor' },
    { icon: Trophy, name: 'Trophy' },
    { icon: Palette, name: 'Palette' },
    // Ingresos
    { icon: Wallet, name: 'Wallet' },
    { icon: DollarSign, name: 'DollarSign' },
    { icon: Building2, name: 'Building2' },
    { icon: Gem, name: 'Gem' },
    { icon: TrendingUp, name: 'TrendingUp' },
    { icon: BarChart3, name: 'BarChart3' },
    { icon: Handshake, name: 'Handshake' },
    { icon: Star, name: 'Star' },
    { icon: Target, name: 'Target' }
];
