// src/components/Icons.tsx
interface IconProps {
  className?: string;
}

export const HomeIcon = ({ className = "w-4 h-4" }: IconProps) => 
  <div className={className + " bg-blue-500 rounded"}></div>;

export const UserIcon = ({ className = "w-4 h-4" }: IconProps) => 
  <div className={className + " bg-green-500 rounded-full"}></div>;

export const UsersIcon = ({ className = "w-4 h-4" }: IconProps) => 
  <div className={className + " bg-purple-500 rounded"}></div>;

export const WalletIcon = ({ className = "w-4 h-4" }: IconProps) => 
  <div className={className + " bg-orange-500 rounded"}></div>;

export const XIcon = ({ className = "w-4 h-4" }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
