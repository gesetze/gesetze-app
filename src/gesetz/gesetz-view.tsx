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

	function executeSearch(query: string) {
		const newQueryObj = parseSearchQuery(query);
		if (newQueryObj) {
			// set gesetzId if not set
			newQueryObj.gesetzId = newQueryObj.gesetzId || queryObj?.gesetzId;
			setQueryObj(null);
			setQueryObj(newQueryObj);
			const formattedQuery = formatQuery(newQueryObj);
			setTempQuery(formattedQuery);
			setSearchParams({ q: formattedQuery });
		}
	}

	useEffect(() => {
		executeSearch(searchParams.get("q") || "");
	}, []);

	useEffect(() => {
		if (queryObj && topNormIdDisplayedDebounced) {
			const tempQueryObj = { ...queryObj, normId: topNormIdDisplayedDebounced };
			setTempQuery(formatQuery(tempQueryObj));
		}
	}, [topNormIdDisplayedDebounced]);

	return (
		<div>
			<SearchBar
				onQueryChange={setTempQuery}
				searchQuery={tempQuery}
				onExecuteQuery={() => executeSearch(tempQuery)}
			/>
			{queryObj && (
				<Gesetz queryObj={queryObj} onTopNormIdChange={setTopNormIdDisplayed} />
			)}
		</div>
	);
}

export const Gesetz = ({
	queryObj,
	onTopNormIdChange,
}: {
	queryObj: SearchQuery;
	onTopNormIdChange: (normId: string) => any;
}) => {
	const [data, setData] = useState<Norm[]>([]);
	useEffect(() => {
		if (queryObj?.gesetzId) {
			getData(queryObj?.gesetzId.toLowerCase()).then((d) => setData(d));
		} else {
			setData([]);
		}
	}, [queryObj?.gesetzId]);

	if (data) {
		return (
			<RowVirtualizerDynamic
				rows={data}
				normIndex={queryObj?.normId}
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
