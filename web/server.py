#!/usr/bin/env python3
import http.server
import socketserver
import argparse
import os
import sys

# === SERVE IN SIBERIK REPO ===
ROOT_DIR = "/home/mike/Desktop/codes/projects/_SIBERIK/Siberik-repo"
os.chdir(ROOT_DIR)

# === PARAMS CONFIG ===
socketserver.TCPServer.allow_reuse_address = True
parser = argparse.ArgumentParser(description="Simple web server for local and remote tests.")
parser.add_argument("--host", default="0.0.0.0", help="IP address for all interfaces: 0.0.0.0")
parser.add_argument("--port", type=int, default=8002, help="Server port (default: 8006)")
args = parser.parse_args()

# === CUSTOM HANDLER SIN CACHE ===
class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

# === CONFIGURE SERVER ===
Handler = NoCacheHandler

try:
    httpd = socketserver.TCPServer((args.host, args.port), Handler)
    print(f"\n Web Server running:")
    print(f"   ▶ Local:      http://192.168.1.121:{args.port}")
    print(f"   ▶ TailScale:  http://100.104.24.69:{args.port}")
    print("Press CTRL+C to stop.\n")

    httpd.serve_forever()

except OSError as e:
    print(f"\n❌ Error: {e}")
    print("⚠️  The port is currently in use. You can free it with:")
    print(f"   sudo fuser -k {args.port}/tcp\n")

except KeyboardInterrupt:
    print("\n Server stopped by user.")

finally:
    try:
        httpd.server_close()
        print(f"✅ Port {args.port} released.\n")
    except Exception:
        pass
