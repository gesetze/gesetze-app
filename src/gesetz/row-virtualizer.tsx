import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
	FlatIndexLocationWithAlign,
	Virtuoso,
	VirtuosoHandle,
} from "react-virtuoso";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizerDynamic = ({
	rows,
	normId,
	onTopIndexChange,
}: {
	rows: Norm[];
	normId: string;
	onTopIndexChange: (index: number) => any;
}) => {
	const virtuosoRef: MutableRefObject<VirtuosoHandle | null> = useRef(null);
	const [waitForScrollEnd, setWaitForScrollEnd] = useState<
		boolean | "inProgress"
	>(false);
	const [isScrolling, setIsScrolling] = useState(false);
	const [normIndex, setNormIndex] = useState(-1);

	useEffect(() => {
		setNormIndex(rows.findIndex(({ index }) => index === normId));
	}, [rows, normId]);

	function scrollTo() {
		const scrollWithAlignment: FlatIndexLocationWithAlign = {
			index: normIndex,
			offset: -32,
		};
		setWaitForScrollEnd(true);
		virtuosoRef.current?.scrollToIndex(scrollWithAlignment);
	}

	function customScrollTo() {
		const elem: HTMLElement | null = document.querySelector(
			`[data-item-index="${normIndex}"]`
		);
		if (elem) {
			window.scrollTo({ top: elem.offsetTop - 70 });
		} else {
			scrollTo();
		}
	}

	function updateTopIndex() {
		Array.from(
			document.querySelectorAll<HTMLElement>("[data-item-index]")
		).every((elem) => {
			if (elem.getBoundingClientRect().top + elem.offsetHeight >= 64) {
				onTopIndexChange(Number(elem.getAttribute("data-item-index")));
				return false;
			} else {
				return true;
			}
		});
	}

	useEffect(() => {
		if (rows?.length) {
			if (normIndex !== -1) {
				scrollTo();
			}
		}
	}, [normIndex, rows]);

	useEffect(() => {
		if (waitForScrollEnd === true && isScrolling) {
			setWaitForScrollEnd("inProgress");
		} else if (waitForScrollEnd === "inProgress" && !isScrolling) {
			setWaitForScrollEnd(false);
			setTimeout(customScrollTo, 500);
		}
	}, [isScrolling, waitForScrollEnd]);

	if (!rows?.length) {
		return <></>;
	}

	function handleIsScrollingChange(scrolling: boolean) {
		setIsScrolling(scrolling);
		if (!scrolling) {
			updateTopIndex();
		}
	}

	function handleTotalListHeightChanged(height: number) {
		!isScrolling && waitForScrollEnd && customScrollTo();
		!waitForScrollEnd && updateTopIndex();
	}

	function handleRangeChanged() {
		!waitForScrollEnd && updateTopIndex();
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
				initialTopMostItemIndex={{
					index: normIndex,
					offset: -32,
				}}
				useWindowScroll
				data={rows}
				itemContent={(index, item) => <NormView data={item}></NormView>}
				isScrolling={handleIsScrollingChange}
				totalListHeightChanged={handleTotalListHeightChanged}
				rangeChanged={handleRangeChanged}
				defaultItemHeight={300}
				overscan={5000}
			/>
		</div>
	);
};
