import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
	const [hasError, setHasError] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const errorHandler = (event) => {
			console.error(event.error || event);
			setHasError(true);
		};
		window.addEventListener("error", errorHandler);
		return () => {
			window.removeEventListener("error", errorHandler);
		};
	}, []);

	useEffect(() => {
		if (hasError) {
			router.push("/error");
		}
	}, [hasError, router]);

	if (hasError) {
		return null;
	}

	// Render the child components normally if no error occurred
	return children;
};

export default ErrorBoundary;
