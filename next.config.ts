import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.slack-edge.com",
				port: "",
				pathname: "/**", // Allow any path under this hostname
			},
		],
	},
};

export default nextConfig;
