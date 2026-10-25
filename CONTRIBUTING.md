# Contributing to HirePilot AI

Welcome to **HirePilot AI**! We are thrilled to welcome open-source contributions, especially during **Hacktoberfest** and community events like the **Karmers Community Hacktoberfest Meetup (Hyderabad)**!

Whether you are fixing a typo, optimizing prompt reasoning, adding new ATS resume styles, or building new features, your help is appreciated.

---

## 🎃 Hacktoberfest Participation Guidelines

1. **Find or Open an Issue**: Check out our open issues or submit a feature proposal/bug report. Look for issues tagged `good first issue` or `hacktoberfest`.
2. **Fork & Branch**: Fork the repo and create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Keep Commits Clean**: Follow conventional commit conventions (`feat: ...`, `fix: ...`, `docs: ...`).
4. **Test Before Submitting**:
   - Frontend: Verify build compiles cleanly:
     ```bash
     cd frontend && npm run build
     ```
   - Backend: Ensure syntax and imports are valid:
     ```bash
     python -m uvicorn backend.main:app
     ```
5. **Open a Pull Request**: Provide a clear description of what changed and why.

---

## 🚀 Good First Issues & Community Roadmap

Here are great areas where community contributors can make an immediate impact:

- [ ] **Resume Template Variations**: Add alternative ATS-safe styles (e.g. Classic Serif, Modern Compact).
- [ ] **Dark Mode Toggle**: Add a sleek obsidian dark theme toggle to the interface.
- [ ] **Export to Markdown & LaTeX**: Expand export options beyond PDF and Word (`.docx`).
- [ ] **Docker Containerization**: Add a `Dockerfile` and `docker-compose.yml` for 1-click startup.
- [ ] **Mock Audio / Voice Practice**: Interactive voice response for STAR interview questions.
- [ ] **Multi-Language Support**: Localization for candidate resumes in multiple languages.

---

## 🛠️ Local Development Setup

### Backend (FastAPI Python)
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your OpenRouter API key or run local Ollama

# Start backend server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Code of Conduct

Be kind, respectful, and collaborative. We are here to learn, build, and support each other's open-source journeys!
