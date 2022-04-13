import { useEffect, useState } from "react";
import { RowVirtualizerDynamic } from "./row-virtualizer";
import { SearchBar } from "./search-bar";
import gesetzeJson from "../gesetze.json";

function getData(gesetzIndex: string) {
	return fetch(`data/${gesetzIndex}.json`, {
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	}).then((response) => response.json());
}

function cleanNormQuery(query: string) {
	return query.trim().toLowerCase();
}

export function GesetzView() {
	const [query, setQuery] = useState("1000 BGB");
	const [normIndex, setNormIndex] = useState("");
	const [gesetzIndex, setGesetzIndex] = useState("");
	useEffect(() => {
		var reg = /^(Art\.?|§+)\s+/i;
		const splitted = query.trim().replace(reg, "").split(" ");
		if (splitted.length === 1) {
			if (gesetzeJson.hasOwnProperty(cleanNormQuery(splitted[0]))) {
				setGesetzIndex(splitted[0]);
				setNormIndex("");
			} else {
				setNormIndex(splitted[0]);
			}
		}
		if (splitted.length === 2) {
			const gesetzeQuery = cleanNormQuery(splitted[1]);
			if (gesetzeJson.hasOwnProperty(gesetzeQuery)) {
				setNormIndex(splitted[0]);
				setGesetzIndex((gesetzeJson as { [_: string]: string })[gesetzeQuery]);
			}
		}
	}, [query]);

	return (
		<div>
			<SearchBar onQueryChange={setQuery} searchQuery={query} />
			<Gesetz normIndex={normIndex} gesetzIndex={gesetzIndex} />
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

	return <RowVirtualizerDynamic rows={data} normIndex={normIndex} />;
};
