import re
import numpy as np
import language_tool_python
import textstat
import pandas as pd

# Initialize grammar checker
tool = language_tool_python.LanguageTool('en-US')

# Feature column names in exact training order
FEATURE_COLUMNS = [
    'rater3_domain1', 'rater1_domain2', 'rater2_domain2',
    'rater1_trait1', 'rater1_trait2', 'rater1_trait3', 'rater1_trait4',
    'rater1_trait5', 'rater1_trait6', 'rater2_trait1', 'rater2_trait2',
    'rater2_trait3', 'rater2_trait4', 'rater2_trait5', 'rater2_trait6',
    'rater3_trait1', 'rater3_trait2', 'rater3_trait3', 'rater3_trait4',
    'rater3_trait5', 'rater3_trait6',
    'word_count', 'char_count',
    'flesch_reading_ease', 'gunning_fog', 'smog_index',
    'automated_readability_index'
]

# ========== 1. Preprocessing ==========
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ========== 2. Feature Extraction ==========
def extract_features(text):
    word_count = len(text.split())
    char_count = len(text)
    flesch = textstat.flesch_reading_ease(text)
    gunning = textstat.gunning_fog(text)
    smog = textstat.smog_index(text)
    ari = textstat.automated_readability_index(text)

    readability_features = [
        word_count, char_count, flesch, gunning, smog, ari
    ]

    # Fill missing trait/rater scores with zeros
    zero_padding = [0] * 21  # For 21 missing trait/rater features

    full_features = zero_padding + readability_features
    return full_features

# ========== 3. Grammar Feedback ==========
def grammar_feedback(original_text):
    matches = tool.check(original_text)

    red_spans = [(m.offset, m.offset + m.errorLength) for m in matches]
    green_spans = []
    last_end = 0

    # Create red spans
    highlighted = ""
    for start, end in red_spans:
        if last_end < start:
            green_spans.append((last_end, start))
        highlighted += f'<span style="color:red;">{original_text[start:end]}</span>'
        last_end = end

    if last_end < len(original_text):
        green_spans.append((last_end, len(original_text)))

    final_highlighted = ""
    all_spans = sorted(red_spans + green_spans, key=lambda x: x[0])
    for start, end in all_spans:
        span_text = original_text[start:end]
        color = "red" if (start, end) in red_spans else "green"
        final_highlighted += f'<span style="color:{color};">{span_text}</span>'

        # Feedback messages
    feedback_messages = []
    for m in matches:
        if m.message == "Possible spelling mistake found.":
            suggestion = f"Consider correcting the spelling of '{original_text[m.offset:m.offset + m.errorLength]}'"
            if m.replacements:
                suggestion += f" (e.g., {', '.join(m.replacements[:3])})"
            feedback_messages.append(suggestion)
        else:
            feedback_messages.append(m.message)

    # Remove duplicates
    feedback_messages = list(dict.fromkeys(feedback_messages))

    return final_highlighted, feedback_messages

    #return final_highlighted, [m.message for m in matches]
