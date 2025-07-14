# 🎸 Guitar Chord Search App

A full-stack MERN application that allows users to search for guitar chords and discover songs containing those chords, with an intelligent recommendation system.

## 🌟 Features

- **Chord Search**: Search for guitar chords by name
- **Song Discovery**: Find songs that contain specific chords
- **Smart Recommendations**: Get top 5 song recommendations based on searched chords
- **Chord Variations**: View different fingering positions for each chord
- **Difficulty Levels**: Songs categorized by difficulty (Beginner, Intermediate, Advanced)
- **Popular Songs**: Trending songs based on search frequency

## 🛠️ Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Local)
- **Recommendation Engine**: Custom algorithm based on chord matching and popularity

## 📁 Project Structure

```
guitar-chord-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local installation)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/guitar-chord-app.git
   cd guitar-chord-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Start MongoDB**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

## 📱 Usage

1. **Search Chords**: Enter chord names (e.g., "C", "Am", "G7") in the search bar
2. **View Results**: Browse through songs containing your searched chords
3. **Get Recommendations**: See top 5 recommended songs based on your search
4. **Explore Chords**: Click on any chord to view fingering positions and variations

## 🎯 API Endpoints

- `GET /api/chords` - Get all available chords
- `GET /api/chords/:name` - Get specific chord details
- `GET /api/songs` - Get all songs
- `POST /api/search` - Search songs by chords
- `GET /api/recommendations/:chords` - Get song recommendations

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/guitar_chord_app
NODE_ENV=development
```

## 🌟 Recommendation Algorithm

The app uses a custom recommendation system that:
- Matches songs with similar chord progressions
- Considers song popularity and search frequency
- Prioritizes songs with difficulty appropriate for user's searched chords
- Provides diverse recommendations across different genres

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Guitar chord data sourced from various open guitar resources
- Built with love for the guitar community
- Special thanks to all contributors


---

**Happy Strumming! 🎸🎵**# TuneTuna
A full-stack MERN application that allows users to search for guitar chords and discover songs containing those chords, with an intelligent recommendation system.
