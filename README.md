# LevelUp Budget Tracker : Team 25

## Team Members

- **Project Manager:** Justin Mexil (@justin2flyy)  
- **Communications Lead:** Brandon Horvath (@Brandon0706)  
- **Git Master:** John Bellamy (@BellamyDev)  
- **Design Lead:** Daniel Liu (@Phohou)  
- **Quality Assurance Tester:** Kennadi Hope (@Kennadi718)

---

## About the Project

**LevelUp Budget** is a gamified, collaborative budgeting tool that aims to make personal finance management both engaging and effective. It enables users to:

- **Collaborate in Real Time**: Multiple users can interact with shared budgets simultaneously, fostering transparency and group accountability.
- **Gamify Budgeting**: Earn points, unlock badges, and rise on leaderboards by meeting financial goals or spending wisely.
- **Get Smart Suggestions**: The app uses previous financial behavior to deliver predictive and personalized budgeting tips (e.g., identifying unused subscriptions or recurring spikes in spending).

Built using **Next.js**, **React**, **ShareDB**, **ExpressJS**, and **FastAPI**, the LevelUp Budget Tracker merges modern technology with user-centric financial planning.

---

## Platforms Tested On

- macOS
- Linux (Ubuntu 22.04)
- Windows 10 / 11
- Android (Chrome + Mobile View)
- iOS (Safari + Chrome)

---

## Important Links

- **Kanban Board**: [Trello Board](https://trello.com/b/LSgXJFF5/csc-3380-team-25-project)  
- **Design Files (Figma or similar)**: _[Pending upload - replace with link]_  
- **Style Guide / Code Standards**: _[Pending upload - replace with link]_  

---

## Dependencies and Versions

- Node.js (v18.x)
- npm (v9.x)
- Python (v3.11+)
- FastAPI (v0.110+)
- Uvicorn (v0.29+)
- React (v18.x)
- Next.js (v13+)
- ShareDB (v1.5+)
- ExpressJS (v4.18+)
- dotenv (v16+)
- CORS (v2.8+)

---

## How to Download Dependencies

1. **Install Node.js and npm**  
   [https://nodejs.org/en/download](https://nodejs.org/en/download)

2. **Install Python 3.11+**  
   [https://www.python.org/downloads/](https://www.python.org/downloads/)

3. **Install Backend Dependencies**  

4. **Install Frontend Dependencies**  
   Navigate to the frontend directory and run:
   ```bash
   npm install
   ```

   All extensions and dependencies are free and compatible with the **Community Edition** of VSCode.

---

## Running the Project (From Code)

### 1. Start Backend Server (FastAPI)
In the root backend directory, run:


### 2. Start Frontend Server (Next.js/React)

```bash
npm run dev
```

The frontend is typically accessible at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

## Notes

- Ensure `.env` files for both frontend and backend are correctly set up. Sample environment files are provided as `.env.example`.
- All commands must be executed from the correct directory (backend/frontend).
- This setup supports live-reloading for development.
- If you encounter CORS issues, make sure the backend allows requests from `localhost:3000`.
