"use client";
import React from "react";
import { Keyboard } from "@/components/ui/keyboard";
import { PROJECTS } from "@/app/data/keyboard-search-data";
import { useKeyboardSearch }  from "@/hooks/useKeyboardSearch"
import DesktopKeyboardExplorer from "./keyboard-search/DesktopKeyboardExplorer"
import MobileSearchExplorer from "./keyboard-search/MobileSearchExplorer";

export default function KeyBoardSearchSection() {
  return (
    <div className="flex min-h-96 w-full items-center justify-center py-10 md:min-h-180">
      <Keyboard enableSound showPreview />
    </div>
  );
}
