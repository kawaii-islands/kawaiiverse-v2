import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import { error } from "src/slices/MessagesSlice";

const Home = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, []);

	return (
		loading ? (<LoadingPage />) : (
			<MainLayout>
				Home page
			</MainLayout>
		)
	);
};

export default Home;
