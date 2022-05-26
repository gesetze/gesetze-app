import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizerDynamic = ({
	rows,
	normIndex,
	onTopIndexChange,
}: {
	rows: Norm[];
	normIndex: any;
	onTopIndexChange: (index: number) => any;
}) => {
	const virtuosoRef: MutableRefObject<VirtuosoHandle | null> = useRef(null);

	useEffect(() => {
		const match = rows.findIndex(({ index }) => index === normIndex);
		if (match !== -1) {
			virtuosoRef.current?.scrollToIndex(match);
		}
	}, [normIndex, rows]);

	if (!rows?.length) {
		return <></>;
	}

	let startNormIndex = rows.findIndex(({ index }) => index === normIndex);
	if (startNormIndex === -1) {
		startNormIndex = 0;
	}

	function handleRangeChange(range: { startIndex: number; endIndex: number }) {
		if (range.startIndex + 1 <= range.endIndex) {
			onTopIndexChange(range.startIndex + 1);
		} else {
			onTopIndexChange(range.startIndex);
		}
	}

	function handleIsScrollingChange(isScrolling: boolean) {
		console.log(isScrolling);
	}

	function handleTotalListHeightChanged(height: number) {
		console.log("height", height);
	}

	return (
		<div
			style={{
				width: "100%",
				maxWidth: "47em",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			<Virtuoso
				ref={virtuosoRef}
				initialTopMostItemIndex={startNormIndex}
				useWindowScroll
				data={rows}
				itemContent={(index, item) => <NormView data={item}></NormView>}
				increaseViewportBy={60}
				rangeChanged={handleRangeChange}
				isScrolling={handleIsScrollingChange}
				totalListHeightChanged={handleTotalListHeightChanged}
			/>
		</div>
	);
};
