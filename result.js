// 从 URL 参数获取数据
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        numbers: JSON.parse(decodeURIComponent(params.get('numbers'))),
        analysis: JSON.parse(decodeURIComponent(params.get('analysis')))
    };
}

// 打字机效果
function typeWriter(element, text, speed = 50) {
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

// 显示部分
async function showSection(section) {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    await new Promise(resolve => setTimeout(resolve, 500));
}

// 主要展示逻辑
async function displayResult() {
    const { name, numbers, analysis } = getQueryParams();

    // 显示用户名
    document.getElementById('userName').textContent = name;

    // 隐藏加载动画，显示结果容器
    await new Promise(resolve => setTimeout(resolve, 3000));
    document.getElementById('calculationAnimation').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    // 逐个显示各个部分
    const sections = document.querySelectorAll('.section');
    for (let section of sections) {
        await showSection(section);

        // 根据部分类型显示内容
        if (section.classList.contains('gourd-section')) {
            // 显示葫芦图
            const topNumber = section.querySelector('.top-number');
            const middleNumbers = section.querySelector('.middle-numbers');
            const bottomNumbers = section.querySelector('.bottom-numbers');

            await typeWriter(topNumber, numbers.top.toString());
            await typeWriter(middleNumbers, numbers.middle.join(' '));
            await typeWriter(bottomNumbers, numbers.bottom.join(' '));
        }
        else if (section.classList.contains('personality-section')) {
            const content = section.querySelector('.content-box');
            await typeWriter(content, '正面特质：' + analysis.personality.positive.join('、'));
            await typeWriter(document.createElement('p'), '负面特质：' + analysis.personality.negative.join('、'));
        }
        else if (section.classList.contains('inner-voice-section')) {
            const content = section.querySelector('.content-box');
            for (let item of analysis.innerVoice) {
                const p = document.createElement('p');
                content.appendChild(p);
                await typeWriter(p, item);
            }
        }
        else if (section.classList.contains('talents-section')) {
            const content = section.querySelector('.content-box');
            await typeWriter(content, analysis.talents);
        }
        else if (section.classList.contains('career-section')) {
            const content = section.querySelector('.content-box');
            await typeWriter(content, analysis.career);
        }
        else if (section.classList.contains('advice-section')) {
            const content = section.querySelector('.content-box');
            await typeWriter(content, analysis.advice);
        }
    }
}

// 页面加载完成后开始展示
document.addEventListener('DOMContentLoaded', displayResult); 