// 初始化日期选择器
function initializeDateSelectors() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');

    // 填充年份选项（1900-2024）
    for (let year = 2024; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // 填充月份选项（1-12）
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    }

    // 更新日期选项
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const daysInMonth = new Date(year, month, 0).getDate();

        // 清空现有的日期选项
        daySelect.innerHTML = '';

        // 填充日期选项
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day;
            daySelect.appendChild(option);
        }
    }

    // 当年份或月份改变时更新日期选项
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);

    // 初始化日期选项
    updateDays();
}

// 计算葫芦数字
function calculateGourdNumbers(name, year, month, day, gender) {
    // 基础计算逻辑
    let nameNumber = calculateNameNumber(name);
    let birthNumber = calculateBirthNumber(year, month, day);
    let destinyNumber = calculateDestinyNumber(nameNumber, birthNumber);

    // 根据性别调整计算
    if (gender === 'female') {
        nameNumber = adjustNumberForFemale(nameNumber);
        birthNumber = adjustNumberForFemale(birthNumber);
        destinyNumber = adjustNumberForFemale(destinyNumber);
    }

    return {
        nameNumber,
        birthNumber,
        destinyNumber
    };
}

// 计算姓名数字
function calculateNameNumber(name) {
    let total = 0;
    for (let i = 0; i < name.length; i++) {
        total += name.charCodeAt(i);
    }
    return reduceToSingleDigit(total);
}

// 计算生日数字
function calculateBirthNumber(year, month, day) {
    let total = year + month + day;
    return reduceToSingleDigit(total);
}

// 计算命运数字
function calculateDestinyNumber(nameNumber, birthNumber) {
    return reduceToSingleDigit(nameNumber + birthNumber);
}

// 将数字化简为个位数
function reduceToSingleDigit(number) {
    while (number > 9) {
        let sum = 0;
        while (number > 0) {
            sum += number % 10;
            number = Math.floor(number / 10);
        }
        number = sum;
    }
    return number;
}

// 女性数字调整
function adjustNumberForFemale(number) {
    return ((number * 6) % 9) + 1;
}

// 显示结果
function displayResults(name, numbers) {
    const resultContainer = document.getElementById('result');
    resultContainer.style.display = 'block';

    // 显示问候语
    const greeting = document.createElement('div');
    greeting.className = 'greeting';
    greeting.textContent = `${name}，以下是您的命理分析结果：`;
    resultContainer.appendChild(greeting);

    // 创建葫芦图
    const gourdDiagram = document.createElement('div');
    gourdDiagram.className = 'gourd-diagram';

    const gourdShape = document.createElement('div');
    gourdShape.className = 'gourd-shape';

    // 顶部数字
    const topNumber = document.createElement('div');
    topNumber.className = 'top-number number-appear';
    topNumber.textContent = numbers.destinyNumber;

    // 中间数字
    const middleNumbers = document.createElement('div');
    middleNumbers.className = 'middle-numbers number-appear';
    middleNumbers.textContent = numbers.nameNumber;

    // 底部数字
    const bottomNumbers = document.createElement('div');
    bottomNumbers.className = 'bottom-numbers number-appear';
    bottomNumbers.textContent = numbers.birthNumber;

    // 组装葫芦图
    gourdShape.appendChild(topNumber);
    gourdShape.appendChild(middleNumbers);
    gourdShape.appendChild(bottomNumbers);
    gourdDiagram.appendChild(gourdShape);
    resultContainer.appendChild(gourdDiagram);

    // 显示分析内容
    const analysisContent = document.createElement('div');
    analysisContent.className = 'analysis-content fade-in';

    // 性格特征分析
    const personalityTitle = document.createElement('h3');
    personalityTitle.textContent = '性格特征分析';
    analysisContent.appendChild(personalityTitle);

    const positive = document.createElement('div');
    positive.className = 'positive';
    positive.innerHTML = `<h4>正面特质：</h4>
        <ul>
            <li>富有创造力和想象力</li>
            <li>善于沟通和表达</li>
            <li>具有领导才能</li>
        </ul>`;
    analysisContent.appendChild(positive);

    const negative = document.createElement('div');
    negative.className = 'negative';
    negative.innerHTML = `<h4>需要注意的方面：</h4>
        <ul>
            <li>有时过于理想化</li>
            <li>容易感情用事</li>
            <li>决策时可能优柔寡断</li>
        </ul>`;
    analysisContent.appendChild(negative);

    resultContainer.appendChild(analysisContent);

    // 添加渐显效果
    setTimeout(() => {
        analysisContent.classList.add('show');
    }, 100);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initializeDateSelectors();

    // 获取表单元素
    const form = document.getElementById('analysisForm');
    const nameInput = document.getElementById('name');
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const genderButtons = document.querySelectorAll('input[name="gender"]');
    const agreeCheckbox = document.getElementById('agree');

    // 监听表单提交
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // 验证表单
        if (!nameInput.value.trim()) {
            alert('请输入姓名');
            return;
        }

        if (!agreeCheckbox.checked) {
            alert('请阅读并同意用户协议');
            return;
        }

        // 获取性别值
        let selectedGender;
        for (const button of genderButtons) {
            if (button.checked) {
                selectedGender = button.value;
                break;
            }
        }

        if (!selectedGender) {
            alert('请选择性别');
            return;
        }

        // 计算命理数字
        const numbers = calculateGourdNumbers(
            nameInput.value,
            parseInt(yearSelect.value),
            parseInt(monthSelect.value),
            parseInt(daySelect.value),
            selectedGender
        );

        // 显示结果
        displayResults(nameInput.value, numbers);

        // 滚动到结果区域
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    });
}); 