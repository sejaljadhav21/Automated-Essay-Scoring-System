# Automated Essay Scoring System

## Overview
The Automated Essay Scoring (AES) System is an AI-powered application designed to automatically evaluate and score essays written in educational contexts. By leveraging natural language processing (NLP) and deep learning techniques, this system mimics human judgment to provide accurate, consistent, and fair essay scoring along with constructive feedback to enhance users' writing skills.

This repository contains the full project including the trained LSTM-based scoring model, data preprocessing and feature engineering workflows, and a user-friendly Flask web application interface for real-time essay evaluation.

---

## Features

- **Automated Essay Scoring**: Uses a deep learning LSTM model trained on a large essay dataset to predict scores reflecting grammar, coherence, vocabulary, and content.
- **Grammar and Readability Analysis**: Integrates grammar error detection and multiple readability metrics to provide informative feedback.
- **User-Friendly Web Interface**: Allows essay text input or DOCX file upload for scoring and displays detailed score, feedback highlights, and suggestions.
- **Downloadable Reports**: Generates color-coded feedback reports in PDF and DOCX format for offline review.
- **Real-time Input Validation**: Enforces word limits and prevents empty submissions.
- **Advanced Linguistic Features**: Incorporates tokenization, word embeddings (Word2Vec), and sequence padding for improved scoring accuracy.
- **Multiformat Support**: Handles multiple essay formats and file types.
- **Robust Deployment**: Deployed on Hugging Face Spaces using Docker container for easy access and demonstration.

---

## Project Architecture

- **Frontend**
  - HTML/CSS/JavaScript for responsive and accessible UI
  - Essay input area with word count and clear controls
  - Score and feedback display with dynamic highlights
- **Backend**
  - Flask server handling HTTP requests
  - PyTorch for loading and running the trained LSTM model
  - Text preprocessing (cleaning, grammar detection, readability scoring)
  - Feedback generation via LanguageTool and custom utilities
  - File upload and document generation (python-docx, ReportLab)
- **Core Model**
  - LSTM neural network with 2 layers and dropout, trained with MSE loss
  - Word2Vec embeddings as input representations
  - Model evaluation metrics: MSE ~5.21, R² ~0.93

---

## Technology Stack

- Python 3.12.1
- Flask
- PyTorch
- Word2Vec (Gensim)
- LanguageTool (with Java OpenJDK 17)
- numpy, pandas
- python-docx, ReportLab, BeautifulSoup
- JavaScript / HTML / CSS
- Docker for containerized deployment

---

## Getting Started

### Prerequisites

- Python 3.12+
- Java Runtime Environment (OpenJDK 17+) for LanguageTool
- Git
- Docker (optional, for containerized deployment)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/automated-essay-scoring.git
   cd automated-essay-scoring
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure Java is installed and accessible via command line (`java -version`).

### Running Locally

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

Open your browser at [http://localhost:5000](http://localhost:5000) to start using the app.

---

## Usage

- **Submit Essay:** Enter text directly or upload a DOCX file.
- **Receive Score:** The model scores the essay instantly.
- **View Feedback:** Detailed grammar and readability insights with highlighted issues.
- **Download Report:** Get your feedback in PDF or DOCX form for offline access.
- **Limitations:** Essay input is limited to 500 words for optimal performance.

---

## Project Structure

```
/
├── app.py                  # Flask backend
├── model/                  # Trained LSTM model and tokenizer
├── static/                 # CSS, JS, images for frontend
├── templates/              # HTML templates rendered by Flask
├── utils/                  # Preprocessing, feature extraction, feedback utilities
├── Dockerfile              # Docker config for container deployment
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation (this file)
```

---

## Testing & Validation

- Functional testing of essay submission, file handling, and score feedback.
- Model tested on diverse essays showing reliable scoring with an MSE of 5.21 and R² of 0.93.
- Validated downloadable report formats and UI behaviors.
- Edge cases such as empty input, word limit exceedance, and UI warnings are handled gracefully.

---

## Challenges

- Intensive model training requiring GPU resources.
- Integration of Java-based LanguageTool across environments.
- Synchronization of frontend JavaScript and backend Flask asynchronous processes.

---

## License

This project is licensed under the GNU License.

---

## Acknowledgements

- Kaggle HP Essays Dataset used for model training.
- Open-source libraries: PyTorch, Flask, LanguageTool, Word2Vec.
- DHOLE PATIL COLLEGE OF ENGINEERING for project supervision and guidance.

---

---

Thank you for exploring the Automated Essay Scoring System. Feel free to contribute.


```
