"use client";

import React, { useRef } from "react";

const AboutPage = () => {
  const number = useRef(1);
  const add = () => {
    number.current = number.current + 1;
    console.log(number.current);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>{number.current}</div>
      <button onClick={add}>add</button>
    </div>
  );
};

export default AboutPage;
