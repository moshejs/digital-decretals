/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the build produces a plain ./out folder that can be
  // hosted anywhere (GitHub Pages, university web space, etc.). No server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // For hosting under a sub-path (e.g. GitHub Pages project site), build with:
  //   BASE_PATH=/repo-name npm run build
  basePath: process.env.BASE_PATH ?? "",
  env: { NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH ?? "" },
};

export default nextConfig;
