import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RowVirtualizerDynamic } from "./row-virtualizer";
import { SearchBar } from "./search-bar";
import { formatQuery, parseSearchQuery } from "./search-query-parser";

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
	const [normIndex, setNormIndex] = useState("");
	const [gesetzId, setGesetzId] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const queryObj = parseSearchQuery(searchParams.get("q") || "");
		console.log(queryObj);
		if (queryObj) {
			// set gesetzId if not set
			queryObj.gesetzId = queryObj.gesetzId || gesetzId;
			setNormIndex(queryObj.normId || "");
			setGesetzId(queryObj.gesetzId);
			const formattedQuery = formatQuery(queryObj);
			setTempQuery(formattedQuery);
			setSearchParams({ q: formattedQuery });
		}
	}, [searchParams]);

	return (
		<div>
			<SearchBar
				onQueryChange={setTempQuery}
				searchQuery={tempQuery}
				onExecuteQuery={() => setSearchParams({ q: tempQuery })}
			/>
			<Gesetz normIndex={normIndex} gesetzIndex={gesetzId} />
		</div>
	);
}

export const Gesetz = ({
	normIndex,
	gesetzIndex,
}: {
	normIndex: string;
	gesetzIndex: string;
}) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		if (gesetzIndex) {
			getData(gesetzIndex.toLowerCase()).then((d) => setData(d));
		} else {
			setData([]);
		}
	}, [gesetzIndex]);

	if (data) {
		return <RowVirtualizerDynamic rows={data} normIndex={normIndex} />;
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
