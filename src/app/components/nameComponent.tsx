"use client";

import { useI18n } from "@/locales/client";
import { Input } from "@nextui-org/react";
import { useQueryState } from "nuqs";

export default function NameComponent() {
    const [name, setName] = useQueryState("name", {
        defaultValue: "",
    });
    const t = useI18n();

    return (
        <>
            <h1 className="text-4xl font-bold">
                {t("welcome", { name: name })}
            </h1>
            <Input
                placeholder="Enter your name"
                variant="bordered"
                className="max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </>
    );
}
