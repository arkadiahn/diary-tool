import { cn } from "@heroui/react";

interface MainPageLayoutProps {
    children: React.ReactNode;
    headerItems?: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}
export default function MainPageLayout({ children, title, description, className, headerItems }: MainPageLayoutProps) {
    return (
        <div className={cn("flex-1 flex flex-col items-center overflow-y-auto h-full w-full p-3 px-5", className)}>
			{(title || description) && (
				<div className="p-1 w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
					<div className="w-full flex flex-col">
						{title && <h1 className="text-3xl font-medium text-default-900 lg:text-5xl">{title}</h1>}
						{description && <p className="text-medium text-default-400 lg:text-lg">{description}</p>}
					</div>
					{headerItems && <div className="flex justify-end items-center gap-2 w-full">{headerItems}</div>}
				</div>
			)}
			{children}
        </div>
    );
}
