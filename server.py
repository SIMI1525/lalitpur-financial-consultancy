# -*- coding: utf-8 -*-
"""
High-Performance Dual-Stack (IPv6 + IPv4) Threaded Server for Lalitpur Financial Advisory
Features:
- Dual-stack socket binding (AF_INET6 with IPV6_V6ONLY=0): eliminates 2.0s Windows IPv6 reverse-DNS lag (0.005s per request!)
- ThreadingHTTPServer for concurrent, non-blocking requests
- Overrides address_string() to completely bypass reverse DNS resolution
- Correct MIME types with UTF-8 charset
- Aggressive no-cache headers during development (forces fresh JS/CSS)
- Statically serves pre-rendered directory index.html if present
- Clean-URL SPA rewrite fallback to root index.html with explicit Content-Length
"""

import http.server
import os
import socket
import urllib.parse
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DualStackSPAMapHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def address_string(self):
        # Disable reverse DNS lookup on Windows
        return self.client_address[0]

    def log_message(self, format, *args):
        # Clean logging
        sys.stdout.write(f"[{self.log_date_time_string()}] {self.client_address[0]} - {format % args}\n")
        sys.stdout.flush()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        # Ensure proper JavaScript MIME types on Windows
        base, ext = os.path.splitext(path)
        if ext.lower() == '.js':
            return 'text/javascript; charset=utf-8'
        if ext.lower() == '.css':
            return 'text/css; charset=utf-8'
        if ext.lower() == '.html':
            return 'text/html; charset=utf-8'
        if ext.lower() == '.json':
            return 'application/json; charset=utf-8'
        return super().guess_type(path)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        
        # 1. Physical file exists
        local_path = os.path.join(DIRECTORY, clean_path.lstrip('/').replace('/', os.sep))
        if os.path.isfile(local_path):
            return super().do_GET()
        
        # 2. Directory exists with its own index.html (pre-rendered page)
        if os.path.isdir(local_path):
            dir_index = os.path.join(local_path, 'index.html')
            if os.path.isfile(dir_index):
                return super().do_GET()

        # 3. Check clean directory without trailing slash
        potential_dir = os.path.join(DIRECTORY, clean_path.strip('/'))
        if os.path.isdir(potential_dir):
            dir_index = os.path.join(potential_dir, 'index.html')
            if os.path.isfile(dir_index):
                try:
                    with open(dir_index, 'rb') as f:
                        content = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'text/html; charset=utf-8')
                    self.send_header('Content-Length', str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                    return
                except (ConnectionResetError, BrokenPipeError):
                    return

        # 4. SPA rewrite fallback: serve root index.html
        index_file = os.path.join(DIRECTORY, 'index.html')
        if os.path.isfile(index_file):
            try:
                with open(index_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return
            except (ConnectionResetError, BrokenPipeError):
                return
            
        return super().do_GET()

class DualStackThreadingServer(http.server.ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        # Enable dual-stack IPv6 + IPv4 on Windows/Linux
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except (AttributeError, OSError):
            pass
        super().server_bind()

if __name__ == '__main__':
    # Bind to dual-stack IPv6 wildcard
    server_address = ('::', PORT)
    try:
        httpd = DualStackThreadingServer(server_address, DualStackSPAMapHandler)
    except Exception as e:
        # Fallback to standard IPv4 if IPv6 unavailable
        print(f"Dual-stack bind notice ({e}), falling back to IPv4...")
        httpd = http.server.ThreadingHTTPServer(('', PORT), DualStackSPAMapHandler)
        httpd.daemon_threads = True

    print(f'Fast Dual-Stack Server running at http://localhost:{PORT}/')
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Server stopped.')
