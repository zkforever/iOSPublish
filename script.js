document.addEventListener('DOMContentLoaded', function() {
    const problemElement = document.getElementById('problem');
    const problemTypeElement = document.getElementById('problemType');
    const answerInput = document.getElementById('answer');
    const fractionInput = document.getElementById('fractionInput');
    const numeratorInput = document.getElementById('numerator');
    const denominatorInput = document.getElementById('denominator');
    const fractionTextInput = document.getElementById('fractionTextInput');
    const feedbackElement = document.getElementById('feedback');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    const restartBtn = document.getElementById('restartBtn');
    const progressElement = document.getElementById('progress');
    const scoreElement = document.getElementById('score');
    const totalTimerElement = document.getElementById('totalTimer');
    
    // 浮动设置面板相关元素
    const floatingSettingsBtn = document.getElementById('floatingSettingsBtn');
    const floatingSettingsPanel = document.getElementById('floatingSettingsPanel');
    const floatingMinValue = document.getElementById('floatingMinValue');
    const floatingMaxValue = document.getElementById('floatingMaxValue');
    const floatingResultMaxValue = document.getElementById('floatingResultMaxValue');
    const floatingMinLength = document.getElementById('floatingMinLength');
    const floatingMaxLength = document.getElementById('floatingMaxLength');
    const floatingAllowNegative = document.getElementById('floatingAllowNegative');
    const floatingAllowRemainder = document.getElementById('floatingAllowRemainder');
    const floatingSaveSettingsBtn = document.getElementById('floatingSaveSettingsBtn');
    
    // 设置锁定相关元素
    const settingsPasswordInput = document.getElementById('settingsPasswordInput');
    const settingsUnlockBtn = document.getElementById('settingsUnlockBtn');
    const settingsLockBtn = document.getElementById('settingsLockBtn');
    const settingsLockMsg = document.getElementById('settingsLockMsg');
    let settingsLocked = true;

    function setSettingsInputsDisabled(disabled) {
        floatingMinValue.disabled = disabled;
        floatingMaxValue.disabled = disabled;
        floatingResultMaxValue.disabled = disabled;
        floatingMinLength.disabled = disabled;
        floatingMaxLength.disabled = disabled;
        floatingAllowNegative.disabled = disabled;
        floatingAllowRemainder.disabled = disabled;
        floatingSaveSettingsBtn.disabled = disabled;
        
        if (disabled) {
            floatingMinValue.classList.add('opacity-50', 'cursor-not-allowed');
            floatingMaxValue.classList.add('opacity-50', 'cursor-not-allowed');
            floatingResultMaxValue.classList.add('opacity-50', 'cursor-not-allowed');
            floatingMinLength.classList.add('opacity-50', 'cursor-not-allowed');
            floatingMaxLength.classList.add('opacity-50', 'cursor-not-allowed');
            floatingAllowNegative.classList.add('opacity-50', 'cursor-not-allowed');
            floatingAllowRemainder.classList.add('opacity-50', 'cursor-not-allowed');
            floatingSaveSettingsBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            floatingMinValue.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingMaxValue.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingResultMaxValue.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingMinLength.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingMaxLength.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingAllowNegative.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingAllowRemainder.classList.remove('opacity-50', 'cursor-not-allowed');
            floatingSaveSettingsBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // 初始化设置输入框状态
    setSettingsInputsDisabled(settingsLocked);

    // 解锁设置
    settingsUnlockBtn.addEventListener('click', function() {
        const password = settingsPasswordInput.value;
        if (password === '123456') {
            settingsLocked = false;
            setSettingsInputsDisabled(false);
            settingsLockMsg.textContent = '设置已解锁';
            settingsLockMsg.className = 'text-green-600 text-sm mt-2';
            settingsPasswordInput.value = '';
        } else {
            settingsLockMsg.textContent = '密码错误';
            settingsLockMsg.className = 'text-red-600 text-sm mt-2';
        }
    });

    // 锁定设置
    settingsLockBtn.addEventListener('click', function() {
        settingsLocked = true;
        setSettingsInputsDisabled(true);
        settingsLockMsg.textContent = '设置已锁定';
        settingsLockMsg.className = 'text-gray-600 text-sm mt-2';
    });

    // 错题本相关元素
    const floatingWrongBtn = document.getElementById('floatingWrongBtn');
    const floatingWrongPanel = document.getElementById('floatingWrongPanel');
    const floatingWrongList = document.getElementById('floatingWrongList');
    const floatingClearWrongBtn = document.getElementById('floatingClearWrongBtn');
    const floatingWrongCount = document.getElementById('floatingWrongCount');
    
    // 排行榜相关元素
    const floatingLeaderboardBtn = document.getElementById('floatingLeaderboardBtn');
    const floatingLeaderboardPanel = document.getElementById('floatingLeaderboardPanel');
    const currentScore = document.getElementById('currentScore');
    const leaderboardList = document.getElementById('leaderboardList');
    const clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');

    let score = 0;
    let currentQuestion = 0;
    let totalQuestions = 10;
    let currentAnswer = 0;
    let currentAnswerText = '';
    let currentProblemType = '';
    let selectedType = 'all';
    let wrongQuestions = [];
    
    // 计时相关变量
    let gameStartTime = null;
    let questionStartTime = null;
    let currentSessionTimes = [];
    let leaderboardData = [];
    let totalTimerInterval = null;
    
    // 从localStorage加载错题本数据
    try {
        const savedWrongQuestions = localStorage.getItem('wrongQuestions');
        if (savedWrongQuestions) {
            wrongQuestions = JSON.parse(savedWrongQuestions);
        }
    } catch (e) {
        console.error('加载错题本数据失败:', e);
        wrongQuestions = [];
    }
    
    // 从localStorage加载排行榜数据
    try {
        const savedLeaderboardData = localStorage.getItem('leaderboardData');
        if (savedLeaderboardData) {
            leaderboardData = JSON.parse(savedLeaderboardData);
        }
    } catch (e) {
        console.error('加载排行榜数据失败:', e);
        leaderboardData = [];
    }

    // 更新错题本显示
    function updateWrongQuestionsDisplay() {
        floatingWrongCount.textContent = wrongQuestions.length;
        
        if (wrongQuestions.length === 0) {
            floatingWrongList.innerHTML = '<p class=\"text-center text-gray-500 italic\">暂无错题</p>';
        } else {
            floatingWrongList.innerHTML = wrongQuestions.map((item, index) => `
                <div class=\"mb-3 p-3 bg-red-50 rounded-lg border border-red-200\">
                    <div class=\"font-medium text-red-800\">${item.problem}</div>
                    <div class=\"text-sm text-red-600 mt-1\">正确答案: ${item.correctAnswer}</div>
                    <div class=\"text-sm text-red-500\">你的答案: ${item.userAnswer}</div>
                    <div class=\"text-xs text-gray-500 mt-1\">${item.timestamp}</div>
                </div>
            `).join('');
        }
    }

    // 保存错题本数据到localStorage
    function saveWrongQuestions() {
        try {
            localStorage.setItem('wrongQuestions', JSON.stringify(wrongQuestions));
        } catch (e) {
            console.error('保存错题本数据失败:', e);
        }
    }
    
    // 保存排行榜数据到localStorage
    function saveLeaderboardData() {
        try {
            localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
        } catch (e) {
            console.error('保存排行榜数据失败:', e);
        }
    }

    // 添加错题
    function addWrongQuestion(problem, correctAnswer, userAnswer, type) {
        const wrongQuestion = {
            problem: problem,
            correctAnswer: correctAnswer,
            userAnswer: userAnswer,
            type: type,
            timestamp: new Date().toLocaleString()
        };
        
        wrongQuestions.unshift(wrongQuestion);
        
        // 限制错题本最多保存50题
        if (wrongQuestions.length > 50) {
            wrongQuestions = wrongQuestions.slice(0, 50);
        }
        
        saveWrongQuestions();
        updateWrongQuestionsDisplay();
    }

    // 清空错题本
    floatingClearWrongBtn.addEventListener('click', function() {
        if (confirm('确定要清空错题本吗？')) {
            wrongQuestions = [];
            saveWrongQuestions();
            updateWrongQuestionsDisplay();
        }
    });

    // 更新排行榜显示
    function updateLeaderboardDisplay() {
        // 显示本次成绩
        if (currentSessionTimes.length > 0) {
            const totalTime = currentSessionTimes.reduce((sum, time) => sum + time, 0);
            const avgTime = totalTime / currentSessionTimes.length;
            const totalTimeFormatted = formatTime(totalTime);
            const avgTimeFormatted = formatTime(avgTime);
            
            currentScore.innerHTML = `
                <div class=\"text-center\">
                    <div class=\"text-lg font-bold text-yellow-700\">得分: ${score}/${totalQuestions}</div>
                    <div class=\"text-sm text-gray-600 mt-1\">总用时: ${totalTimeFormatted}</div>
                    <div class=\"text-sm text-gray-600\">平均用时: ${avgTimeFormatted}</div>
                </div>
            `;
        } else {
            currentScore.innerHTML = '<div class=\"text-center text-gray-500 italic\">暂无成绩</div>';
        }
        
        // 显示历史排行榜
        if (leaderboardData.length === 0) {
            leaderboardList.innerHTML = '<div class=\"text-center text-gray-500 italic\">暂无历史记录</div>';
        } else {
            // 按平均用时排序
            const sortedData = [...leaderboardData].sort((a, b) => a.avgTime - b.avgTime);
            
            leaderboardList.innerHTML = sortedData.slice(0, 10).map((item, index) => {
                const totalTimeFormatted = formatTime(item.totalTime);
                const avgTimeFormatted = formatTime(item.avgTime);
                const rankClass = index === 0 ? 'bg-yellow-100 border-yellow-300' : 
                                 index === 1 ? 'bg-gray-100 border-gray-300' : 
                                 index === 2 ? 'bg-orange-100 border-orange-300' : 
                                 'bg-white border-gray-200';
                const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                
                return `
                    <div class=\"mb-2 p-3 rounded-lg border ${rankClass}\">
                        <div class=\"flex justify-between items-center\">
                            <div class=\"font-medium\">${rankIcon} ${item.score}/${item.totalQuestions}</div>
                            <div class=\"text-sm text-gray-600\">${item.timestamp}</div>
                        </div>
                        <div class=\"text-sm text-gray-600 mt-1\">
                            总用时: ${totalTimeFormatted} | 平均: ${avgTimeFormatted}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 格式化时间显示
    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}分${remainingSeconds}秒`;
        } else {
            return `${remainingSeconds}秒`;
        }
    }

    // 添加排行榜记录
    function addLeaderboardRecord() {
        if (currentSessionTimes.length === 0) return;
        
        const totalTime = currentSessionTimes.reduce((sum, time) => sum + time, 0);
        const avgTime = totalTime / currentSessionTimes.length;
        
        const record = {
            score: score,
            totalQuestions: totalQuestions,
            totalTime: totalTime,
            avgTime: avgTime,
            timestamp: new Date().toLocaleString()
        };
        
        leaderboardData.push(record);
        
        // 限制排行榜最多保存100条记录
        if (leaderboardData.length > 100) {
            leaderboardData.sort((a, b) => a.avgTime - b.avgTime);
            leaderboardData = leaderboardData.slice(0, 100);
        }
        
        saveLeaderboardData();
        updateLeaderboardDisplay();
    }

    // 清空排行榜
    clearLeaderboardBtn.addEventListener('click', function() {
        if (confirm('确定要清空排行榜记录吗？')) {
            leaderboardData = [];
            saveLeaderboardData();
            updateLeaderboardDisplay();
        }
    });

    // 初始化显示
    updateWrongQuestionsDisplay();
    updateLeaderboardDisplay();

    // 设置相关变量
    let minValue = 1;
    let maxValue = 100;
    let resultMaxValue = 200;
    let minLength = 2;
    let maxLength = 4;
    let allowNegative = false;
    let allowRemainder = false;

    // 从localStorage加载设置
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('mathSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                minValue = settings.minValue || 1;
                maxValue = settings.maxValue || 100;
                resultMaxValue = settings.resultMaxValue || 200;
                minLength = settings.minLength || 2;
                maxLength = settings.maxLength || 4;
                allowNegative = settings.allowNegative || false;
                allowRemainder = settings.allowRemainder || false;
                selectedType = settings.selectedType || 'all';
                
                // 更新UI
                floatingMinValue.value = minValue;
                floatingMaxValue.value = maxValue;
                floatingResultMaxValue.value = resultMaxValue;
                floatingMinLength.value = minLength;
                floatingMaxLength.value = maxLength;
                floatingAllowNegative.checked = allowNegative;
                floatingAllowRemainder.checked = allowRemainder;
                
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
    }

    // 保存设置到localStorage
    function saveSettings() {
        try {
            const settings = {
                minValue: minValue,
                maxValue: maxValue,
                resultMaxValue: resultMaxValue,
                minLength: minLength,
                maxLength: maxLength,
                allowNegative: allowNegative,
                allowRemainder: allowRemainder,
                selectedType: selectedType
            };
            localStorage.setItem('mathSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }

    // 加载设置
    loadSettings();

    // 保存浮动设置
    floatingSaveSettingsBtn.addEventListener('click', function() {
        if (settingsLocked) return;
        
        minValue = parseInt(floatingMinValue.value) || 1;
        maxValue = parseInt(floatingMaxValue.value) || 100;
        resultMaxValue = parseInt(floatingResultMaxValue.value) || 200;
        minLength = parseInt(floatingMinLength.value) || 2;
        maxLength = parseInt(floatingMaxLength.value) || 4;
        allowNegative = floatingAllowNegative.checked;
        allowRemainder = floatingAllowRemainder.checked;
        
        // 验证设置
        if (minValue >= maxValue) {
            alert('最小值必须小于最大值');
            return;
        }
        if (minLength >= maxLength) {
            alert('最小长度必须小于最大长度');
            return;
        }
        
        saveSettings();
        alert('设置已保存');
        floatingSettingsPanel.classList.remove('active');
    });

    // 浮动按钮事件
    floatingSettingsBtn.addEventListener('click', function() {
        floatingSettingsPanel.classList.toggle('active');
        floatingWrongPanel.classList.remove('active');
        floatingLeaderboardPanel.classList.remove('active');
    });

    floatingWrongBtn.addEventListener('click', function() {
        floatingWrongPanel.classList.toggle('active');
        floatingSettingsPanel.classList.remove('active');
        floatingLeaderboardPanel.classList.remove('active');
    });

    floatingLeaderboardBtn.addEventListener('click', function() {
        floatingLeaderboardPanel.classList.toggle('active');
        floatingSettingsPanel.classList.remove('active');
        floatingWrongPanel.classList.remove('active');
    });

    // 生成随机数
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 生成加法题目
    function generateAddition() {
        let a, b, result;
        do {
            a = getRandomInt(minValue, maxValue);
            b = getRandomInt(minValue, maxValue);
            result = a + b;
        } while (result > resultMaxValue);
        
        return {
            problem: `${a} + ${b} = ?`,
            answer: result,
            answerText: result.toString(),
            type: '加法'
        };
    }

    // 生成减法题目
    function generateSubtraction() {
        let a, b, result;
        do {
            a = getRandomInt(minValue, maxValue);
            b = getRandomInt(minValue, maxValue);
            
            if (!allowNegative && a < b) {
                [a, b] = [b, a]; // 交换，确保结果为正
            }
            
            result = a - b;
        } while (!allowNegative && result < 0);
        
        return {
            problem: `${a} - ${b} = ?`,
            answer: result,
            answerText: result.toString(),
            type: '减法'
        };
    }

    // 生成乘法题目
    function generateMultiplication() {
        let a, b, result;
        do {
            a = getRandomInt(minValue, Math.min(maxValue, 20)); // 限制乘法的数值范围
            b = getRandomInt(minValue, Math.min(maxValue, 20));
            result = a * b;
        } while (result > resultMaxValue);
        
        return {
            problem: `${a} × ${b} = ?`,
            answer: result,
            answerText: result.toString(),
            type: '乘法'
        };
    }

    // 生成除法题目
    function generateDivision() {
        let a, b, result, remainder;
        
        do {
            b = getRandomInt(Math.max(2, minValue), Math.min(maxValue, 20)); // 除数不为1，避免太简单
            result = getRandomInt(minValue, Math.min(maxValue, 50));
            a = b * result; // 确保能整除
            remainder = 0;
            
            if (allowRemainder && Math.random() < 0.3) { // 30%概率有余数
                remainder = getRandomInt(1, b - 1);
                a += remainder;
            }
        } while (a > resultMaxValue);
        
        if (remainder === 0) {
            return {
                problem: `${a} ÷ ${b} = ?`,
                answer: result,
                answerText: result.toString(),
                type: '除法'
            };
        } else {
            return {
                problem: `${a} ÷ ${b} = ? ... ?`,
                answer: [result, remainder],
                answerText: `${result}余${remainder}`,
                type: '除法(有余数)'
            };
        }
    }

    // 生成分数加法题目
    function generateFractionAddition() {
        let a1, b1, a2, b2;
        
        // 生成两个分数
        do {
            a1 = getRandomInt(1, 10);
            b1 = getRandomInt(2, 12);
            a2 = getRandomInt(1, 10);
            b2 = getRandomInt(2, 12);
        } while (a1 >= b1 || a2 >= b2); // 确保都是真分数
        
        // 计算结果
        const numerator = a1 * b2 + a2 * b1;
        const denominator = b1 * b2;
        
        // 化简分数
        const gcd = getGCD(numerator, denominator);
        const simplifiedNumerator = numerator / gcd;
        const simplifiedDenominator = denominator / gcd;
        
        return {
            problem: `<span class="fraction"><span class="fraction-top">${a1}</span><span class="fraction-bottom">${b1}</span></span> + <span class="fraction"><span class="fraction-top">${a2}</span><span class="fraction-bottom">${b2}</span></span> = ?`,
            answer: [simplifiedNumerator, simplifiedDenominator],
            answerText: simplifiedDenominator === 1 ? simplifiedNumerator.toString() : `${simplifiedNumerator}/${simplifiedDenominator}`,
            type: '分数加法'
        };
    }

    // 生成分数减法题目
    function generateFractionSubtraction() {
        let a1, b1, a2, b2;
        
        // 生成两个分数，确保第一个分数大于第二个
        do {
            a1 = getRandomInt(2, 10);
            b1 = getRandomInt(2, 12);
            a2 = getRandomInt(1, a1);
            b2 = getRandomInt(2, 12);
        } while (a1 >= b1 || a2 >= b2 || (a1 * b2) <= (a2 * b1)); // 确保都是真分数且第一个大于第二个
        
        // 计算结果
        const numerator = a1 * b2 - a2 * b1;
        const denominator = b1 * b2;
        
        // 化简分数
        const gcd = getGCD(numerator, denominator);
        const simplifiedNumerator = numerator / gcd;
        const simplifiedDenominator = denominator / gcd;
        
        return {
            problem: `<span class="fraction"><span class="fraction-top">${a1}</span><span class="fraction-bottom">${b1}</span></span> - <span class="fraction"><span class="fraction-top">${a2}</span><span class="fraction-bottom">${b2}</span></span> = ?`,
            answer: [simplifiedNumerator, simplifiedDenominator],
            answerText: simplifiedDenominator === 1 ? simplifiedNumerator.toString() : `${simplifiedNumerator}/${simplifiedDenominator}`,
            type: '分数减法'
        };
    }

    // 求最大公约数
    function getGCD(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // 生成连加题目
    function generateChainAddition() {
        const length = getRandomInt(minLength, maxLength);
        const numbers = [];
        let sum = 0;
        
        for (let i = 0; i < length; i++) {
            const num = getRandomInt(minValue, Math.min(maxValue, 50)); // 限制连加的单个数值
            numbers.push(num);
            sum += num;
            
            if (sum > resultMaxValue) {
                // 如果超出限制，重新生成较小的数
                numbers[i] = getRandomInt(minValue, Math.min(maxValue, 20));
                sum = numbers.reduce((a, b) => a + b, 0);
            }
        }
        
        return {
            problem: numbers.join(' + ') + ' = ?',
            answer: sum,
            answerText: sum.toString(),
            type: '连加'
        };
    }

    // 生成连减题目
    function generateChainSubtraction() {
        const length = getRandomInt(minLength, maxLength);
        const numbers = [];
        
        // 第一个数要足够大，确保结果为正
        let firstNum = getRandomInt(maxValue * (length - 1) / 2, maxValue * length);
        if (firstNum > resultMaxValue) {
            firstNum = resultMaxValue;
        }
        numbers.push(firstNum);
        
        let result = firstNum;
        for (let i = 1; i < length; i++) {
            const maxSubtract = allowNegative ? maxValue : Math.min(maxValue, result);
            const num = getRandomInt(minValue, Math.max(minValue, maxSubtract));
            numbers.push(num);
            result -= num;
        }
        
        if (!allowNegative && result < 0) {
            // 如果结果为负且不允许负数，重新调整
            return generateChainSubtraction();
        }
        
        return {
            problem: numbers.join(' - ') + ' = ?',
            answer: result,
            answerText: result.toString(),
            type: '连减'
        };
    }

    // 生成混合运算题目
    function generateMixedOperation() {
        const operations = ['+', '-', '×'];
        if (allowRemainder) operations.push('÷');
        
        const length = getRandomInt(Math.max(2, minLength - 1), Math.max(2, maxLength - 1));
        let expression = '';
        let numbers = [];
        let ops = [];
        
        // 生成数字和运算符
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                numbers.push(getRandomInt(minValue, Math.min(maxValue, 50)));
            } else {
                const op = operations[Math.floor(Math.random() * operations.length)];
                ops.push(op);
                
                if (op === '÷') {
                    // 除法特殊处理，确保能整除
                    const divisor = getRandomInt(2, 10);
                    const quotient = getRandomInt(minValue, Math.min(maxValue, 20));
                    numbers.push(divisor);
                    numbers[i-1] = divisor * quotient; // 修改被除数
                } else {
                    numbers.push(getRandomInt(minValue, Math.min(maxValue, 30)));
                }
            }
        }
        
        // 构建表达式
        expression = numbers[0].toString();
        for (let i = 0; i < ops.length; i++) {
            expression += ` ${ops[i]} ${numbers[i + 1]}`;
        }
        
        // 计算结果（简单的从左到右计算）并检查中间结果
        let result = numbers[0];
        for (let i = 0; i < ops.length; i++) {
            switch (ops[i]) {
                case '+':
                    result += numbers[i + 1];
                    break;
                case '-':
                    result -= numbers[i + 1];
                    // 检查中间结果是否为负数
                    if (!allowNegative && result < 0) {
                        return generateMixedOperation(); // 重新生成
                    }
                    break;
                case '×':
                    result *= numbers[i + 1];
                    break;
                case '÷':
                    result = Math.floor(result / numbers[i + 1]);
                    break;
            }
            
            // 检查中间结果是否超出范围
            if (result > resultMaxValue) {
                return generateMixedOperation(); // 重新生成
            }
        }
        
        if (result > resultMaxValue || (!allowNegative && result < 0)) {
            return generateMixedOperation(); // 重新生成
        }
        
        return {
            problem: expression + ' = ?',
            answer: result,
            answerText: result.toString(),
            type: '混合运算'
        };
    }

    // 生成题目
    function generateProblem() {
        currentQuestion++;
        progressElement.textContent = `${currentQuestion}/${totalQuestions}`;
        
        // 记录题目开始时间
        questionStartTime = Date.now();
        
        let problemHTML, answer, answerText, type;
        let attempts = 0; // 防止无限循环

        do {
            // 根据设置中的题型选择来生成题目
            if (selectedType !== 'all') {
                // 如果用户选择了特定题型，则使用该题型
                switch(selectedType) {
                    case 'addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateAddition());
                        break;
                    case 'subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateSubtraction());
                        break;
                    case 'multiplication':
                        ({ problem: problemHTML, answer, answerText, type } = generateMultiplication());
                        break;
                    case 'division':
                        ({ problem: problemHTML, answer, answerText, type } = generateDivision());
                        break;
                    case 'fraction-addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateFractionAddition());
                        break;
                    case 'fraction-subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateFractionSubtraction());
                        break;
                    case 'chain-addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateChainAddition());
                        break;
                    case 'chain-subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateChainSubtraction());
                        break;
                    case 'mixed':
                        ({ problem: problemHTML, answer, answerText, type } = generateMixedOperation());
                        break;
                    default:
                        ({ problem: problemHTML, answer, answerText, type } = generateAddition());
                }
            } else {
                // 随机选择题型
                const types = ['addition', 'subtraction', 'multiplication', 'division', 'fraction-addition', 'fraction-subtraction', 'chain-addition', 'chain-subtraction', 'mixed'];
                const randomType = types[Math.floor(Math.random() * types.length)];
                
                switch(randomType) {
                    case 'addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateAddition());
                        break;
                    case 'subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateSubtraction());
                        break;
                    case 'multiplication':
                        ({ problem: problemHTML, answer, answerText, type } = generateMultiplication());
                        break;
                    case 'division':
                        ({ problem: problemHTML, answer, answerText, type } = generateDivision());
                        break;
                    case 'fraction-addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateFractionAddition());
                        break;
                    case 'fraction-subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateFractionSubtraction());
                        break;
                    case 'chain-addition':
                        ({ problem: problemHTML, answer, answerText, type } = generateChainAddition());
                        break;
                    case 'chain-subtraction':
                        ({ problem: problemHTML, answer, answerText, type } = generateChainSubtraction());
                        break;
                    case 'mixed':
                        ({ problem: problemHTML, answer, answerText, type } = generateMixedOperation());
                        break;
                }
            }
            
            attempts++;
        } while (attempts < 10); // 最多尝试10次

        currentAnswer = answer;
        currentAnswerText = answerText;
        currentProblemType = type;

        problemElement.innerHTML = problemHTML;
        problemTypeElement.textContent = type;

        // 根据题目类型显示相应的输入框
        if (type.includes('分数')) {
            answerInput.style.display = 'none';
            fractionInput.style.display = 'flex';
            numeratorInput.focus();
        } else {
            answerInput.style.display = 'block';
            fractionInput.style.display = 'none';
            answerInput.focus();
        }

        answerInput.value = '';
        numeratorInput.value = '';
        denominatorInput.value = '';
        fractionTextInput.value = '';
        feedbackElement.textContent = '';
        submitBtn.style.display = 'block';
        nextBtn.style.display = 'none';
    }

    // 检查答案
    function checkAnswer() {
        let userAnswer;
        let userAnswerText;

        if (currentProblemType.includes('分数')) {
            // 分数题目的答案检查
            const numerator = parseInt(numeratorInput.value);
            const denominator = parseInt(denominatorInput.value);
            const fractionText = fractionTextInput.value.trim();

            if (fractionText) {
                // 如果用户输入了文本形式的分数
                const parts = fractionText.split('/');
                if (parts.length === 2) {
                    const num = parseInt(parts[0]);
                    const den = parseInt(parts[1]);
                    if (!isNaN(num) && !isNaN(den) && den !== 0) {
                        userAnswer = [num, den];
                        userAnswerText = fractionText;
                    } else {
                        feedbackElement.textContent = '请输入有效的分数格式（如：3/4）';
                        feedbackElement.className = 'text-red-500 font-medium';
                        return;
                    }
                } else if (parts.length === 1 && !isNaN(parseInt(parts[0]))) {
                    // 整数
                    userAnswer = [parseInt(parts[0]), 1];
                    userAnswerText = parts[0];
                } else {
                    feedbackElement.textContent = '请输入有效的分数格式（如：3/4）';
                    feedbackElement.className = 'text-red-500 font-medium';
                    return;
                }
            } else if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                userAnswer = [numerator, denominator];
                userAnswerText = `${numerator}/${denominator}`;
            } else {
                feedbackElement.textContent = '请输入完整的分数';
                feedbackElement.className = 'text-red-500 font-medium';
                return;
            }

            // 化简用户输入的分数
            const gcd = getGCD(Math.abs(userAnswer[0]), Math.abs(userAnswer[1]));
            const simplifiedUserNum = userAnswer[0] / gcd;
            const simplifiedUserDen = userAnswer[1] / gcd;

            // 检查答案是否正确
            const isCorrect = simplifiedUserNum === currentAnswer[0] && simplifiedUserDen === currentAnswer[1];

            if (isCorrect) {
                score++;
                feedbackElement.textContent = '正确！';
                feedbackElement.className = 'text-green-500 font-medium';
            } else {
                feedbackElement.textContent = `错误！正确答案是 ${currentAnswerText}`;
                feedbackElement.className = 'text-red-500 font-medium';
                
                // 添加到错题本
                addWrongQuestion(problemElement.innerHTML, currentAnswerText, userAnswerText, currentProblemType);
            }
        } else {
            // 普通题目的答案检查
            userAnswerText = answerInput.value.trim();
            
            if (currentProblemType === '除法(有余数)') {
                // 有余数的除法特殊处理
                const match = userAnswerText.match(/^(\d+)余(\d+)$/) || userAnswerText.match(/^(\d+)\s*\.\.\.\s*(\d+)$/);
                if (match) {
                    userAnswer = [parseInt(match[1]), parseInt(match[2])];
                } else {
                    feedbackElement.textContent = '请输入格式如：5余2 或 5...2';
                    feedbackElement.className = 'text-red-500 font-medium';
                    return;
                }
                
                const isCorrect = userAnswer[0] === currentAnswer[0] && userAnswer[1] === currentAnswer[1];
                
                if (isCorrect) {
                    score++;
                    feedbackElement.textContent = '正确！';
                    feedbackElement.className = 'text-green-500 font-medium';
                } else {
                    feedbackElement.textContent = `错误！正确答案是 ${currentAnswerText}`;
                    feedbackElement.className = 'text-red-500 font-medium';
                    
                    // 添加到错题本
                    addWrongQuestion(problemElement.textContent, currentAnswerText, userAnswerText, currentProblemType);
                }
            } else {
                // 普通数字答案
                userAnswer = parseFloat(userAnswerText);
                
                if (isNaN(userAnswer)) {
                    feedbackElement.textContent = '请输入有效的数字';
                    feedbackElement.className = 'text-red-500 font-medium';
                    return;
                }
                
                if (userAnswer === currentAnswer) {
                    score++;
                    feedbackElement.textContent = '正确！';
                    feedbackElement.className = 'text-green-500 font-medium';
                } else {
                    feedbackElement.textContent = `错误！正确答案是 ${currentAnswerText}`;
                    feedbackElement.className = 'text-red-500 font-medium';
                    
                    // 添加到错题本
                    addWrongQuestion(problemElement.textContent, currentAnswerText, userAnswerText, currentProblemType);
                }
            }
        }

        // 记录答题时间
        if (questionStartTime) {
            const questionTime = Date.now() - questionStartTime;
            currentSessionTimes.push(questionTime);
        }

        submitBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        nextBtn.focus();
    }

    // 下一题
    function nextProblem() {
        if (currentQuestion >= totalQuestions) {
            // 游戏结束
            
            // 停止所有计时器
            if (totalTimerInterval) {
                clearInterval(totalTimerInterval);
            }
            
            problemElement.textContent = `游戏结束！你的得分是 ${score}/${totalQuestions}`;
            problemTypeElement.textContent = score >= 7 ? '太棒了！继续努力！' : '加油！下次会更好！';
            answerInput.style.display = 'none';
            fractionInput.style.display = 'none';
            feedbackElement.textContent = '';
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            
            // 添加到排行榜
            addLeaderboardRecord();
            
            return;
        }
        
        generateProblem();
    }

    // 重新开始
    function restartGame() {
        score = 0;
        currentQuestion = 0;
        totalQuestions = 10;
        
        // 重置计时相关变量
        gameStartTime = Date.now();
        currentSessionTimes = [];
        
        // 清除之前的计时器
        if (totalTimerInterval) {
            clearInterval(totalTimerInterval);
        }
        
        // 启动总计时器
        totalTimerInterval = setInterval(updateTotalTimer, 100);
        
        scoreElement.textContent = score;
        generateProblem();
    }

    // 更新总计时器
    function updateTotalTimer() {
        if (gameStartTime) {
            const totalTime = Date.now() - gameStartTime;
            const minutes = Math.floor(totalTime / 60000);
            const seconds = Math.floor((totalTime % 60000) / 1000);
            
            if (minutes > 0) {
                totalTimerElement.textContent = `${minutes}分${seconds}秒`;
            } else {
                totalTimerElement.textContent = `${seconds}秒`;
            }
        }
    }

    // 事件监听
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextProblem);
    restartBtn.addEventListener('click', restartGame);

    // 回车键提交答案
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (submitBtn.style.display !== 'none') {
                checkAnswer();
            } else if (nextBtn.style.display !== 'none') {
                nextProblem();
            }
        }
    });

    // 分数输入框回车键处理
    [numeratorInput, denominatorInput, fractionTextInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (submitBtn.style.display !== 'none') {
                    checkAnswer();
                } else if (nextBtn.style.display !== 'none') {
                    nextProblem();
                }
            }
        });
    });

    // 点击其他区域关闭设置面板
    document.addEventListener('click', function(event) {
        if (!floatingSettingsBtn.contains(event.target) && 
            !floatingSettingsPanel.contains(event.target)) {
            floatingSettingsPanel.classList.remove('active');
        }
    });

    // 点击其他区域关闭错题本面板
    document.addEventListener('click', function(event) {
        if (!floatingWrongBtn.contains(event.target) && 
            !floatingWrongPanel.contains(event.target)) {
            floatingWrongPanel.classList.remove('active');
        }
    });
    
    // 点击其他区域关闭排行榜面板
    document.addEventListener('click', function(event) {
        if (!floatingLeaderboardBtn.contains(event.target) && 
            !floatingLeaderboardPanel.contains(event.target)) {
            floatingLeaderboardPanel.classList.remove('active');
        }
    });
});