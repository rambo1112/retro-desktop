export function createTypingTest() {
    // Inject CSS if needed (checking if it exists first to avoid duplicates)
    if (!document.getElementById('css-typing-test')) {
        const link = document.createElement('link');
        link.id = 'css-typing-test'; 
        link.rel = 'stylesheet';
        link.href = './src/apps/typing-test/styles.css';
        document.head.appendChild(link);
    }

    const container = document.createElement('div');
    container.className = 'typing-test-app';

    // Word pools for different difficulties
    const wordPools = {
        easy: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when'],
        medium: ['time', 'person', 'year', 'way', 'day', 'thing', 'man', 'world', 'life', 'hand', 'part', 'child', 'eye', 'woman', 'place', 'work', 'week', 'case', 'point', 'government', 'company', 'number', 'group', 'problem', 'fact', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able'],
        hard: ['according', 'achieve', 'acknowledge', 'acquire', 'administration', 'affect', 'aggressive', 'alternative', 'appropriate', 'assume', 'authority', 'available', 'benefit', 'challenge', 'circumstances', 'communication', 'competition', 'comprehensive', 'conclusion', 'consequence', 'consideration', 'contribution', 'controversial', 'convince', 'demonstrate', 'determination', 'distinction', 'economic', 'efficient', 'emphasis', 'environment', 'establish', 'evidence', 'experience', 'fundamental', 'generation', 'identification', 'implementation', 'independent', 'individual', 'intelligence', 'international', 'interpretation', 'investigation', 'management', 'opportunity', 'particular', 'perspective', 'philosophy', 'responsibility']
    };

    let currentWords = [];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let startTime = null;
    let isTestActive = false;
    let timerInterval = null;
    let mistakes = 0;
    let totalChars = 0;
    let duration = 30; // default 30 seconds
    let difficulty = 'medium';

    function generateWords(count = 50) {
        const pool = wordPools[difficulty];
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return words;
    }

    function renderWords() {
        const wordsContainer = container.querySelector('.typing-words');
        if (!wordsContainer) return;

        wordsContainer.innerHTML = currentWords.map((word, wordIdx) => {
            let wordHtml = '<span class="word';
            if (wordIdx === currentWordIndex) wordHtml += ' active';
            if (wordIdx < currentWordIndex) wordHtml += ' completed';
            wordHtml += '">';

            word.split('').forEach((char, charIdx) => {
                let charClass = 'char';
                if (wordIdx === currentWordIndex && charIdx === currentCharIndex) {
                    charClass += ' cursor';
                }
                wordHtml += `<span class="${charClass}">${char}</span>`;
            });

            wordHtml += '</span> ';
            return wordHtml;
        }).join('');
    }

    function startTest() {
        currentWords = generateWords();
        currentWordIndex = 0;
        currentCharIndex = 0;
        startTime = Date.now();
        isTestActive = true;
        mistakes = 0;
        totalChars = 0;

        renderWords();
        updateStats();
        startTimer();

        const input = container.querySelector('.typing-input');
        if (input) {
            input.disabled = false;
            input.value = '';
            input.focus();
        }
    }

    function startTimer() {
        let elapsed = 0;
        timerInterval = setInterval(() => {
            elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, duration - elapsed);
            
            const timerDisplay = container.querySelector('.timer-display');
            if (timerDisplay) {
                timerDisplay.textContent = remaining;
            }

            if (remaining === 0) {
                endTest();
            }
        }, 100);
    }

    function endTest() {
        isTestActive = false;
        clearInterval(timerInterval);

        const input = container.querySelector('.typing-input');
        if (input) input.disabled = true;

        const elapsed = (Date.now() - startTime) / 1000;
        const wpm = Math.round((totalChars / 5) / (elapsed / 60));
        const accuracy = totalChars > 0 ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 0;

        showResults(wpm, accuracy);
    }

    function showResults(wpm, accuracy) {
        const resultsDiv = container.querySelector('.typing-results');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = `
                <div class="result-title">Test Complete!</div>
                <div class="result-stats">
                    <div class="result-stat">
                        <div class="stat-value">${wpm}</div>
                        <div class="stat-label">WPM</div>
                    </div>
                    <div class="result-stat">
                        <div class="stat-value">${accuracy}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="result-stat">
                        <div class="stat-value">${totalChars}</div>
                        <div class="stat-label">Characters</div>
                    </div>
                </div>
            `;
        }
    }

    function updateStats() {
        const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        const wpm = elapsed > 0 ? Math.round((totalChars / 5) / (elapsed / 60)) : 0;
        const accuracy = totalChars > 0 ? Math.round(((totalChars - mistakes) / totalChars) * 100) : 100;

        const wpmDisplay = container.querySelector('.stat-wpm');
        const accDisplay = container.querySelector('.stat-accuracy');

        if (wpmDisplay) wpmDisplay.textContent = `${wpm} WPM`;
        if (accDisplay) accDisplay.textContent = `${accuracy}% Accuracy`;
    }

    function handleInput(e) {
        if (!isTestActive) return;

        const input = e.target;
        const typed = input.value;
        const currentWord = currentWords[currentWordIndex];

        // Check if word is complete
        if (typed.endsWith(' ')) {
            const typedWord = typed.trim();
            
            // Mark characters as correct/incorrect
            const wordElement = container.querySelectorAll('.word')[currentWordIndex];
            const chars = wordElement.querySelectorAll('.char');
            
            for (let i = 0; i < currentWord.length; i++) {
                if (i < typedWord.length) {
                    if (typedWord[i] === currentWord[i]) {
                        chars[i].classList.add('correct');
                        totalChars++;
                    } else {
                        chars[i].classList.add('incorrect');
                        mistakes++;
                        totalChars++;
                    }
                } else {
                    chars[i].classList.add('incorrect');
                    mistakes++;
                    totalChars++;
                }
            }

            // Extra characters
            if (typedWord.length > currentWord.length) {
                mistakes += typedWord.length - currentWord.length;
                totalChars += typedWord.length - currentWord.length;
            }

            currentWordIndex++;
            currentCharIndex = 0;
            input.value = '';

            if (currentWordIndex >= currentWords.length) {
                endTest();
            } else {
                renderWords();
                updateStats();
            }
        } else {
            // Update current character cursor
            currentCharIndex = typed.length;
            renderWords();
            updateStats();
        }
    }

    function resetTest() {
        isTestActive = false;
        clearInterval(timerInterval);
        
        const resultsDiv = container.querySelector('.typing-results');
        if (resultsDiv) resultsDiv.style.display = 'none';

        const input = container.querySelector('.typing-input');
        if (input) {
            input.disabled = true;
            input.value = '';
        }

        currentWords = generateWords();
        currentWordIndex = 0;
        currentCharIndex = 0;
        startTime = null;
        mistakes = 0;
        totalChars = 0;

        const timerDisplay = container.querySelector('.timer-display');
        if (timerDisplay) timerDisplay.textContent = duration;

        const wpmDisplay = container.querySelector('.stat-wpm');
        const accDisplay = container.querySelector('.stat-accuracy');
        if (wpmDisplay) wpmDisplay.textContent = '0 WPM';
        if (accDisplay) accDisplay.textContent = '100% Accuracy';

        renderWords();
    }

    // Initial render
    container.innerHTML = `
        <div class="typing-header">
            <div class="typing-controls">
                <select class="duration-select">
                    <option value="15">15s</option>
                    <option value="30" selected>30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                </select>
                <select class="difficulty-select">
                    <option value="easy">Easy</option>
                    <option value="medium" selected>Medium</option>
                    <option value="hard">Hard</option>
                </select>
                <button class="reset-btn">↻ Reset</button>
            </div>
            <div class="typing-stats">
                <div class="timer-container">
                    <div class="timer-label">Time</div>
                    <div class="timer-display">30</div>
                </div>
                <div class="stat-wpm">0 WPM</div>
                <div class="stat-accuracy">100% Accuracy</div>
            </div>
        </div>
        <div class="typing-area">
            <div class="typing-words"></div>
            <input type="text" class="typing-input" placeholder="Click here or press any key to start...">
        </div>
        <div class="typing-results" style="display: none;"></div>
    `;

    // Setup event listeners
    const input = container.querySelector('.typing-input');
    const resetBtn = container.querySelector('.reset-btn');
    const durationSelect = container.querySelector('.duration-select');
    const difficultySelect = container.querySelector('.difficulty-select');

    input.addEventListener('input', handleInput);
    input.addEventListener('click', () => {
        if (!isTestActive && !startTime) {
            startTest();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (!isTestActive && !startTime && e.key.length === 1) {
            startTest();
        }
    });

    resetBtn.addEventListener('click', () => {
        resetTest();
    });

    durationSelect.addEventListener('change', (e) => {
        duration = parseInt(e.target.value);
        resetTest();
    });

    difficultySelect.addEventListener('change', (e) => {
        difficulty = e.target.value;
        resetTest();
    });

    // Initialize
    currentWords = generateWords();
    renderWords();

    return container;
}
