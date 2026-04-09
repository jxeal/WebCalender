# Wanderlust Web Calendar 📅

A beautifully designed, fully responsive, and interactive web calendar application. Built with React and Tailwind CSS, it features dynamic monthly backgrounds, public holiday tracking, date range selection, and a built-in notes system.

## 🌟 Live Demo

Check out the live application here: **[https://web-calender.vercel.app/](https://web-calender.vercel.app/)**

## ✨ Features

- **Responsive Design:** Custom-tailored layouts for every device, including specific optimizations for mobile portrait, mobile landscape, tablets, and large desktop screens.
- **Dynamic Backgrounds:** The background image automatically changes to match the current month, providing a fresh visual experience year-round.
- **Interactive Date Selection:** Support for selecting single dates or highlighting date ranges with smooth hover effects.
- **Public Holidays & Weekends:** Automatically fetches and highlights public holidays (currently configured for India) and Sundays in red.
- **Monthly Notes:** A built-in notepad for each month. Notes are automatically saved to your browser's `localStorage` so you never lose your thoughts.
- **Quick Date Insertion:** Easily insert the currently selected date or date range directly into your notes with a single click.

## 🛠️ Tech Stack

- **Framework:** [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Utilities:** Native JavaScript `Date` API
- **Holidays:** [`date-holidays`](https://www.npmjs.com/package/date-holidays)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (Node Package Manager) installed on your machine.

- [Node.js](https://nodejs.org/) (v16 or higher recommended)

### Installation & Setup

1. **Clone the repository:**
   Open your terminal and run the following command to clone the project:

   ```bash
   git clone https://github.com/jxeal/WebCalender.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd WebCalender
   ```

3. **Install dependencies:**
   Run npm install to download all required packages:

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Open your browser and navigate to `http://localhost:3000` (or the port provided in your terminal) to view the app.

## 📂 Project Structure

- `src/components/WallCalendar.tsx`: The main calendar component containing all the logic, grid rendering, and responsive layout definitions.
- `src/index.css`: Global stylesheet including Tailwind CSS imports and custom animations.
- `src/App.tsx`: The root application component.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
