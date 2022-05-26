import { AppBar, IconButton, InputBase, Paper, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, KeyboardEvent } from "react";

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
			onExecuteQuery();
		}
	};

	return (
		<AppBar position="sticky">
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
						sx={{ ml: 1, flex: 1 }}
						placeholder="Seach"
						value={searchQuery}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							onQueryChange(e.target.value)
						}
						onKeyUp={handleKeyDown}
					/>
					<IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
						<SearchIcon />
					</IconButton>
				</Paper>
			</Toolbar>
		</AppBar>
	);
};
