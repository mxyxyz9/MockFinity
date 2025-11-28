<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="MockFinity Banner" width="100%" />

  # MockFinity
  
  **AI-Powered Marketing Asset Generator**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🚀 Overview

**MockFinity** is a cutting-edge web application that transforms standard product images into high-fidelity marketing assets using the power of Google's Gemini API. Designed for marketers, designers, and creators, it streamlines the workflow of generating professional-grade visuals with a sleek, modern interface.

## ✨ Features

- **🎨 Smart Generation**: Leverage the Gemini API to generate context-aware marketing backgrounds and scenarios while preserving product identity.
- **🖼️ Integrated Image Editor**: Fine-tune your source images with built-in editing tools before generation.
- **🌓 Adaptive Theme**: Seamlessly switch between a clean Light mode and a sophisticated Dark mode.
- **📱 Fully Responsive**: A premium experience across all devices, from desktop to mobile.
- **⚡ Real-time Processing**: Instant feedback and fast generation times.
- **💾 Gallery & History**: View, expand, and download your generated assets easily.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google GenAI SDK](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

Follow these steps to get MockFinity running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- A **Google Gemini API Key** (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mxyxyz9/MockFinity.git
    cd MockFinity
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
    *(Note: Ensure your code uses the correct environment variable name. Based on standard Vite practices, it should be prefixed with `VITE_` if accessed on the client-side, or usage logic should be verified.)*

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 📖 Usage

1.  **Upload Source**: Drag and drop or select a product image in the "Source Asset" panel.
2.  **Edit (Optional)**: Click the edit icon to crop or adjust your source image.
3.  **Configure Generation**:
    - Enter a prompt describing the desired setting (e.g., "on a wooden table in a sunny cafe").
    - Select an aspect ratio.
4.  **Generate**: Click "Generate" and watch the magic happen.
5.  **Download**: Expand any result from the gallery to view in high resolution and download.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by the MockFinity Team</sub>
</div>
