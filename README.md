﻿# Waste Management System Frontend

A modern web application for managing waste collection and reporting issues in your community. Built with React and Vite, this application provides an intuitive interface for users to report waste-related issues, schedule pickups, and track their reports.

This project is the frontend component of the larger **GIS-ML-WasteNetwork** system.

## Features

- 🗺️ Interactive map interface for reporting waste issues
- 📅 Schedule waste collection pickups
- 📝 Submit and track special waste collection requests
- 📊 View and manage your reported issues
- 🔍 Search and filter functionality
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Maps:** Leaflet with React-Leaflet
- **Form Handling:** Formik with Yup validation
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **UI/UX:** Framer Motion for animations
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone git@github.com:MaweuPaul/waste-frontend.git
cd waste-frontend
```

2. Install dependencies:

```bash
cd MS
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```
