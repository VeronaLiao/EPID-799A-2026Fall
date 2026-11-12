# SIR Simulation Tool

This is a starter GitHub Pages project for a simple SIR (Susceptible-Infected-Recovered) simulation.

## Files

- `index.html` - app layout
- `style.css` - page styling
- `script.js` - SIR simulation logic and chart rendering

## Features

- User input for population, initial infected, initial recovered, beta, gamma, and days
- Browser-based simulation using JavaScript
- Line chart for susceptible, infected, and recovered trajectories
- Summary values for:
  - basic reproduction number (`beta / gamma`)
  - peak infected
  - day of peak infection
  - final recovered

## How to use locally

Open `index.html` in a browser.

## How to deploy on GitHub Pages

1. Push these files to your GitHub repository.
2. Open the repository on GitHub.
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Save.

Your site will then be published at a URL like:

`https://YOUR_USERNAME.github.io/EPID-799A-2026Fall/`
