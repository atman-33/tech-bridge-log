import { NavLink } from 'react-router';

export const AppNavLink = ({
  to,
  children,
}: { to: string; children: React.ReactNode; }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) =>
        `flex h-10 items-center font-bold ${isActive
          ? 'border-b-2 border-b-foreground text-foreground'
          : isPending
            ? 'text-primary/80'
            : 'text-primary/50'
        }`
      }
    >
      {children}
    </NavLink>
  );
};