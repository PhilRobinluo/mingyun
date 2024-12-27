// 初始化日期选择器
function initializeDateSelectors() {
    const yearSelect = document.getElementById('birth-year');
    const monthSelect = document.getElementById('birth-month');
    const daySelect = document.getElementById('birth-day');

    // 清空现有选项
    yearSelect.innerHTML = '<option value="">年</option>';
    monthSelect.innerHTML = '<option value="">月</option>';
    daySelect.innerHTML = '<option value="">日</option>';

    // 添加年份选项（1900年到当前年份）
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 添加月份选项
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month.toString().padStart(2, '0');
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // 更新日期选项
    function updateDays() {
        const year = parseInt(yearSelect.value) || new Date().getFullYear();
        const month = parseInt(monthSelect.value) || 1;
        const daysInMonth = new Date(year, month, 0).getDate();

        daySelect.innerHTML = '<option value="">日</option>';
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }

    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
    updateDays();
}

// 计算单个数字的和直到得到个位数
function reduceToSingleDigit(num) {
    while (num >= 10) {
        num = Math.floor(num / 10) + (num % 10);
    }
    return num;
}

// 计算葫芦数字
function calculateGourdNumbers(birthdate) {
    const [year, month, day] = birthdate.split('-');
    const yearLastTwo = year.slice(-2);

    // 计算底层数字
    const bottomNumbers = [
        reduceToSingleDigit(parseInt(day[0] || 0) + parseInt(day[1] || 0)),
        reduceToSingleDigit(parseInt(month[0] || 0) + parseInt(month[1] || 0)),
        reduceToSingleDigit(parseInt(yearLastTwo[0] || 0) + parseInt(yearLastTwo[1] || 0)),
        reduceToSingleDigit(parseInt(yearLastTwo[0] || 0) + parseInt(yearLastTwo[1] || 0))
    ];

    // 计算中层数字
    const middleNumbers = [
        reduceToSingleDigit(bottomNumbers[0] + bottomNumbers[1]),
        reduceToSingleDigit(bottomNumbers[2] + bottomNumbers[3])
    ];

    // 计算顶层数字
    const topNumber = reduceToSingleDigit(middleNumbers[0] + middleNumbers[1]);

    return {
        bottom: bottomNumbers,
        middle: middleNumbers,
        top: topNumber
    };
}

// 获取完整的日期字符串
function getSelectedDate() {
    const year = document.getElementById('birth-year').value;
    const month = document.getElementById('birth-month').value;
    const day = document.getElementById('birth-day').value;

    if (!year || !month || !day) return '';
    return `${year}-${month}-${day}`;
}

// 显示计算动画
function showCalculationAnimation() {
    const animation = document.getElementById('calculationAnimation');
    animation.style.display = 'flex';
    return new Promise(resolve => setTimeout(resolve, 3000)); // 展示3秒
}

// 隐藏计算动画
function hideCalculationAnimation() {
    const animation = document.getElementById('calculationAnimation');
    animation.style.display = 'none';
}

// 逐个显示结果项
function showResultItems() {
    const items = document.querySelectorAll('.result-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('show');
        }, index * 500); // 每隔500ms显示一项
    });
}

// 添加打字机效果函数
function typewriterEffect(element, text, speed = 50) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

// 添加列表项打字机效果
function typewriterListItems(element, items, speed = 50) {
    return new Promise(async resolve => {
        for (let item of items) {
            const li = document.createElement('li');
            element.appendChild(li);
            await typewriterEffect(li, item, speed);
        }
        resolve();
    });
}

// 修改显示结果函数
async function displayResults(numbers, analysis) {
    // 先显示计算动画
    await showCalculationAnimation();
    hideCalculationAnimation();

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';

    // 添加渐显效果
    setTimeout(() => {
        resultDiv.classList.add('show');
    }, 100);

    // 1. 显示葫芦图数字（带动画）
    const topNumber = document.querySelector('.top-number');
    const middleNumbers = document.querySelector('.middle-numbers');
    const bottomNumbers = document.querySelector('.bottom-numbers');

    topNumber.classList.add('number-appear');
    await new Promise(resolve => setTimeout(resolve, 500));
    topNumber.textContent = numbers.top;

    middleNumbers.classList.add('number-appear');
    await new Promise(resolve => setTimeout(resolve, 500));
    middleNumbers.textContent = numbers.middle.join(' ');

    bottomNumbers.classList.add('number-appear');
    await new Promise(resolve => setTimeout(resolve, 500));
    bottomNumbers.textContent = numbers.bottom.join(' ');

    // 2. 逐个显示分析结果模块
    // 性格特征
    const personalityDiv = document.createElement('div');
    personalityDiv.className = 'result-item module-appear';
    document.getElementById('personality').innerHTML = '';
    document.getElementById('personality').appendChild(personalityDiv);

    const positiveDiv = document.createElement('div');
    positiveDiv.className = 'positive';
    const negativeDiv = document.createElement('div');
    negativeDiv.className = 'negative';

    personalityDiv.appendChild(positiveDiv);
    personalityDiv.appendChild(negativeDiv);

    await typewriterEffect(document.createElement('h4'), '正面特质：', 50);
    positiveDiv.appendChild(document.createElement('p'));
    await typewriterEffect(positiveDiv.querySelector('p'), analysis.personality.positive.join('、'), 50);

    await typewriterEffect(document.createElement('h4'), '负面特质：', 50);
    negativeDiv.appendChild(document.createElement('p'));
    await typewriterEffect(negativeDiv.querySelector('p'), analysis.personality.negative.join('、'), 50);

    // 心声解读
    const innerVoiceDiv = document.createElement('div');
    innerVoiceDiv.className = 'result-item module-appear';
    const innerVoiceUl = document.createElement('ul');
    innerVoiceDiv.appendChild(innerVoiceUl);
    document.getElementById('inner-voice').innerHTML = '';
    document.getElementById('inner-voice').appendChild(innerVoiceDiv);
    await typewriterListItems(innerVoiceUl, analysis.innerVoice);

    // 天赋能力
    const talentsDiv = document.createElement('div');
    talentsDiv.className = 'result-item module-appear';
    document.getElementById('talents').innerHTML = '';
    document.getElementById('talents').appendChild(talentsDiv);
    await typewriterEffect(talentsDiv, analysis.talents);

    // 适合职业
    const careerDiv = document.createElement('div');
    careerDiv.className = 'result-item module-appear';
    document.getElementById('career').innerHTML = '';
    document.getElementById('career').appendChild(careerDiv);
    await typewriterEffect(careerDiv, analysis.career);

    // 人生忠告
    const adviceDiv = document.createElement('div');
    adviceDiv.className = 'result-item module-appear';
    document.getElementById('advice').innerHTML = '';
    document.getElementById('advice').appendChild(adviceDiv);
    await typewriterEffect(adviceDiv, analysis.advice);

    // 平滑滚动到结果区域
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// 在 DOMContentLoaded 事件处理函数中添加
function addFireworks() {
    const banner = document.querySelector('.top-banner');

    function createFirework() {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + '%';
        firework.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
        banner.appendChild(firework);

        setTimeout(() => {
            banner.removeChild(firework);
        }, 1000);
    }

    setInterval(createFirework, 2000);
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function () {
    initializeDateSelectors();

    // 性别选择按钮交互
    document.querySelectorAll('.gender-buttons button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelector('.gender-buttons .active').classList.remove('active');
            this.classList.add('active');
        });
    });

    // 计算按钮点击事件
    document.getElementById('calculate').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const birthdate = getSelectedDate();

        if (!name || !birthdate) {
            alert('请填写姓名并选择完整的出生日期');
            return;
        }

        const numbers = calculateGourdNumbers(birthdate);
        const analysis = {
            personality: {
                positive: ["领导者", "自信", "独立", "创造力", "果断", "乐观", "勇敢", "创意", "使命必达"],
                negative: ["自以为是", "说教", "强势", "居高临下", "攀比"]
            },
            innerVoice: [
                "你有没有觉得什么都要自己做？",
                "你有没有发现任何时候，特别喜欢想事情？",
                "你常常不放心别人做的事？",
                "你有没有觉得怎么每次想靠谁，那么谁都出乎你的意料？"
            ],
            talents: "您拥有领袖能力和独立思考能力，通常具有一定的领导力，善于独立思考和解决问题。",
            career: "领导、老板、公司主管、发明家、艺术家等能发挥领导力和创造力的职业",
            advice: "放：对下属和朋友放手，让他们各自经历。对领导表示臣服，遵守职场规则、社会规则等。"
        };

        // 将数据编码并传递到结果页面
        const params = new URLSearchParams({
            name: name,
            numbers: encodeURIComponent(JSON.stringify(numbers)),
            analysis: encodeURIComponent(JSON.stringify(analysis))
        });

        // 跳转到结果页面
        window.location.href = `result.html?${params.toString()}`;
    });

    // 添加烟花效果
    addFireworks();

    // 添加图片加载优化
    const personImage = document.querySelector('.banner-image img');

    // 添加加载占位
    personImage.style.opacity = '0';
    personImage.style.transition = 'opacity 0.3s ease';

    personImage.onload = function () {
        this.style.opacity = '1';
    };

    // 添加图片加载失败处理
    personImage.onerror = function () {
        this.style.display = 'none';
        console.error('人物图片加载失败');
    };
}); 