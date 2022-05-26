import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
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
	const [tempQuery, setTempQuery] = useState("1000 BGB");
	const [query, setQuery] = useState("1000 BGB");
	const [normIndex, setNormIndex] = useState("");
	const [gesetzId, setGesetzId] = useState("");

	useEffect(() => {
		const queryObj = parseSearchQuery(query);
		console.log(queryObj);
		if (queryObj) {
			// set gesetzId if not set
			queryObj.gesetzId = queryObj.gesetzId || gesetzId;
			setNormIndex(queryObj.normId || "");
			setGesetzId(queryObj.gesetzId);
			setTempQuery(formatQuery(queryObj));
		}
	}, [query]);

	return (
		<div>
			<SearchBar
				onQueryChange={setTempQuery}
				searchQuery={tempQuery}
				onExecuteQuery={() => setQuery(tempQuery)}
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
			getData(gesetzIndex).then((d) => setData(d));
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
