import { Norm } from "./modals";
import "./norm-view.css";

export const NormView = ({ data }: { data: Norm }) => {
	const divid = data.enbez?.replace("§ ", "");

	return (
		<div className="norm" id={divid}>
			<h3>
				{data.enbez} {data.jurabk || data.amtabk} {data.titel}
			</h3>
			<div dangerouslySetInnerHTML={{ __html: data.textdaten }}></div>
		</div>
	);
};
