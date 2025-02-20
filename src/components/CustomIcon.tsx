import type { IconifyIcon } from "@iconify/types";

/* -------------------------------------------------------------------------- */
/*                                 CustomIcon                                 */
/* -------------------------------------------------------------------------- */
export interface CustomIconProps {
    icon: IconifyIcon;
    width?: number;
    height?: number;
    className?: string;
    onClick?: (e: React.MouseEvent<SVGSVGElement> | React.KeyboardEvent<SVGSVGElement>) => void;
}
export default function CustomIcon({ icon, width, height, className, onClick }: CustomIconProps) {
    const getViewBoxLength = (length?: number) => {
        if (!length) {
            return "";
        }
        return ` ${length}`;
    };

    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox={`0 0${getViewBoxLength(icon.width)}${getViewBoxLength(icon.height)}`}
            onClick={onClick}
            onKeyUp={onClick}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: cant be avoided for ssr
            dangerouslySetInnerHTML={{ __html: icon.body }}
            suppressHydrationWarning={true}
        />
    );
}

export type { IconifyIcon };
