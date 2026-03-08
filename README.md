# 🇨🇴 English with Colombia!
### Interactive Grammar Lesson: Present Simple vs. Present Continuous
**For Grade 2 Students (Ages 7–8) | EFL / English as a Foreign Language**

---

## 🎯 Educational Objective

This interactive web page helps young learners (7–8 years old) understand and practice the difference between:

- **Present Simple** — used for routines, habits, and facts (*"Colombians drink coffee every day."*)
- **Present Continuous** — used for actions happening right now (*"The farmer is picking coffee."*)

All examples and activities are rooted in **Colombian culture**, making learning feel familiar, engaging, and relevant.

---

## 📚 What's Inside

| Section | Description |
|---------|-------------|
| 🌟 Welcome Screen | Animated intro with Colombian characters Mateo & Sofía |
| 📚 Learn | Grammar cards, comparison table, and YouTube videos |
| 🎮 Games | 3 interactive games (Matching, Multiple Choice, Unscramble) |
| 📖 Read | Short story with comprehension questions |
| 🎧 Listen | Text-to-speech listening practice with type identification |
| ✏️ Write | Picture prompt writing activity |
| 🏆 Score System | Stars, points, and confetti celebrations |

---

## 🎮 Games Description

### 1. 🔗 Matching Game
Students match sentences to their corresponding emoji pictures. Tests understanding of which tense describes a routine vs. an ongoing action.

### 2. ✅ Multiple Choice
8 questions asking students to choose the correct verb form (base, -s form, or -ing form) to complete sentences about Colombian life.

### 3. 🔀 Unscramble
Students click words in the correct order to form grammatically correct sentences. Reinforces sentence structure for both tenses.

---

## 🗂️ Project Structure

```
english-grammar-colombia/
│
├── index.html       ← Main page (all sections)
├── style.css        ← Child-friendly colorful design
├── script.js        ← All game logic & interactivity
│
├── images/          ← (Optional: add custom images here)
│
├── audio/           ← (Optional: add MP3 audio here)
│                       The app uses Web Speech API by default
│
└── README.md        ← This file
```

---

## 🌐 How to Use the Page

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. Click **🚀 Start Learning!**
3. Navigate between sections using the colored tabs at the top
4. Complete games and activities to earn ⭐ stars and 🏆 points
5. Use the **🔄 Restart** button to reset all progress

### Browser Requirements
- Google Chrome or Microsoft Edge for best text-to-speech support
- Internet connection required (for Google Fonts + YouTube videos)

---

## 🚀 How to Publish on GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and log in (or create a free account)
2. Click the **+** button → **New repository**
3. Name it: `english-grammar-colombia`
4. Set visibility to **Public**
5. Click **Create repository**

### Step 2: Upload Your Files
**Option A — GitHub Web Interface (Easiest)**
1. Open your new repository
2. Click **Add file** → **Upload files**
3. Drag and drop ALL files:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
4. Click **Commit changes**

**Option B — Git Command Line**
```bash
# Navigate to your project folder
cd english-grammar-colombia

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: English with Colombia grammar lesson"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/english-grammar-colombia.git

# Push to GitHub
git push -u origin main
```

### Step 3: Activate GitHub Pages
1. In your repository, click **Settings** (gear icon)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select: **Deploy from a branch**
4. Branch: **main** | Folder: **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes, then your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/english-grammar-colombia/
   ```

---

## 🎨 Cultural Content Used

| Theme | Examples Used |
|-------|---------------|
| 🍽️ Food | Arepas, empanadas, chocolate caliente, café |
| 🐾 Animals | Tucanes, monos, jaguares, ranas del Amazonas |
| 📍 Places | Bogotá, Cartagena, Amazonas, cafetales |
| 💃 Activities | Bailar cumbia, jugar fútbol, visitar cafetales |

---

## 🛠️ Technology Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and content |
| **CSS3** | Child-friendly visual design, animations |
| **JavaScript (ES6+)** | Game logic, interactivity, scoring |
| **Web Speech API** | Text-to-speech for listening section |
| **YouTube Embed** | Educational videos |
| **Google Fonts** | Fredoka One + Nunito typography |

No frameworks, no build tools — just open `index.html` and it works!

---

## 👩‍🏫 Teacher's Guide

### Recommended Usage
- **Individual practice**: Students work through sections at their own pace
- **Whole class**: Project onto a screen and play games together
- **Assessment**: Check scores displayed in the top navigation bar

### Curriculum Alignment
- **Level**: A1 (CEFR) / Grade 2 EFL
- **Grammar focus**: Present Simple vs. Present Continuous
- **Skills**: Listening, Reading, Writing, Grammar

### Customizing the Content
To change sentences or add new ones, edit the arrays in `script.js`:
- `matchingPairs` — Matching game pairs
- `mcQuestions` — Multiple choice questions
- `unscrambleSentences` — Sentences to unscramble
- `listeningSentences` — Listening examples
- `writingPictures` — Writing prompts

---

## 📝 License

Free to use for educational purposes. Created with ❤️ for Colombian students learning English.

---

*"Learning English is more fun when it feels like home!"* 🇨🇴
