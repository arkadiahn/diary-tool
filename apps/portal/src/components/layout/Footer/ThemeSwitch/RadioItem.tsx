import {
    useRadio,
    useRadioGroupContext,
    VisuallyHidden,
} from "@nextui-org/react";
import CustomIcon from "@/components/common/CustomIcon";
import { cn } from "@nextui-org/react";

/* ---------------------------------- Types --------------------------------- */
import type { RadioProps } from "@nextui-org/react";
import type { IconifyIcon } from "@iconify/types";
import type React from "react";

/* -------------------------------------------------------------------------- */
/*                               ThemeRadioItem                               */
/* -------------------------------------------------------------------------- */
export const ThemeRadioItem = ({
    icon,
    ...props
}: RadioProps & { icon: IconifyIcon }) => {
    const {
        Component,
        isSelected: isSelfSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useRadio(props);

    const groupContext = useRadioGroupContext();

    const isSelected =
        isSelfSelected || groupContext.groupState.selectedValue === props.value;

    const wrapperProps = getWrapperProps();

    return (
        <Component {...getBaseProps()} data-selected={isSelected}>
            <VisuallyHidden>
                <input
                    {...(getInputProps() as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            </VisuallyHidden>
            <div
                {...(wrapperProps as React.HTMLAttributes<HTMLDivElement>)}
                className={cn(
                    wrapperProps?.className,
                    "pointer-events-none h-8 w-8 rounded-full border-black border-opacity-10 ring-0 transition-transform group-data-[pressed=true]:scale-90",
                    {
                        "bg-default-200 dark:bg-default-100": isSelected,
                    },
                )}
            >
                <CustomIcon
                    width={18}
                    height={18}
                    icon={icon}
                    className="text-default-500"
                />
            </div>
        </Component>
    );
};
