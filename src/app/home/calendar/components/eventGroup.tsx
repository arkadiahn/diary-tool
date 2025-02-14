import { Divider } from "@heroui/react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface EventGroupProps {
    date: string;
    children: React.ReactNode[];
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
export default function EventGroup({ date, children }: EventGroupProps) {
    return (
        <div key={date} className="col-span-full">
            <div className="w-full flex items-center gap-4 my-6">
                <Divider className="flex-1" />
                <time className="text-default-500 text-md font-medium whitespace-nowrap">{date}</time>
                <Divider className="flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
        </div>
    );
}
