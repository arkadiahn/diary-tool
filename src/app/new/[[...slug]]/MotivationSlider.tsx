"use client";

import { Slider } from "@heroui/react";
import { useState } from "react";


const MOOD_EMOJIS = {
	1: "😭",
	2: "😢",
	3: "😞",
	4: "😕",
	5: "😐",
	6: "🙂",
	7: "😊",
	8: "😄",
	9: "🤩",
	10: "🤯",
} as const;

export default function MotivationSlider({ motivation }: { motivation?: number }) {
	const [motivationValue, setMotivationValue] = useState(motivation || 5);

    return (<>
		<input type="hidden" name="motivation" value={motivation} />
		<Slider
			label="Motivation"
			step={1}
			maxValue={10}
			minValue={1}
			size="md"
			color="success"
			value={motivationValue}
			onChange={(value) => setMotivationValue(value as number)}
			className="flex-1"
			showSteps={true}
			aria-label="Motivation level"
			renderThumb={(props) => (
				<div
					{...props}
					className="group p-2 top-1/2 bg-transparent cursor-grab data-[dragging=true]:cursor-grabbing"
				>
					<span
						className={`flex items-center justify-center w-8 h-8 ${motivation === 10 ? "text-6xl" : "text-4xl"}`}
						role="img"
						aria-label="mood"
					>
						{MOOD_EMOJIS[motivation as keyof typeof MOOD_EMOJIS]}
					</span>
				</div>
			)}
		/>
    </>);
}
