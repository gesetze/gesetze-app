import { Norm } from "./modals";
import "./norm-view.css";

export const NormView = ({ data }: { data: Norm }) => {
	return (
		<>
			<h3>
				{data.enbez} {data.jurabk || data.amtabk} {data.titel}
			</h3>
			<div dangerouslySetInnerHTML={{ __html: data.textdaten }}></div>
		</>
	);
};
