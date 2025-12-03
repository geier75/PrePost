import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
const PORT = 3002;

// Enable CORS for all requests
app.use(cors());

// Bridge Script to inject
const BRIDGE_SCRIPT = `
<script>
  (function() {
    console.log("🌉 Bridge Script Injected Successfully");
    
    // Listen for all input events
    document.addEventListener('input', function(e) {
      const target = e.target;
      const value = target.value || target.innerText;
      
      if (value) {
        console.log("📝 Input captured:", value.substring(0, 20) + "...");
        window.parent.postMessage({
          type: 'PREPOST_ANALYSIS_INPUT',
          text: value,
          source: window.location.hostname
        }, '*');
      }
    }, true);

    // Also listen for keyup to catch some edge cases
    document.addEventListener('keyup', function(e) {
      const target = e.target;
      const value = target.value || target.innerText;
      
      if (value) {
        window.parent.postMessage({
          type: 'PREPOST_ANALYSIS_INPUT',
          text: value,
          source: window.location.hostname
        }, '*');
      }
    }, true);
  })();
</script>
`;

// Proxy endpoint
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).send('Missing "url" query parameter');
  }

  console.log(`Proxying request to: ${targetUrl}`);

  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    selfHandleResponse: true, // Handle response ourselves to inject script
    
    onProxyReq: (proxyReq, req, res) => {
      // Prevent compression so we can modify the string easily
      proxyReq.removeHeader('accept-encoding');
    },

    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
      // Strip security headers
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['frame-options'];
      proxyRes.headers['access-control-allow-origin'] = '*';

      const contentType = proxyRes.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        let response = responseBuffer.toString('utf8');
        // Inject script before closing body tag
        return response.replace('</body>', `${BRIDGE_SCRIPT}</body>`);
      }
      return responseBuffer;
    }),

    pathRewrite: (path, req) => {
      return '/'; 
    },
    followRedirects: true,
  })(req, res, next);
});

app.listen(PORT, () => {
  console.log(`🔓 Unblocking Proxy Server running on http://localhost:${PORT}`);
});
