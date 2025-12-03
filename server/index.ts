import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import zlib from "zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Bridge script to inject
  const BRIDGE_SCRIPT = `
    <script>
      (function() {
        console.log("🌉 Bridge Script Loaded");
        
        function sendInput(text) {
          window.parent.postMessage({
            type: 'PREPOST_ANALYSIS_INPUT',
            text: text
          }, '*');
        }

        // Monitor input fields and textareas
        document.addEventListener('input', function(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            const text = e.target.value || e.target.innerText;
            sendInput(text);
          }
        }, true);
      })();
    </script>
  `;

  // Proxy middleware configuration
  const proxyMiddleware = createProxyMiddleware({
    target: "https://www.google.com", // Default target, will be overridden
    changeOrigin: true,
    selfHandleResponse: true, // We need to handle the response to inject script
    logger: console,
    router: (req) => {
      const expressReq = req as unknown as express.Request;
      const targetUrl = expressReq.query.url as string;
      if (!targetUrl) return "https://www.google.com";
      try {
        const url = new URL(targetUrl);
        return url.origin;
      } catch (e) {
        return "https://www.google.com";
      }
    },
    pathRewrite: (path, req) => {
      const expressReq = req as unknown as express.Request;
      const targetUrl = expressReq.query.url as string;
      if (!targetUrl) return path;
      try {
        const url = new URL(targetUrl);
        return url.pathname + url.search;
      } catch (e) {
        return path;
      }
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Spoof headers to look like a real browser
        const expressReq = req as unknown as express.Request;
        const targetUrl = expressReq.query.url as string;
        
        proxyReq.setHeader(
          "User-Agent",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );
        proxyReq.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8");
        proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
        proxyReq.setHeader("Cache-Control", "no-cache");
        proxyReq.setHeader("Pragma", "no-cache");
        proxyReq.setHeader("Upgrade-Insecure-Requests", "1");
        proxyReq.setHeader("Sec-Fetch-Dest", "document");
        proxyReq.setHeader("Sec-Fetch-Mode", "navigate");
        proxyReq.setHeader("Sec-Fetch-Site", "none");
        proxyReq.setHeader("Sec-Fetch-User", "?1");

        if (targetUrl) {
          try {
            const urlObj = new URL(targetUrl);
            proxyReq.setHeader("Referer", urlObj.origin);
            proxyReq.setHeader("Origin", urlObj.origin);
          } catch (e) {}
        }
        
        // Remove headers that might reveal we are a proxy
        proxyReq.removeHeader("X-Forwarded-For");
        proxyReq.removeHeader("X-Forwarded-Proto");
        proxyReq.removeHeader("X-Forwarded-Host");
      },
      proxyRes: (proxyRes, req, res) => {
        // Strip blocking headers
        delete proxyRes.headers["x-frame-options"];
        delete proxyRes.headers["content-security-policy"];
        delete proxyRes.headers["x-content-type-options"];
        delete proxyRes.headers["frame-options"];

        // Allow cross-origin
        proxyRes.headers["access-control-allow-origin"] = "*";
        proxyRes.headers["access-control-allow-methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS";
        proxyRes.headers["access-control-allow-headers"] = "X-Requested-With, content-type, Authorization";

        // Rewrite cookies to be SameSite=None; Secure to allow cross-site usage
        if (proxyRes.headers["set-cookie"]) {
          proxyRes.headers["set-cookie"] = proxyRes.headers["set-cookie"].map((cookie) => {
            // Remove Domain attribute to allow cookie on localhost/proxy domain
            let newCookie = cookie.replace(/Domain=[^;]+;/gi, "");
            return newCookie.replace(/; SameSite=Lax/gi, "; SameSite=None").replace(/; SameSite=Strict/gi, "; SameSite=None") + "; SameSite=None; Secure";
          });
        }

        // Handle Redirects manually to keep them in the proxy
        if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
          const location = proxyRes.headers.location;
          // Rewrite location to go through proxy
          if (location.startsWith("http")) {
            proxyRes.headers.location = `/api/proxy?url=${encodeURIComponent(location)}`;
          }
        }

        // Handle content encoding (gzip, deflate, br)
        let body: Buffer[] = [];
        proxyRes.on("data", (chunk) => {
          body.push(chunk);
        });

        proxyRes.on("end", () => {
          let buffer = Buffer.concat(body);
          const encoding = proxyRes.headers["content-encoding"];

          // Helper to process decoded content
          const processContent = (decodedBuffer: Buffer) => {
            let html = decodedBuffer.toString("utf8");
            
            // Inject <base> tag to fix relative links
            const expressReq = req as unknown as express.Request;
            const targetUrl = expressReq.query.url as string;
            if (targetUrl) {
              try {
                const urlObj = new URL(targetUrl);
                const baseTag = `<base href="${urlObj.origin}/">`;
                
                // Remove existing CSP meta tags
                html = html.replace(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");
                
                // Anti-Frame-Busting Script
                const antiFrameBusting = `
                  <script>
                    window.self = window.top; 
                    if (window.top !== window.self) { 
                      try { window.top.location = window.self.location; } catch(e){} 
                    }
                  </script>
                `;

                if (html.includes("<head>")) {
                  html = html.replace("<head>", `<head>${baseTag}${antiFrameBusting}`);
                } else if (html.includes("<html>")) {
                  html = html.replace("<html>", `<html><head>${baseTag}${antiFrameBusting}</head>`);
                }

                // Rewrite absolute URLs to go through proxy
                // This is a simple regex-based replacement. For more robust parsing, a DOM parser would be better,
                // but regex is faster and sufficient for many cases here.
                // We target href="http...", src="http...", action="http..."
                const proxyBase = "/api/proxy?url=";
                
                // Rewrite href
                html = html.replace(/href=["'](https?:\/\/[^"']+)["']/g, (match, url) => {
                  return `href="${proxyBase}${encodeURIComponent(url)}"`;
                });
                
                // Rewrite src (only for scripts/iframes that need proxying, images usually work with base tag but let's be safe)
                // Actually, for images/scripts, base tag handles relative. For absolute, we might want to proxy them too
                // to avoid mixed content or referer issues, but it might slow things down.
                // Let's focus on navigation links (href) and form actions (action) first.
                
                // Rewrite form actions
                html = html.replace(/action=["'](https?:\/\/[^"']+)["']/g, (match, url) => {
                  return `action="${proxyBase}${encodeURIComponent(url)}"`;
                });

              } catch (e) {
                console.error("Failed to inject base tag", e);
              }
            }

            // Inject bridge script before </body>
            if (html.includes("</body>")) {
              html = html.replace("</body>", `${BRIDGE_SCRIPT}</body>`);
            } else {
              html += BRIDGE_SCRIPT;
            }

            // Re-encode if necessary (or just send as identity if we stripped encoding)
            // For simplicity, we'll send back uncompressed content and remove content-encoding header
            res.removeHeader("content-encoding");
            res.removeHeader("content-length");
            res.end(html);
          };

          if (encoding === "gzip") {
            zlib.gunzip(buffer, (err, decoded) => {
              if (err) return res.end(buffer); // Fallback to original if error
              processContent(decoded);
            });
          } else if (encoding === "deflate") {
            zlib.inflate(buffer, (err, decoded) => {
              if (err) return res.end(buffer);
              processContent(decoded);
            });
          } else if (encoding === "br") {
            zlib.brotliDecompress(buffer, (err, decoded) => {
              if (err) return res.end(buffer);
              processContent(decoded);
            });
          } else {
            processContent(buffer);
          }
        });
      },
    },
  });

  // Use proxy for /api/proxy
  app.use("/api/proxy", proxyMiddleware);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3006;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
