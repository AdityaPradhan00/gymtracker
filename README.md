Gym Progress Tracker Web App

🚀 Overview

A mobile-first web application built with React and Tailwind CSS to help users track their gym workouts. This app allows users to add workout days, log exercises with sets/reps or time-based tracking, and store progress locally in browser storage. It is designed to be lightweight, user-friendly, and scalable for future enhancements.

🎯 Features

Workout Tracking: Users can create custom workout plans by adding days (e.g., Day 1, Day 2) and listing exercises.

Exercise Customization: Choose from a predefined list or add custom exercises.

Flexible Tracking:

Reps & Sets (e.g., 'Leg Curls: 3 sets, 15 reps each')

Time-Based (e.g., 'Plank: 3 rounds, 60s each')

Multiple Entries: Users can log the same exercise multiple times per day.

Rest Days: Assign rest days for recovery.

YouTube Links: Attach links to exercises for instructional purposes (stored as plain links, not embedded).

Local Storage: Progress is saved in localStorage (or IndexedDB in future updates) without requiring login.

Progress Summary: A dashboard to visualize weekly workouts.

Quick Add: Easily copy previous workouts to new days.

Rest Timer: Optional countdown timer between sets.

Dark/Light Mode: User preference support for better usability.

Mobile-Optimized: Built with mobile-first design principles to ensure smooth touch interactions and responsive layouts.

🔮 Future Enhancements

Cloud Storage: Support for Firebase/Supabase authentication and database.

Calorie Counter: Track calorie intake and expenditure.

PWA Support: Enable offline mode and installability.

AI Suggestions: Auto-generate workout plans based on fitness goals.

🛠️ Tech Stack

Frontend: React, Tailwind CSS

State Management: React Context API / Zustand (planned)

Storage: localStorage (IndexedDB in future updates)

UI Components: React Icons, Headless UI

💻 Installation & Setup

# Clone the repository

git clone https://github.com/AdityaPradhan00/gymtracker.git
cd gym-tracker

# Install dependencies

npm install

# Start the development server

npm run dev

🚀 Usage

Open the app in your browser (http://localhost:3000 by default).

Add workout days and exercises.

Log progress with sets/reps or time-based tracking.

Store progress automatically in the browser.

Click YouTube links for exercise guidance.

Enable dark mode for better visibility.

📜 License

This project is licensed under the MIT License.

🤝 Contributing

Contributions are welcome! To contribute:

Fork the repository.

Create a new branch (feature-new-feature).

Commit changes and push to your fork.

Submit a Pull Request.

📞 Contact

For questions or suggestions, reach out via aditya1pradhan21@gmail.com or open an issue on GitHub.
