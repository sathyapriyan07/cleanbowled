import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`glass-card glow-hover rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}
