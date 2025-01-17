interface MainPageLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
}
export default function MainPageLayout({ children, title, description }: MainPageLayoutProps) {
	return (
		<div className="flex-1 flex flex-col items-center overflow-y-auto h-full w-full">
			<div className="p-4 w-full flex flex-col items-center shrink-0">
				<div className="w-full max-w-7xl flex flex-col">
					<h1 className="text-3xl font-bold text-default-900 lg:text-5xl">{title}</h1>
					<p className="text-medium text-default-400 lg:text-lg">{description}</p>
				</div>
			</div>
			{children}
		</div>
	)
}
