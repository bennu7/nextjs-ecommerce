"use client";

import StoreModal from "@/components/modals/store-modal";
import React, { useEffect, useState } from "react";

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
