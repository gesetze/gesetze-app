import { AppBar, IconButton, InputBase, Paper, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent } from "react";

export const SearchBar = ({
	searchQuery = "",
	onQueryChange,
}: {
	searchQuery: string;
	onQueryChange: (quer: string) => any;
}) => {
	return (
		<AppBar position="sticky">
			<Toolbar style={{ justifyContent: "center" }}>
				<Paper
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
						width: "100%",
						maxWidth: "30em ",
					}}
				>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Seach"
						value={searchQuery}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							onQueryChange(e.target.value)
						}
					/>
					<IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
						<SearchIcon />
					</IconButton>
				</Paper>
			</Toolbar>
		</AppBar>
	);
};
