import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GesetzView } from "./gesetz/gesetz";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<GesetzView />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
