import { Card, CardBody } from "@nextui-org/react";
import TimeStepper from "./timeStepper";

export default function MissionCard() {
    return (
        <Card className="w-[300px]" isPressable disableRipple>
            <CardBody className="space-y-4 flex flex-col items-center justify-center px-8">
                <h2 className="text-2xl font-bold">Mission 1</h2>
                <div className="w-full">
                    <TimeStepper stepsCount={5} currentStep={1} />
                </div>
                <p className="line-clamp-4 max-w-full text-default-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.asdasdasdasdasdjkadksasdfhasfajklsdhfahsdfhaksdfadhsfjadksfhajksdhfjkadhsfadjksfhaksdfhkasd
                </p>
                <h3 className="text-4xl font-bold">60%</h3>
            </CardBody>
        </Card>
    );
}
