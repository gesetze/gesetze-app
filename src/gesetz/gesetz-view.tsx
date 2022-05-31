import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RowVirtualizer } from "./row-virtualizer";
import { SearchBar } from "./search-bar";
import {
	formatQuery,
	parseSearchQuery,
	SearchQuery,
} from "./search-query-parser";
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
	const [inputQuery, setInputQuery] = useState("");
	const [queryObj, setQueryObj] = useState<SearchQuery | null>(null);
	const [topNormIdDisplayed, setTopNormIdDisplayed] = useState<string>("");
	const [searchParams, setSearchParams] = useSearchParams();

	function executeSearch(query: string) {
		const newQueryObj = parseSearchQuery(query);
		if (newQueryObj) {
			// set gesetzId if not set
			newQueryObj.gesetzId = newQueryObj.gesetzId || queryObj?.gesetzId;
			setQueryObj(null);
			setQueryObj(newQueryObj);
			const formattedQuery = formatQuery(newQueryObj);
			setInputQuery(formattedQuery);
			setSearchParams({ q: formattedQuery });
		}
	}

	useEffect(() => {
		executeSearch(searchParams.get("q") || "");
	}, []);

	useEffect(() => {
		if (queryObj) {
			setInputQuery(formatQuery({ ...queryObj, normId: topNormIdDisplayed }));
		}
	}, [topNormIdDisplayed]);

	return (
		<div>
			<SearchBar
				onQueryChange={setInputQuery}
				searchQuery={inputQuery}
				onExecuteQuery={() => executeSearch(inputQuery)}
			/>
			<Gesetz queryObj={queryObj} onTopNormIdChange={setTopNormIdDisplayed} />
		</div>
	);
}

export const Gesetz = ({
	queryObj,
	onTopNormIdChange,
}: {
	queryObj: SearchQuery | null;
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

	// if (data?.length) {
	return (
		<RowVirtualizer
			rows={data}
			normId={queryObj?.normId || ""}
			onTopIndexChange={(idx) => onTopNormIdChange(data[idx]?.index)}
		/>
	);
	// } else {
	// 	return (
	// 		<div style={{ margin: "2em" }}>
	// 			<Skeleton />
	// 			<Skeleton />
	// 			<Skeleton />
	// 			<Skeleton />
	// 			<Skeleton />
	// 		</div>
	// 	);
	// }
};
