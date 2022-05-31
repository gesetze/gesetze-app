import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
	FlatIndexLocationWithAlign,
	Virtuoso,
	VirtuosoHandle,
} from "react-virtuoso";
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

	useEffect(() => {
		setNormIndex(rows.findIndex(({ index }) => index === normId));
	}, [rows, normId]);

	useEffect(() => {
		const elem = document.querySelector<HTMLElement>(`[id=row-${normIndex}]`);
		if (elem) {
			elem.scrollIntoView({ block: "start" });
			window.scrollBy({ top: -64 });
		}
	}, [normIndex]);

	useEffect(() => {
		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				setTimeout(() => {
					Array.from(
						document.querySelectorAll<HTMLElement>("[id^=row-]")
					).every((elem) => {
						if (elem.getBoundingClientRect().top + elem.offsetHeight >= 64) {
							const newTopIndex = Number(
								elem.getAttribute("id")?.replace("row-", "")
							);
							onTopIndexChange(newTopIndex);
							return false;
						} else {
							return true;
						}
					});
					ticking = false;
				}, 500);
			}
		};
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [rows]);

	return (
		<div
			style={{
				width: "100%",
				maxWidth: "47em",
				marginLeft: "auto",
				marginRight: "auto",
			}}
		>
			{rows.map((row, index) => (
				<div className="row" id={`row-${index}`} key={index}>
					<NormView data={row}></NormView>
				</div>
			))}
		</div>
	);
};
