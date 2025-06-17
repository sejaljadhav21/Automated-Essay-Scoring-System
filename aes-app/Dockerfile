FROM python:3.12.1-slim

# Install Java (OpenJDK 17 — safe & works with language_tool_python)
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get clean

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"
ENV XDG_CACHE_HOME=/tmp/.cache
ENV HOME=/tmp

# Make cache dir writable
RUN mkdir -p /tmp/.cache && chmod -R 777 /tmp/.cache

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install "setuptools<81"
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860
ENV PORT=7860

CMD gunicorn --bind 0.0.0.0:$PORT --log-level=debug app:app
