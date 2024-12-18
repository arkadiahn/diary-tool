"use client";

import { cn } from "@nextui-org/react";
import React, { useState, useEffect } from "react";

interface FooterProps {
    className?: string;
}
export default function Footer({ className }: FooterProps) {
    const [displayText, setDisplayText] = useState("‎");
    const fullText = "CODE";

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                if (currentIndex !== 0) {
                    setDisplayText(fullText.slice(0, currentIndex));
                }
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer
            className={cn("flex h-10 items-center justify-center", className)}
        >
            <p className="text-lg font-bold uppercase">
                Learn How To
                <span className="px-2">·</span>
                <span className="text-sky-500 animate-wiggle inline-block">
                    Play
                </span>
                <span className="px-2">·</span>
                <span className="text-teal-500 font-mono relative inline-flex items-start">
                    <span
                        className="inline-block overflow-hidden whitespace-nowrap"
                        style={{ width: `${fullText.length}ch` }}
                    >
                        <span>{displayText}</span>
                        <span className="absolute top-1/2 -translate-y-1/2 h-2/3 w-[2px] bg-slate-500 animate-cursor" />
                    </span>
                </span>
                <span className="px-2">·</span>
                <span className="text-orange-500 animate-flip inline-block">
                    Change
                </span>
            </p>
        </footer>
    );
}
