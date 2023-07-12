import React from "react";

interface HeadingProps {
  title: string;
  description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="">
      <div className="text-3xl font-bold tracking-tight">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};

export { Heading };
