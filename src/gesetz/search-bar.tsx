import { AppBar, IconButton, InputBase, Paper, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
	ChangeEvent,
	KeyboardEvent,
	MutableRefObject,
	useEffect,
	useRef,
} from "react";

export const SearchBar = ({
	searchQuery = "",
	onQueryChange,
	onExecuteQuery,
}: {
	searchQuery: string;
	onQueryChange: (query: string) => any;
	onExecuteQuery: () => any;
}) => {
	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.code === "Enter" || event.code === "NumpadEnter") {
			event.currentTarget.blur();
			onExecuteQuery();
		}
	};

	let inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

	const handleKeyDownAnywhere: EventListener = (e: Event) => {
		inputRef?.current?.focus();
	};

	useEffect(() => {
		// subscribe event
		window.addEventListener("keydown", handleKeyDownAnywhere);
		return () => {
			window.removeEventListener("keydown", handleKeyDownAnywhere);
		};
	}, []);

	return (
		<AppBar position="fixed">
			<Toolbar style={{ justifyContent: "center" }}>
				<Paper
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
						width: "100%",
						maxWidth: "45em",
						height: "32px",
					}}
				>
					<InputBase
						inputRef={inputRef}
						sx={{ ml: 1, flex: 1 }}
						placeholder="Seach"
						value={searchQuery}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							onQueryChange(e.target.value)
						}
						onKeyUp={handleKeyDown}
						autoFocus={true}
						autoCorrect={"off"}
						autoComplete={"off"}
						autoCapitalize={"off"}
						inputProps={{
							autocomplete: "off",
							spellcheck: "false",
							autocorrect: "off",
						}}
					/>
					<IconButton
						type="submit"
						sx={{ p: "10px" }}
						aria-label="search"
						onClick={() => onExecuteQuery()}
					>
						<SearchIcon />
					</IconButton>
				</Paper>
			</Toolbar>
		</AppBar>
	);
};
