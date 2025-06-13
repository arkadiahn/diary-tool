"use client";

import type { DiaryGoal } from "@/generated/prisma";
import { Button, Input } from "@heroui/react";
import { useState } from "react";

export default function GoalsSection({ goals }: { goals?: DiaryGoal[] }) {
	const [goalsIds, setGoalsIds] = useState<string[]>(goals?.map((goal) => goal.id) || []);
	const [error, setError] = useState<string | null>(null);

    return (
        <div className="space-y-4">
			<input
				name="goals"
				defaultValue={goalsIds.join(",")}
				minLength={2}
				required={true}
				onInvalid={(e) => {
					e.preventDefault();
					setError("A minimum of 1 goal is required");
				}}
				className="hidden"
			/>
			<div>
				<div className="flex items-center justify-between gap-2">
					<span className="block text-sm font-medium">Your goals for next week<span className="text-red-500">*</span></span>
					<p className="text-sm text-blue-500 cursor-pointer"
						onClick={() => {
							setGoalsIds([...goalsIds, Math.random().toString(36).substring(2)])
							setError(null);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setGoalsIds([...goalsIds, Math.random().toString(36).substring(2)])
								setError(null);
							}
						}}
					>
						Add a goal to your diary
					</p>
				</div>
				<p className="text-xs text-red-500">{error}</p>
			</div>
			{goalsIds.map((goalId) => (
				<div key={`${goalId}`} className="flex items-center gap-2">
					<Input
						type="text"
						name={`goal.${goalId}`}
						defaultValue={goals?.find((goal) => goal.id === goalId)?.title}
						placeholder="Enter a goal"
						label="Goal"
						isRequired={true}
						maxLength={255}
						minLength={3}
					/>
					<Button
						color="danger"
						onPress={() => {
							const newGoalsIds = goalsIds.filter((id) => id !== goalId);
							setGoalsIds(newGoalsIds);
						}}
					>
						Remove
					</Button>
				</div>
			))}
		</div>
    );
}