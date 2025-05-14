document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const landingContainer = document.getElementById('landing-container');
    const quizContainer = document.getElementById('quiz-container');
    const resultsContainer = document.getElementById('results-container');
    const questionContainer = document.getElementById('question-container');
    const progressBar = document.getElementById('progress');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const recommendationsDiv = document.getElementById('recommendations');
    const twitterShareBtn = document.getElementById('twitter-share');

    // Quiz Questions
    const questions = [
        {
            question: '今のあなたの気持ちに近いのは？',
            options: [
                '時間がないけど何か始めたい！',
                'クリエイティブなことをしてみたい',
                '効率よく副収入がほしい',
                'とにかくAIを触ってみたい！'
            ]
        },
        {
            question: '得意・興味があるのは？',
            options: [
                '文章を書く',
                'イラスト・デザイン',
                'アイデア出し',
                'プログラミング・分析'
            ]
        },
        {
            question: 'やってみたい副業スタイルは？',
            options: [
                'ブログや情報発信',
                'LINEスタンプやグッズ制作',
                'SNS運用・ライティング',
                'ツール開発・自動化'
            ]
        },
        {
            question: 'どんなAIツールにワクワクする？',
            options: [
                '話し相手・質問に答えてくれるAI',
                '画像やイラストを作るAI',
                '資料作成や時短に役立つAI',
                'コードを生成したりアプリを作れるAI'
            ]
        }
    ];

    // Results based on most frequent answer
    const results = {
        'A': {
            tool: 'ChatGPT',
            reason: '時間がなくても対話型で気軽に始められます',
            useCase: 'ブログ作成、アイデア出し、SNS運用',
            shareText: '私はChatGPTが向いてるらしい！#AIツール診断ナビ'
        },
        'B': {
            tool: 'Midjourney / Canva',
            reason: '画像・デザイン制作が得意な方にぴったり',
            useCase: 'SUZURIやLINEスタンプ、SNS用画像作成',
            shareText: '私はMidjourney / Canvaが向いてるらしい！#AIツール診断ナビ'
        },
        'C': {
            tool: 'Notion AI / SlidesAI',
            reason: '文章・構成力を活かして効率的に稼げます',
            useCase: '資料作成、SNS要約、コンテンツ発信',
            shareText: '私はNotion AI / SlidesAIが向いてるらしい！#AIツール診断ナビ'
        },
        'D': {
            tool: 'Windsurf',
            reason: 'アプリ開発やコード生成が得意な人に最適',
            useCase: 'GPTアプリ開発、ツール販売、業務自動化',
            shareText: '私はWindsurfが向いてるらしい！#AIツール診断ナビ'
        }
    };

    // Quiz state
    let currentQuestionIndex = 0;
    const userAnswers = [-1, -1, -1, -1]; // -1 means unanswered

    // Initialize quiz
    function initQuiz() {
        // Reset state
        currentQuestionIndex = 0;
        userAnswers.fill(-1);
        
        // Update UI
        updateProgressBar();
        showQuestion();
        
        // Reset buttons
        prevBtn.disabled = true;
        nextBtn.textContent = '次へ';
    }

    // Show current question
    function showQuestion() {
        // Clear previous question
        questionContainer.innerHTML = '';
        
        // Create question element
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        // Add question title
        const questionTitle = document.createElement('h2');
        questionTitle.textContent = `Q${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}`;
        questionDiv.appendChild(questionTitle);
        
        // Add options
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        // Option letters
        const optionLetters = ['A', 'B', 'C', 'D'];
        
        // Create each option
        questions[currentQuestionIndex].options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            if (userAnswers[currentQuestionIndex] === index) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.textContent = `${optionLetters[index]}. ${option}`;
            
            // Add click event
            optionDiv.addEventListener('click', () => {
                selectOption(index);
            });
            
            optionsDiv.appendChild(optionDiv);
        });
        
        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);
    }

    // Select an option
    function selectOption(optionIndex) {
        userAnswers[currentQuestionIndex] = optionIndex;
        
        // Update UI to show selected option
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Enable next button if an option is selected
        nextBtn.disabled = false;
    }

    // Update progress bar
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Calculate result based on most frequent answer
    function calculateResult() {
        // Convert numerical answers to letters (0=A, 1=B, 2=C, 3=D)
        const letterAnswers = userAnswers.map(answer => {
            return ['A', 'B', 'C', 'D'][answer];
        });
        
        // Count frequency of each letter
        const frequency = {
            'A': 0,
            'B': 0,
            'C': 0,
            'D': 0
        };
        
        letterAnswers.forEach(letter => {
            frequency[letter]++;
        });
        
        // Find most frequent letter
        let maxFrequency = 0;
        let resultLetter = 'A'; // Default
        
        for (const letter in frequency) {
            if (frequency[letter] > maxFrequency) {
                maxFrequency = frequency[letter];
                resultLetter = letter;
            }
        }
        
        return resultLetter;
    }

    // Show result
    function showResult() {
        const resultLetter = calculateResult();
        const result = results[resultLetter];
        
        // Clear previous recommendations
        recommendationsDiv.innerHTML = '';
        
        // Create recommendation element
        const recommendationDiv = document.createElement('div');
        recommendationDiv.className = 'recommendation';
        
        // Add tool name
        const toolName = document.createElement('h3');
        toolName.textContent = result.tool;
        recommendationDiv.appendChild(toolName);
        
        // Add reason
        const reasonPara = document.createElement('p');
        reasonPara.textContent = `理由：${result.reason}`;
        recommendationDiv.appendChild(reasonPara);
        
        // Add use case
        const useCasePara = document.createElement('p');
        useCasePara.className = 'use-case';
        useCasePara.textContent = `活用例：${result.useCase}`;
        recommendationDiv.appendChild(useCasePara);
        
        // Add to recommendations
        recommendationsDiv.appendChild(recommendationDiv);
        
        // Update Twitter share link
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(result.shareText);
        twitterShareBtn.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    }

    // Event Listeners
    startBtn.addEventListener('click', () => {
        landingContainer.classList.remove('active');
        quizContainer.classList.add('active');
        initQuiz();
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            // Go to next question
            currentQuestionIndex++;
            updateProgressBar();
            showQuestion();
            
            // Update buttons
            prevBtn.disabled = false;
            
            // Disable next button until an option is selected
            if (userAnswers[currentQuestionIndex] === -1) {
                nextBtn.disabled = true;
            }
            
            // Change next button text on last question
            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.textContent = '結果を見る';
            }
        } else {
            // Show results
            quizContainer.classList.remove('active');
            resultsContainer.classList.add('active');
            showResult();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            // Go to previous question
            currentQuestionIndex--;
            updateProgressBar();
            showQuestion();
            
            // Update buttons
            nextBtn.textContent = '次へ';
            nextBtn.disabled = false;
            
            if (currentQuestionIndex === 0) {
                prevBtn.disabled = true;
            }
        }
    });

    restartBtn.addEventListener('click', () => {
        // Reset quiz
        resultsContainer.classList.remove('active');
        quizContainer.classList.add('active');
        initQuiz();
    });

    // Initialize landing page
    landingContainer.classList.add('active');
});
