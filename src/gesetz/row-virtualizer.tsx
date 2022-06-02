import { useEffect, useLayoutEffect, useState } from "react";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizer = ({
	rows,
	normId,
	onTopIndexChange,
}: {
	rows: Norm[];
	normId: string;
	onTopIndexChange: (index: number) => any;
}) => {
	const [normIndex, setNormIndex] = useState(-1);
	const [isRendering, setIsRendering] = useState(false);
	const [renderRangeEnd, setRenderRangeEnd] = useState(0);

	function checkTopIndex() {
		Array.from(document.querySelectorAll<HTMLElement>("[id^=row-]")).every(
			(elem) => {
				if (elem.getBoundingClientRect().top + elem.offsetHeight >= 64) {
					const newTopIndex = Number(
						elem.getAttribute("id")?.replace("row-", "")
					);
					onTopIndexChange(newTopIndex);
					return false;
				} else {
					return true;
				}
			}
		);
	}

	useEffect(() => {
		setNormIndex(rows.findIndex(({ index }) => index === normId));
		setRenderRangeEnd(normIndex + 30);
	}, [rows, normId]);

	// Scroll
	useEffect(() => {
		if (rows?.length && normIndex !== -1)
			setTimeout(() => {
				const elem = document.querySelector<HTMLElement>(
					`[id=row-${normIndex}]`
				);
				if (elem) {
					setIsRendering(true);
					elem.scrollIntoView({ block: "start" });
					window.scrollBy({ top: -64 });
					setIsRendering(false);
				}
				checkTopIndex();
			});
	}, [rows, normIndex]);

	// Update onTopIndexChange when scrolling
	useEffect(() => {
		let ticking = false;
		const onScroll = () => {
			if (!ticking && !isRendering) {
				ticking = true;
				setTimeout(() => {
					checkTopIndex();
					ticking = false;
				}, 500);
			}
		};
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [rows]);

	useLayoutEffect(() => {
		setRenderRangeEnd(normIndex + 30);
	}, [rows, normIndex]);

	const renderedRows = rows.slice(0, renderRangeEnd);

	return (
		<div
			style={{
				width: "100%",
				maxWidth: "47em",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			{renderedRows.map((row, index) => (
				<div className="row" id={`row-${index}`} key={index}>
					<NormView data={row}></NormView>
				</div>
			))}
		</div>
	);
};
