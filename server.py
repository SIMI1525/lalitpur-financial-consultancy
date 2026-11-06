# -*- coding: utf-8 -*-
"""
Production-Grade Threaded SPA Development Server for Lalitpur Financial Advisory
Features:
- Multi-threaded (ThreadingHTTPServer) to handle parallel browser requests without blocking
- Overrides address_string() to disable Windows reverse DNS lookup lag (2.0s -> 0.005s per request!)
- Proper Content-Length headers on SPA rewrites to prevent browser hang / infinite spinner
- No-cache headers for local development so code edits immediately reflect in browser
- Full clean URL SPA routing (/services/, /blog/..., /contact-us/)
"""

import http.server
import os
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FastMultiThreadedSPAMapHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def address_string(self):
        # CRITICAL WINDOWS FIX: Disable reverse DNS lookup on 127.0.0.1 which causes 2.0s lag per request!
        return self.client_address[0]

    def log_message(self, format, *args):
        # Quick clean logging without DNS overhead
        print(f"[{self.log_date_time_string()}] {self.client_address[0]} - {format % args}")

    def end_headers(self):
        # Prevent browser aggressive caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        
        # Check if requesting an actual physical file (e.g. css/styles.css, js/app.js)
        local_path = os.path.join(DIRECTORY, clean_path.lstrip('/').replace('/', os.sep))
        
        if os.path.isfile(local_path):
            return super().do_GET()
        
        # If requesting a directory that has its own index.html
        if os.path.isdir(local_path):
            dir_index = os.path.join(local_path, 'index.html')
            if os.path.isfile(dir_index):
                return super().do_GET()

        # SPA rewrite: serve root index.html with 200 OK and explicit Content-Length
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

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = http.server.ThreadingHTTPServer(server_address, FastMultiThreadedSPAMapHandler)
    httpd.daemon_threads = True
    print(f'Fast Threaded Server running at http://localhost:{PORT}/')
    print('Press Ctrl+C to stop.')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('Server stopped.')
