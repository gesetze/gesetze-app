import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RowVirtualizerDynamic } from "./row-virtualizer";
import { SearchBar } from "./search-bar";
import {
	formatQuery,
	parseSearchQuery,
	SearchQuery,
} from "./search-query-parser";
import { useDebounce } from "usehooks-ts";
import { Norm } from "./modals";

function getData(gesetzIndex: string) {
	return fetch(`data/${gesetzIndex}.json`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	}).then((response) => response.json());
}

export function GesetzView() {
	const [tempQuery, setTempQuery] = useState("");
	const [queryObj, setQueryObj] = useState<SearchQuery | null>();
	const [topNormIdDisplayed, setTopNormIdDisplayed] = useState<string>("");
	const topNormIdDisplayedDebounced = useDebounce<string>(
		topNormIdDisplayed,
		500
	);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const newQueryObj = parseSearchQuery(searchParams.get("q") || "");
		console.log(newQueryObj);
		if (newQueryObj) {
			// set gesetzId if not set
			newQueryObj.gesetzId = newQueryObj.gesetzId || queryObj?.gesetzId;
			setQueryObj(newQueryObj);
			const formattedQuery = formatQuery(newQueryObj);
			setTempQuery(formattedQuery);
			setSearchParams({ q: formattedQuery });
		}
	}, [searchParams]);

	useEffect(() => {
		if (queryObj && topNormIdDisplayedDebounced) {
			const tempQueryObj = { ...queryObj, normId: topNormIdDisplayedDebounced };
			console.log(queryObj, tempQueryObj, formatQuery(tempQueryObj));
			setTempQuery(formatQuery(tempQueryObj));
		}
	}, [topNormIdDisplayedDebounced]);

	return (
		<div>
			<SearchBar
				onQueryChange={setTempQuery}
				searchQuery={tempQuery}
				onExecuteQuery={() => setSearchParams({ q: tempQuery })}
			/>
			<Gesetz
				normIndex={queryObj?.normId || ""}
				gesetzIndex={queryObj?.gesetzId || ""}
				onTopNormIdChange={setTopNormIdDisplayed}
			/>
		</div>
	);
}

export const Gesetz = ({
	normIndex,
	gesetzIndex,
	onTopNormIdChange,
}: {
	normIndex: string;
	gesetzIndex: string;
	onTopNormIdChange: (normId: string) => any;
}) => {
	const [data, setData] = useState<Norm[]>([]);
	useEffect(() => {
		if (gesetzIndex) {
			getData(gesetzIndex.toLowerCase()).then((d) => setData(d));
		} else {
			setData([]);
		}
	}, [gesetzIndex]);

	if (data) {
		return (
			<RowVirtualizerDynamic
				rows={data}
				normIndex={normIndex}
				onTopIndexChange={(idx) => onTopNormIdChange(data[idx]?.index)}
			/>
		);
	} else {
		return (
			<div style={{ margin: "2em" }}>
				<Skeleton />
				<Skeleton />
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</div>
		);
	}
};
