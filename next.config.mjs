const nextConfig = {
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  }
}

export default nextConfig
