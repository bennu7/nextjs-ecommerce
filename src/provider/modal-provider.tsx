"use client";

import React, { useEffect, useState } from "react";

import StoreModal from "@/components/modals/store-modal";

const ModalProvider = () => {
  // ? untuk menghindari error saat rendering di server
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProvider;
