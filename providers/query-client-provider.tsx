"use client";
import {
	QueryClient,
	QueryClientProvider as QueryClientProviderTanstack,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProviderTanstack client={queryClient}>
			{children}
		</QueryClientProviderTanstack>
	);
};

export default QueryClientProvider;
