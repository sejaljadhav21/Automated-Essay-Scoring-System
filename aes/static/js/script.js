document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('essay-form');
  const essayInput = document.getElementById('essay');
  const scoreDisplay = document.getElementById('score');
  const feedbackDisplay = document.getElementById('feedback');
  const highlightedDisplay = document.getElementById('highlighted');
  const loadingIndicator = document.getElementById('loading'); // 🔹 New: loading spinner container
  const legendDisplay = document.getElementById('legend');
  const themeToggle = document.getElementById('theme-toggle');
  const fileUpload = document.getElementById("file-upload");

  // --- Download Dropdown Toggle ---
  const dropdown = document.querySelector('.dropdown');
  const downloadBtn = document.getElementById('download-btn');

  // Only add dropdown logic if downloadBtn exists
  if (downloadBtn && dropdown) {
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // Optional: Close dropdown after clicking an option
    document.querySelectorAll('.dropdown-content button').forEach(btn => {
      btn.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    });
  }

  // Only add theme toggle if it exists
  if (themeToggle) {
    // Helper to apply theme based on localStorage or system preference
    function applyTheme() {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
      } else {
        // No saved preference: use system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
      }
    }
    
    // Initial apply on page load
    applyTheme();
      // === Load Dark Mode on Page Load (if enabled before) ===
    //if (localStorage.getItem("theme") === "dark") {
     // document.body.classList.add("dark-mode");
   // }

    // === Dark Mode Toggle ===
    //const themeToggle = document.getElementById("theme-toggle");
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });

      // Optional: listen to system preference changes while page is open
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem("theme")) { // only if no manual override
          applyTheme();
        }
      });
    }
  }

  // Only add essay form logic if form exists
  if (form && essayInput && scoreDisplay && feedbackDisplay && highlightedDisplay && loadingIndicator && legendDisplay) {
    // ✨ File Upload Logic (replaces placeholder)
    fileUpload.addEventListener("change", async () => {
      const file = fileUpload.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        if (data.error) {
          alert(data.error);
        } else {
          essayInput.value = data.content;
        }
      } catch (err) {
        alert("Error uploading file.");
      }
    });

    // ✨ Download Button Logic (replaces placeholder)
    window.downloadReport = async function(format) {
      const essay = essayInput.value;
      const score = scoreDisplay.innerText;
      const feedback = feedbackDisplay.innerText;
      const highlighted = highlightedDisplay.innerHTML;
      const legend = legendDisplay.innerText;

      if (!essay) return alert("Essay is empty.");

      const formData = new FormData();
      formData.append('essay', essay);
      formData.append('score', score);
      formData.append('feedback', feedback);
      formData.append('highlighted', highlighted);
      formData.append('legend', legend);

      try {
        const response = await fetch(`/download?format=${format}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to generate report.");

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `essay_report.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        alert("Failed to generate report.");
        console.error(err);
      }
    }

    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const essayText = essayInput.value.trim();

      // 🔹 Clear old content
      scoreDisplay.innerHTML = '';
      feedbackDisplay.innerHTML = '';
      highlightedDisplay.innerHTML = '';
      legendDisplay.innerHTML = '';
      
      // 🔹 Show loading spinner
      loadingIndicator.style.display = 'block';

      const formData = new FormData();
      formData.append('essay', essayText);

      try {
        const res = await fetch('/predict', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        // 🔹 Handle server-side validation responses
        if (data.error) {
          let errorMessage = '';
          if (data.error === 'empty') {
            errorMessage = 'Please enter some text before evaluating.';
          } else if (data.error === 'invalid') {
            errorMessage = 'Invalid entry. Please enter meaningful alphabetic text.';
          } else if (data.error === 'short') {
            errorMessage = 'Your essay is too short. Please write at least 50–100 words.';
          }

          alert(errorMessage);
        } else {
          // 🔹 If valid, show prediction results
          scoreDisplay.innerHTML = `<strong>Predicted Score:</strong> ${data.score}`;
          //feedbackDisplay.innerHTML = `<strong>Feedback:</strong><ul>${data.feedback.map(f => `<li>${f}</li>`).join('')}</ul>`;
          const feedbackItems = data.feedback;
          let feedbackHtml = "<strong>Feedback:</strong><ul id='feedback-list'>";

          const limit = 10;
          const extraCount = feedbackItems.length - limit;

          feedbackItems.slice(0, limit).forEach(f => {
            feedbackHtml += `<li>${f}</li>`;
          });
          feedbackHtml += "</ul>";

          // Add "Show more" if needed
          if (extraCount > 0) {
            feedbackHtml += `
              <button id="show-more-btn" style="margin-top: 10px;">Show ${extraCount} more</button>
              <ul id="extra-feedback" style="display:none;">
                ${feedbackItems.slice(limit).map(f => `<li>${f}</li>`).join("")}
              </ul>
            `;
          }

          feedbackDisplay.innerHTML = feedbackHtml;

          // Add toggle functionality
          const showMoreBtn = document.getElementById("show-more-btn");
          if (showMoreBtn) {
            showMoreBtn.addEventListener("click", () => {
              const extra = document.getElementById("extra-feedback");
              if (extra.style.display === "none") {
                extra.style.display = "block";
                showMoreBtn.textContent = "Show less";
              } else {
                extra.style.display = "none";
                showMoreBtn.textContent = `Show ${extraCount} more`;
              }
            });
          }

          highlightedDisplay.innerHTML = `<strong>Highlighted Essay:</strong>
          <div class="legend-note">
              <span class="red-circle"></span> Red highlight indicates grammar issues.
              <br>
              <span class="green-circle"></span> Green highlight indicates well-structured grammar.
            </div>
        
          <div>${data.highlighted}</div>`;


        
        }
      } catch (error) {
        alert('An error occurred while processing your essay. Please try again.');
        console.error('Fetch error:', error);
      } finally {
        // 🔹 Hide loading spinner
        loadingIndicator.style.display = 'none';
      }
    });
  }

  // Warn on reload/close/tab switch
  if (essayInput) {
    window.addEventListener('beforeunload', function (e) {
      if (essayInput.value.trim() !== "") {
        e.preventDefault();
        e.returnValue = ""; // Show default browser warning
      }
    });

    // Warn on navigation to About/Goal/Essay Grading
    document.querySelectorAll('a[href="/about"], a[href="/goal"], a[href="/"]').forEach(link => {
      link.addEventListener('click', function (e) {
        if (essayInput.value.trim() !== "") {
          const confirmLeave = confirm("Your essay will be lost. Are you sure you want to leave this page?");
          if (!confirmLeave) {
            e.preventDefault();
          }
        }
      });
    });
  }

  // Limit essay input to 500 words
  if (essayInput) {
    essayInput.addEventListener('input', function () {
      const words = essayInput.value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 500) {
        // Trim to 500 words
        essayInput.value = words.slice(0, 500).join(' ');
        alert("Essay cannot exceed 500 words. Please reduce your essay length.");
      }
    });
  }

  // Clear button logic
  const clearBtn = document.getElementById('clear-essay-btn');
  if (clearBtn && essayInput) {
    clearBtn.addEventListener('click', function () {
      if (essayInput.value.trim() !== "") {
        if (confirm("Are you sure you want to clear this essay?")) {
          essayInput.value = "";
        }
      }
    });
  }
});