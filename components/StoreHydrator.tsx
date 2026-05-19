"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store";

export default function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
}
