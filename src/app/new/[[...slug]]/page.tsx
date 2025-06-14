import { auth } from "@/auth";
import prisma from "@/prisma";
import { Button, Input, Textarea } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { notFound, redirect } from "next/navigation";
import GoalsSection from "./GoalsSection";
import MotivationSlider from "./MotivationSlider";
import ProjectSelect from "./ProjectSelect";
import { handleSubmit } from "./actions";

export default async function NewDiaryPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const session = await auth();
    if (!session) {
        // @todo do this better/somewhere else
        redirect("/");
    }
    const slug = (await params).slug;
    if (slug && slug.length > 1) {
        return notFound();
    }
    const entry = slug
        ? await prisma.diary.findUnique({
              include: {
                  goals: true,
              },
              where: {
                  id: slug[0],
              },
          })
        : null;
    if (entry && entry.accountId !== session?.user.sub) {
        return notFound();
    }

    const handleSubmitWithEntry = handleSubmit.bind(null, entry);

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardBody className="px-8 py-6">
                    <h2 className="text-2xl font-medium mb-6">{entry ? "Edit Entry" : "New Entry"}</h2>
                    <form action={handleSubmitWithEntry}>
                        <div className="grid grid-cols-1 gap-6">
                            <ProjectSelect project={entry?.project} />

                            <Input
                                name="weeks"
                                type="number"
                                defaultValue={entry?.completionWeeks.toString()}
                                label="Expected weeks until completion"
                                min={1}
                                isRequired={true}
                            />

                            <MotivationSlider motivation={entry?.motivation} />

                            <Textarea
                                name="learnings"
                                defaultValue={entry?.learnings}
                                label="Biggest learnings last week"
                                isRequired={true}
                                maxLength={6000}
                                minRows={4}
                            />

                            <Textarea
                                name="obstacles"
                                defaultValue={entry?.obstacles}
                                label="Biggest obstacles last week"
                                isRequired={true}
                                maxLength={6000}
                                minRows={4}
                            />

                            <GoalsSection goals={entry?.goals} />

                            <Button type="submit" color="success" fullWidth={true}>
                                {entry ? "Update Entry" : "Create Entry"}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
