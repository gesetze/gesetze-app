import { Component, createRef, RefObject } from "react";
import { Norm } from "./modals";
import { NormView } from "./norm-view";

interface RowVirtualizerProps {
	rows: Norm[];
	normId: string;
	onTopIndexChange: (index: number) => any;
}

interface RowVirtualizerState {
	normIndex: number;
	isRendering: boolean;
	renderRangeEnd: number;
}

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
	return Array.from(Array(size).keys()).map((i) => i + startAt);
}

export class RowVirtualizer extends Component<
	RowVirtualizerProps,
	RowVirtualizerState
> {
	ticking = false;
	rows: { [id: number]: HTMLElement } = {};
	divElement: RefObject<HTMLDivElement>;

	constructor(props: RowVirtualizerProps) {
		super(props);
		this.state = { normIndex: -1, isRendering: false, renderRangeEnd: 0 };
		this.updateNormIndex();
		this.divElement = createRef();
	}

	componentDidUpdate(
		prevProps: RowVirtualizerProps,
		prevState: RowVirtualizerState
	) {
		if (
			prevProps.normId !== this.props.normId ||
			prevProps.rows !== this.props.rows
		)
			this.updateNormIndex();
	}

	updateNormIndex() {
		const normIndex = this.props.rows.findIndex(
			({ index }) => index === this.props.normId
		);
		this.setState({ normIndex, renderRangeEnd: normIndex + 30 });

		if (this.props.rows?.length && normIndex !== -1)
			setTimeout(() => {
				const elem = document.querySelector<HTMLElement>(
					`[id=row-${normIndex}]`
				);
				if (elem) {
					this.setState({ isRendering: true });
					elem.scrollIntoView({ block: "start" });
					window.scrollBy({ top: -64 });
					this.setState({ isRendering: false });
				}
				this.checkTopIndex();
			});
	}

	checkTopIndex() {
		Array.from(document.querySelectorAll<HTMLElement>("[id^=row-]")).every(
			(elem) => {
				if (elem.getBoundingClientRect().top + elem.offsetHeight >= 64) {
					const newTopIndex = Number(
						elem.getAttribute("id")?.replace("row-", "")
					);
					this.props.onTopIndexChange(newTopIndex);
					return false;
				} else {
					return true;
				}
			}
		);
	}

	onScroll() {
		if (!this.ticking && !this.state?.isRendering) {
			this.ticking = true;
			setTimeout(() => {
				// this.checkTopIndex();
				console.log(this.rows);
				this.ticking = false;
			}, 500);
		}
	}

	componentDidMount() {
		window.removeEventListener("scroll", () => this.onScroll());
		window.addEventListener("scroll", () => this.onScroll(), { passive: true });
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", () => this.onScroll());
	}

	registerRowElement(element: HTMLDivElement | null, index: number) {
		console.log("Register", index, this.rows[index] === element);
		element && (this.rows[index] = element);
	}

	render() {
		// this.rows = {};
		const start = Math.max(0, (this.state?.normIndex || 0) - 10);
		const end = Math.min(start + 20, this.props.rows?.length || 0);
		console.log(start, end);
		const renderedRowsRange = range(end - start, start);

		return (
			<div
				ref={this.divElement}
				style={{
					width: "100%",
					maxWidth: "47em",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			>
				{renderedRowsRange.map((index) => (
					<div
						className="row"
						id={`row-${index}`}
						key={index}
						ref={(e) => this.registerRowElement(e, index)}
					>
						<NormView data={this.props.rows[index]}></NormView>
					</div>
				))}
			</div>
		);
	}
}
