<div align="center">

🇮🇷 [فارسی](./README.fa.md) | 🇺🇸 [English](./README.md)

</div>

# 📚 VajehYar - Master English Vocabulary & Idioms

A focused, interactive web application designed exclusively for Persian speakers to learn English **vocabulary, idioms, and expressions**. Built with modern web technologies to provide a seamless, beautiful, and distraction-free learning experience.

## 🎯 Purpose

VajehYar has one single, clear purpose: **to teach English vocabulary, idioms, and expressions to Persian speakers.** 

There are no trivia games, no distracting quizzes, and no unnecessary fluff. It is purely a comprehensive, beautifully organized, and interactive lexical learning tool designed for deep understanding and retention.

### Core Focus Areas:
1. 📖 **Vocabulary**: Essential English words with precise, natural-sounding Persian translations.
2. 🦜 **Idioms**: Common English idioms and proverbs with contextual meanings.
3. 💬 **Expressions**: Everyday conversational phrases for natural communication.

## ✨ Features

### 📚 Comprehensive Lexicon
- Browse entries sorted alphabetically or randomly.
- Every entry includes:
  - English word or phrase
  - Phonetic pronunciation (IPA)
  - Accurate Persian translation
  - Real-world example sentence (with the target word/idiom highlighted)
  - Clear explanation of the example's meaning in Persian

### 🔍 Smart Search & Filter
- Instant, real-time search in both English and Persian.
- Live match counting for immediate feedback.
- Filter by category: *Vocabulary*, *Idioms*, or *Expressions*.

### 🎲 Focused Practice Mode
- "Random Entry" generator with smooth animated transitions for varied, spontaneous practice.
- Sequential Next/Previous navigation for structured, step-by-step daily learning.
- Fully keyboard-accessible interface with native RTL (Right-to-Left) support for Persian text.

### 🎨 Clean, Distraction-Free UI/UX
- Modern, responsive design with subtle gradient backgrounds.
- Smooth micro-interactions and transitions for a premium feel.
- Mobile-first, fully responsive layout for learning on any device.
- Complete RTL optimization ensuring perfect readability for Persian users.

## 🛠️ Tech Stack

| Technology | Version |
|------------|---------|
| Next.js (App Router) | 16.2.6 |
| React | 19.2.4 |
| React DOM | 19.2.4 |
| Tailwind CSS | ^4 |
| TypeScript | ^5 |
| ESLint | ^9 |

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/homayounmmdy/VajehYar
cd VajehYar
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## 🤝 Contributing

This is an **open-source** project strictly focused on lexical education. Community contributions are highly welcome!

### Adding New Entries
1. Fork the repository.
2. Add new vocabulary, idioms, or expressions to `/public/data/lexicon.json`.
3. Maintain the existing JSON structure and ensure the `type` field is correctly set (`vocabulary`, `idiom`, or `expression`).
4. Submit a Pull Request.

### Contribution Guidelines
- Ensure translations are accurate, natural, and culturally appropriate for Persian speakers.
- Provide realistic, modern, and contextual example sentences.
- Include phonetic pronunciation (IPA is highly recommended).
- Keep the focus strictly on educational value (do not add trivia, games, or unrelated content).

## 🎯 Future Roadmap

- [ ] Audio pronunciation for all entries
- [ ] Flashcard mode with Spaced Repetition System (SRS)
- [ ] Thematic categorization (e.g., "Business Idioms", "Daily Expressions")
- [ ] "Word/Idiom of the Day" feature
- [ ] Dark mode toggle
- [ ] Offline support via Progressive Web App (PWA)

## 📧 Support

For bug reports, feature suggestions, or contributions:
- Open an Issue in the repository.
- Submit a Pull Request with your improvements.
- Contact the maintainers directly.

## 📜 License

This project is open-source and available under the **MIT License**.

**Happy Learning! 📚** 
*Master English, one word and expression at a time.*