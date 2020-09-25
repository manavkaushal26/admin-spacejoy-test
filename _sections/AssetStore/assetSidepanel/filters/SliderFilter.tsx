import { MarginCorrectedSlider, StyledInput } from "@sections/AssetStore/styled";
import { CustomDiv } from "@sections/Dashboard/styled";
import React from "react";

interface SliderFilter {
	min: number;
	max: number;
	range: [number, number];
	onChange: (array: [number, number]) => void;
	onAfterChange: (array: [number, number]) => void;
	value: [number, number];
	onValueEntry: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

export default function SliderFilter({ min, max, range, onChange, onAfterChange, value, onValueEntry }: SliderFilter) {
	const [minVal, maxVal] = range;
	return (
		<>
			<CustomDiv flexBasis='5ch'>
				<StyledInput
					error={min > max}
					value={min}
					min={minVal}
					max={maxVal}
					type='number'
					onChange={e => onValueEntry(e, "min")}
				/>
			</CustomDiv>
			<CustomDiv flexGrow={999}>
				<MarginCorrectedSlider range max={maxVal} value={value} onChange={onChange} onAfterChange={onAfterChange} />
			</CustomDiv>
			<CustomDiv flexBasis='5ch'>
				<StyledInput
					error={min > max}
					value={max}
					min={minVal}
					max={maxVal}
					type='number'
					onChange={e => onValueEntry(e, "max")}
				/>
			</CustomDiv>
		</>
	);
}
