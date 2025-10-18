# 📝 Asiya Todo-List • Modern To-Do App

A fast, elegant, and lightweight to-do list built with **React**, **TypeScript**, and **Vite**.  
It features a polished design with “My Day”, custom lists, drag-and-drop reordering, due dates, and a light/dark theme.  
All data is stored locally, making the app fully functional even when offline.

---

## ✨ Features

- **My Day:** Focused view for today’s tasks  
- **Custom Lists:** Create, rename, and delete task lists with color tags  
- **Tasks:** Add, edit, delete, and reorder tasks easily  
- **Drag & Drop:** Reorder tasks within lists using `@dnd-kit`  
- **Important Flag:** Mark and filter priority tasks  
- **Views:** Separate tabs for pending and completed tasks  
- **Themes:** One-click toggle between light and dark mode (persistent)  
- **Offline Ready:** Zustand’s `persist` middleware saves data in `localStorage`  
- **Zero Backend:** Everything runs 100% client-side  

---

## 🧱 Tech Stack

- ⚛️ **React 19**  
- 💻 **TypeScript**  
- ⚡ **Vite 6**  
- 🪣 **Zustand + Immer** for reactive and immutable state  
- 🧭 **React Router v6** for navigation  
- 📅 **date-fns** for date utilities  
- 🧩 **@dnd-kit** for drag-and-drop  
- 💫 **Framer Motion** for subtle animations  
- 🎨 **Tailwind CSS (via CDN)** for rapid styling  
- 🔔 **lucide-react** icons  

> Environment variable placeholders like `GEMINI_API_KEY` in `vite.config.ts` are optional and not needed to run this project.

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+** (v20 recommended)  
- npm / pnpm / yarn (use your preferred package manager)

### Installation
```bash
npm install
Run Development Server
bash
Copy code
npm run dev
Open the URL shown in the terminal — typically http://localhost:3000

Build for Production
bash
Copy code
npm run build
npm run preview
📁 Project Structure
graphql
Copy code
.
├─ components/
│  ├─ AddBar.tsx
│  ├─ MyDayBanner.tsx
│  ├─ Sidebar.tsx
│  ├─ TaskRow.tsx
│  ├─ ThemeSelector.tsx
│  ├─ ThemeToggle.tsx
│  └─ SuggestionsPane.tsx
├─ pages/
│  ├─ Dashboard.tsx
│  ├─ Landing.tsx
│  ├─ PendingPage.tsx
│  └─ CompletedPage.tsx
├─ store/
│  ├─ useStore.ts        # Zustand store (persisted as "msTODO:v1")
│  └─ useTheme.ts        # Theme state
├─ lib/
│  └─ dates.ts
├─ types.ts              # Shared app types (Task, List, etc.)
├─ App.tsx               # Routes and theme manager hook
├─ index.html            # Tailwind via CDN + modulepreload
├─ index.tsx             # Entry point (ReactDOM root)
├─ vite.config.ts        # React plugin + env defines
├─ tsconfig.json
└─ package.json

🧠 Future Improvements
Add cloud sync (Firebase / Supabase)

Task reminders and notifications

Collaborative lists with sharing links

AI task suggestions

📄 License
This project is licensed under the MIT License — feel free to use, modify, and share.

