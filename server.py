# -*- coding: utf-8 -*-
"""
Local SPA Development Server for Lalitpur Financial Advisory Website
Supports SPA route fallback: all clean routes without extensions (/services/..., /blog/...)
are routed to index.html with HTTP 200.
"""

import http.server
import socketserver
import os
import urllib.parse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SPAMapHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        # Check if requesting an actual physical file
        local_path = os.path.join(DIRECTORY, path.lstrip('/'))
        if os.path.exists(local_path) and not os.path.isdir(local_path):
            return super().do_GET()
        
        # If it's a directory with an index.html
        if os.path.isdir(local_path) and os.path.exists(os.path.join(local_path, 'index.html')):
            return super().do_GET()
            
        # Clean URL SPA rewrite: serve index.html with 200 OK
        index_file = os.path.join(DIRECTORY, 'index.html')
        if os.path.exists(index_file):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            with open(index_file, 'rb') as f:
                self.wfile.write(f.read())
            return
            
        return super().do_GET()

if __name__ == '__main__':
    with socketserver.TCPServer(('', PORT), SPAMapHandler) as httpd:
        print(f'Server running at http://localhost:{PORT}/')
        print('Press Ctrl+C to stop.')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Server stopped.')
