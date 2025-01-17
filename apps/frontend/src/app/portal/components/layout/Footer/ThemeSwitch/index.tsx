"use client";

import type { RadioGroupProps } from "@nextui-org/react";
import { cn, RadioGroup } from "@nextui-org/react";
import { ThemeRadioItem } from "./RadioItem";
import { useTheme } from "next-themes";
import React from "react";

/* ---------------------------------- Icons --------------------------------- */
import monitorLinear from "@iconify/icons-solar/monitor-linear";
import moonLinear from "@iconify/icons-solar/moon-linear";
import sunLinear from "@iconify/icons-solar/sun-2-linear";

/* -------------------------------------------------------------------------- */
/*                              CustomRadioGroup                              */
/* -------------------------------------------------------------------------- */
interface CustomRadioGroupProps extends Omit<RadioGroupProps, "children"> {
    ref: React.ForwardedRef<HTMLDivElement>;
    setTheme?: (theme: string) => void;
    theme?: string;
}
const CustomRadioGroup = ({
    theme,
    setTheme,
    classNames,
    ref,
    ...props
}: CustomRadioGroupProps) => {
    return (
        <RadioGroup
            as="div"
            ref={ref}
            key={theme}
            aria-label="Select a theme"
            classNames={{
                ...classNames,
                wrapper: cn("gap-1 items-center", classNames?.wrapper),
            }}
            value={theme ?? "system"}
            orientation="horizontal"
            onValueChange={setTheme}
            {...props}
        >
            <ThemeRadioItem icon={moonLinear} value="dark" />
            <ThemeRadioItem icon={sunLinear} value="light" />
            <ThemeRadioItem icon={monitorLinear} value="system" />
        </RadioGroup>
    );
};

/* -------------------------------------------------------------------------- */
/*                                 ThemeSwitch                                */
/* -------------------------------------------------------------------------- */
const ThemeSwitchComponent = React.forwardRef<
    HTMLDivElement,
    Omit<RadioGroupProps, "children">
>(({ classNames = {}, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <CustomRadioGroup
                theme={""}
                classNames={classNames}
                ref={ref}
                {...props}
            />
        );

    return (
        <CustomRadioGroup
            theme={theme}
            setTheme={setTheme}
            classNames={classNames}
            ref={ref}
            {...props}
        />
    );
});
ThemeSwitchComponent.displayName = "ThemeSwitch";

export default ThemeSwitchComponent;
