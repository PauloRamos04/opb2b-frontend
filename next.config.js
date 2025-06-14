/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          bufferutil: false,
          'utf-8-validate': false,
        };
      }
      
      // Ignorar warnings específicos do WebSocket
      config.ignoreWarnings = [
        { module: /node_modules\/ws\/lib\/buffer-util\.js/ },
        { module: /node_modules\/ws\/lib\/validation\.js/ },
      ];
      
      return config;
    },
  }
  
  module.exports = nextConfig