import { MutableRefObject, useEffect, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizerDynamic = ({
	rows,
	normIndex,
}: {
	rows: Norm[];
	normIndex: any;
}) => {
	const virtuosoRef: MutableRefObject<VirtuosoHandle | null> = useRef(null);
	useEffect(() => {
		const match = rows.findIndex(({ index }) => index === normIndex);
		if (match !== -1) {
			virtuosoRef.current?.scrollToIndex({
				index: match,
				offset: -32,
			});
		}
	}, [normIndex, rows]);

	if (!rows?.length) {
		return <></>;
	}

	let startNormIndex = rows.findIndex(({ index }) => index === normIndex);
	if (startNormIndex === -1) {
		startNormIndex = 0;
	}
	return (
		<Virtuoso
			ref={virtuosoRef}
			initialTopMostItemIndex={{
				index: startNormIndex,
				offset: -32,
			}}
			useWindowScroll
			data={rows}
			itemContent={(index, item) => <NormView data={item}></NormView>}
		/>
	);
};
