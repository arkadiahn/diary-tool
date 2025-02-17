import { getEvent } from "@/api/missionboard";
import CustomIcon from "@/components/CustomIcon";
import { Image } from "@heroui/image";
import { Button, Chip, Divider } from "@heroui/react";
import calendarMonth from "@iconify/icons-ic/outline-calendar-month";
import locationOn from "@iconify/icons-ic/outline-location-on";
import openInNew from "@iconify/icons-ic/outline-open-in-new";
import { default as NextImage } from "next/image";
import MainPageLayout from "../../src/components/MainPageLayout";
import PageBreadcrumbs from "./PageBreadcrumbs";
import ShareButton from "./ShareButton";
import { remark } from "remark";
import html from "remark-html";

export default async function CalendarEventPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const { data: event } = await getEvent(name);

	// @todo make the parsed html render correctly (css)
	const processedContent = await remark().use(html).process(event.description);
	const descriptionHtml = processedContent.toString();

    return (
        <MainPageLayout>
            <div className="min-h-full w-full max-w-7xl flex flex-col gap-4">
                <PageBreadcrumbs title={event.title} />
                <Image
                    isBlurred={true}
                    as={NextImage}
                    src={event.picture_uri}
                    width={1920}
                    height={1080}
                    alt={event.title}
                    className="w-full !h-[250px] md:!h-[380px] object-cover rounded-large"
                    classNames={{
                        wrapper: "w-full !max-w-full",
                        blurredImg: "!scale-[100%] !h-[270px] md:!h-[400px]",
                    }}
                />

                <div className="space-y-2">
                    <div className="flex flex-row items-center justify-between gap-2">
                        <h2 className="text-2xl md:text-3xl font-bold">{event.title}</h2>

                        <Chip size="sm" color="primary">
                            {event.topic}
                        </Chip>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <CustomIcon icon={calendarMonth} width={20} height={20} />
                            <span>
                                {new Date(event.begin_time).toLocaleString()} -{" "}
                                {new Date(event.end_time).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <CustomIcon icon={locationOn} width={20} height={20} />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <Divider />
                </div>

				<div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />

                <div className="flex flex-row gap-2 mt-auto">
                    {event.link && (
                        <Button
                            color="primary"
                            endContent={<CustomIcon icon={openInNew} width={16} height={16} />}
                            as="a"
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Event Website
                        </Button>
                    )}

                    <ShareButton event={event} />
                </div>
            </div>
        </MainPageLayout>
    );
}
