import { debounce } from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useVirtual } from "react-virtual";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizerDynamic = ({
	rows,
	normIndex,
}: {
	rows: Norm[];
	normIndex: any;
}) => {
	const parentRef = React.useRef(null);
	const windowRef = React.useRef(window);

	const rowVirtualizer = useVirtual({
		size: rows.length,
		parentRef,
		windowRef,
	});

	useEffect(() => {
		const match = rows.findIndex(({ index }) => index === normIndex);
		if (match !== -1) {
			rowVirtualizer.scrollToIndex(match, { align: "start" });
			requestAnimationFrame(() => {
				rowVirtualizer.scrollToIndex(match, { align: "start" });
				requestAnimationFrame(() => setTimeout(() => window.scrollBy(0, -64)));
			});
		}
	}, [normIndex, rows]);

	const [width, setWidth] = useState(0);
	useLayoutEffect(() => {
		const debouncedHandleResize = debounce(function handleResize() {
			setWidth(window.innerWidth);
			rowVirtualizer.measure();
		}, 250);

		window.addEventListener("resize", debouncedHandleResize);

		return () => {
			window.removeEventListener("resize", debouncedHandleResize);
		};
	}, []);

	return (
		<>
			<div
				ref={parentRef}
				className="List"
				style={{
					width: `100%`,
					overflowX: "hidden",
				}}
			>
				<div
					style={{
						height: rowVirtualizer.totalSize,
						width: "100%",
						position: "relative",
					}}
				>
					{rowVirtualizer.virtualItems.map((virtualRow) => (
						<div
							key={virtualRow.index}
							ref={virtualRow.measureRef}
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								width: "100%",
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<NormView data={rows[virtualRow.index]}></NormView>
						</div>
					))}
				</div>
			</div>
		</>
	);
};
