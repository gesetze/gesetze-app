import {
	alpha,
	AppBar,
	IconButton,
	InputBase,
	Paper,
	styled,
	Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
	ChangeEvent,
	KeyboardEvent,
	MutableRefObject,
	useEffect,
	useRef,
} from "react";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		maxWidth: "45em",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

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
		<AppBar position="sticky">
			<Toolbar style={{ justifyContent: "center" }}>
				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Search"
						value={searchQuery}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							onQueryChange(e.target.value)
						}
						onKeyUp={handleKeyDown}
						autoFocus={true}
						inputProps={{
							"aria-label": "search",
							autoComplete: "off",
							spellCheck: "false",
							autoCorrect: "off",
						}}
					/>
				</Search>
			</Toolbar>
		</AppBar>
	);
};
