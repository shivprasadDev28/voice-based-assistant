#!/bin/bash

echo "AI Meeting Assistant - Installation Script"
echo "========================================"
echo

# Check if Node.js is installed
echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "Node.js is installed!"
echo

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo
echo "Installation completed successfully!"
echo
echo "To start the application:"
echo "1. Run: npm start"
echo "2. Open your browser and go to: http://localhost:3000"
echo
echo "Press Enter to start the application now..."
read

echo "Starting the application..."
npm start
