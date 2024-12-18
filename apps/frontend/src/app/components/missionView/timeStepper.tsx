"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { type ButtonProps, cn } from "@nextui-org/react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import React from "react";

export interface MinimalRowStepsProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The label of the steps.
     */
    label?: string;
    /**
     * Length of the steps.
     *
     * @default 3
     */
    stepsCount?: number;
    /**
     * The color of the steps.
     *
     * @default "primary"
     */
    color?: ButtonProps["color"];
    /**
     * The current step index.
     */
    currentStep: number;
    /**
     * Whether to hide the progress bars.
     *
     * @default false
     */
    hideProgressBars?: boolean;
    /**
     * The custom class for the steps wrapper.
     */
    className?: string;
    /**
     * The custom class for the step.
     */
    stepClassName?: string;
}

const TimeStepper = React.forwardRef<HTMLDivElement, MinimalRowStepsProps>(
    (
        {
            color = "primary",
            stepsCount = 3,
            label,
            currentStep,
            hideProgressBars = false,
            stepClassName,
            className,
            ...props
        },
        ref,
    ) => {
        const colors = React.useMemo(() => {
            let userColor: string;
            let fgColor: string;

            const colorsVars = [
                "[--active-fg-color:hsl(var(--step-fg-color))]",
                "[--active-border-color:hsl(var(--step-color))]",
                "[--active-color:hsl(var(--step-color))]",
                "[--complete-background-color:hsl(var(--step-color))]",
                "[--complete-border-color:hsl(var(--step-color))]",
                "[--inactive-border-color:hsl(var(--nextui-default-300))]",
                "[--inactive-color:hsl(var(--nextui-default-300))]",
            ];

            switch (color) {
                case "primary":
                    userColor = "[--step-color:var(--nextui-primary)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-primary-foreground)]";
                    break;
                case "secondary":
                    userColor = "[--step-color:var(--nextui-secondary)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-secondary-foreground)]";
                    break;
                case "success":
                    userColor = "[--step-color:var(--nextui-success)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-success-foreground)]";
                    break;
                case "warning":
                    userColor = "[--step-color:var(--nextui-warning)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-warning-foreground)]";
                    break;
                case "danger":
                    userColor = "[--step-color:var(--nextui-error)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-error-foreground)]";
                    break;
                case "default":
                    userColor = "[--step-color:var(--nextui-default)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-default-foreground)]";
                    break;
                default:
                    userColor = "[--step-color:var(--nextui-primary)]";
                    fgColor =
                        "[--step-fg-color:var(--nextui-primary-foreground)]";
                    break;
            }

            colorsVars.unshift(fgColor);
            colorsVars.unshift(userColor);

            return colorsVars;
        }, [color]);

        return (
            <nav
                aria-label="Progress"
                className="flex w-full items-center"
                ref={ref}
            >
                {label && (
                    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
                    <label className="w-28 text-small font-medium text-default-foreground lg:text-medium">
                        {label}
                    </label>
                )}
                <ol
                    className={cn(
                        "flex w-full items-center",
                        colors,
                        className,
                    )}
                >
                    {Array.from({ length: stepsCount })?.map((_, stepIdx) => {
                        const status =
                            currentStep === stepIdx
                                ? "active"
                                : currentStep < stepIdx
                                  ? "inactive"
                                  : "complete";

                        return (
                            <li
                                // biome-ignore lint/suspicious/noArrayIndexKey: idk
                                key={stepIdx}
                                className={cn(
                                    "relative flex items-center",
                                    stepIdx !== stepsCount - 1 ? "flex-1" : "",
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex items-center",
                                        stepClassName,
                                    )}
                                    {...props}
                                >
                                    {/* Circle */}
                                    <div className="relative">
                                        <LazyMotion features={domAnimation}>
                                            <m.div
                                                animate={status}
                                                className="relative"
                                            >
                                                <m.div
                                                    className={cn(
                                                        "relative flex h-[26px] w-[26px] items-center justify-center rounded-full border-medium text-large font-semibold text-default-foreground",
                                                        {
                                                            "shadow-lg":
                                                                status ===
                                                                "complete",
                                                        },
                                                    )}
                                                    initial={false}
                                                    transition={{
                                                        duration: 0.25,
                                                    }}
                                                    variants={{
                                                        inactive: {
                                                            backgroundColor:
                                                                "transparent",
                                                            borderColor:
                                                                "var(--inactive-border-color)",
                                                            color: "var(--inactive-color)",
                                                        },
                                                        active: {
                                                            backgroundColor:
                                                                "transparent",
                                                            borderColor:
                                                                "var(--active-border-color)",
                                                            color: "var(--active-color)",
                                                        },
                                                        complete: {
                                                            backgroundColor:
                                                                "var(--complete-background-color)",
                                                            borderColor:
                                                                "var(--complete-border-color)",
                                                        },
                                                    }}
                                                >
                                                    <div className="flex items-center justify-center">
                                                        {status ===
                                                        "complete" ? (
                                                            <Icon
                                                                icon="solar:clock-circle-linear"
                                                                className="h-5 w-5 text-[var(--active-fg-color)]"
                                                            />
                                                        ) : (
                                                            <span />
                                                        )}
                                                    </div>
                                                </m.div>
                                            </m.div>
                                        </LazyMotion>
                                    </div>
                                </div>

                                {/* Progress Bar - moved outside the circle div */}
                                {stepIdx < stepsCount - 1 &&
                                    !hideProgressBars && (
                                        <div
                                            aria-hidden="true"
                                            className="flex-1"
                                        >
                                            <div
                                                className={cn(
                                                    "h-0.5 w-full bg-default-200 transition-colors duration-300",
                                                    "relative after:absolute after:left-0 after:top-0 after:block after:h-full after:w-0 after:bg-[var(--active-border-color)] after:transition-[width] after:duration-300 after:content-['']",
                                                    {
                                                        "after:w-full":
                                                            stepIdx <
                                                            currentStep,
                                                    },
                                                )}
                                            />
                                        </div>
                                    )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        );
    },
);

TimeStepper.displayName = "TimeStepper";

export default TimeStepper;
