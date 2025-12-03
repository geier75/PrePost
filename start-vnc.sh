#!/bin/bash

# Kill existing processes
pkill -f Xvfb
pkill -f fluxbox
pkill -f x11vnc
pkill -f websockify
pkill -f chromium

# Start Xvfb (Virtual Display)
Xvfb :100 -screen 0 1280x800x24 &
sleep 2

# Start Window Manager (Fluxbox)
export DISPLAY=:100
fluxbox &
sleep 1

# Start Chromium in Kiosk mode (full screen, no bars)
chromium-browser --no-sandbox --disable-gpu --start-maximized --window-size=1280,800 --user-data-dir=/tmp/chrome-user-data-100 --disable-dev-shm-usage https://www.google.com &

# Start VNC Server (no password for simplicity in this sandbox context, or use -nopw)
# Run in a loop to auto-restart if it crashes
while true; do
    x11vnc -display :100 -forever -nopw -shared -rfbport 5905 -bg
    sleep 1
done &

# Increase file limit
ulimit -n 4096

# Start Websockify to bridge VNC to WebSocket (port 6081)
# Run in a loop to auto-restart if it crashes
while true; do
    python3 -m websockify --web /usr/share/novnc/ --heartbeat 30 6081 localhost:5905
    sleep 1
done &

echo "Remote Browser System Started on Port 6081"
