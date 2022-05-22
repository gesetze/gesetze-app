import { Virtuoso } from "react-virtuoso";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

export const RowVirtualizerDynamic = ({
	rows,
	normIndex,
}: {
	rows: Norm[];
	normIndex: any;
}) => {
	return (
		<Virtuoso
			useWindowScroll
			data={rows}
			itemContent={(index, item) => <NormView data={item}></NormView>}
		/>
	);
};
