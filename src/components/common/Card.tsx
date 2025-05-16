// src/components/common/Card.tsx
import React from "react";

type CardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, title, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
