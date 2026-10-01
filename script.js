// =========================================================================
// 【修改重點：遊戲劇情腳本劇本數據】
// 您可以自由新增、修改這裡的內容、角色名稱、台詞文字與背景圖片
// =========================================================================
const storyData = {


    
    // 【結局點擊後進入的全黑置中幕】
    resetScene: {
        speaker: "",
        text: "要不要做功德再幫伊吹提供一次意見",              // 文字留空，只讓「— 再回答一次 —」按鈕置中顯示；或寫上「— 故事結束 —」
        bgImage: "",
        isCentered: true,      // 觸發置中模式
        showRestartBtn: true,  // 顯示按鈕
        noTyping: true,        // 不打字
        isSlowFadeIn: true     // 緩慢淡入
        
    },

     intro1: {
        speaker: "",
        text: "可憐的伊吹似乎暈船了，一起來幫幫他吧!\n*前方50公尺接近中*",
        bgImage: "",
        isCentered: true,      // 觸發置中模式
        noTyping: true,        // 不打字
          nextId: "intro2"
 
    },
 
    intro2: {
        speaker: "",
        text: "伊吹來找你問問題了\n雖然覺得這症頭很難救，你還是決定聽他說一說",
        bgImage: "https://images.plurk.com/42tkQGywr2os4aB6HJh8Gx.png",
        nextId: "intro3"
    },
    intro3: {
        speaker: "伊吹",
        text: "先說這是我朋友的事。\n他最近一直很在意自己的上司，但其實他本來不喜歡對方的，只是為了工作才沒離開——",
        bgImage: "https://images.plurk.com/ziPn95YLHgQzH6kEjXjmr.png",
        nextId: "start"
    },

    // 劇情起始點
    start: {
        speaker: "",
        text: "挖勒，這什麼超級老套的問法。\n你如此想著，眼看伊吹越講越焦躁，表情跟話語裡也開始出現破綻，顯然戀愛腦已經沒救。",
        // 【修改重點】設定該幕的背景圖片 URL (輸入您的圖片檔案路徑或網址)
        bgImage: "https://images.plurk.com/CHCF9ZjqaeYhNLf2pvlJ9.png",
        nextId: "step2"

        
    },


step2: {
        speaker: "伊吹",
        text: "這究竟是什麼心情？\n只要想到那個人，就覺得胸口很悶，心臟像是被什麼給壓住......",
        // 【修改重點】設定該幕的背景圖片 URL (輸入您的圖片檔案路徑或網址)
        bgImage: "https://images.plurk.com/5PGymo2FAbDdWTOunuzgxR.png ",
        fadeBg: true, // 【關鍵】只有切換到這張背景時，才會觸發淡入淡出！
        nextId: "step3"

        
    },

    
    step3: {
        speaker: "伊吹",
        text: "「難道我對她——」",
        bgImage: "https://images.plurk.com/1da9JutI1gf6TVWt1nrAle.png",
        // 【修改重點】出現選項分支
        choices: [
            { text: "「你暈爛了」", nextId: "choice_a" },
            { text: "「錯覺吧」", nextId: "choice_b" }
        ]
    },
    choice_a: {
        speaker: "伊吹",
        text: "「......果然是這樣嗎?」",
        bgImage: "https://images.plurk.com/4PNZQtzRHQgQn7Iw8qG6gY.png",
        nextId: "end_a_1"
    },
    choice_b: {
        speaker: "伊吹",
        text: "「可是我還是覺得......」",
        bgImage: "https://images.plurk.com/3q5d6xsH9WslTKyVvB6Jhl.png",
        nextId: "end_b_1"
    },

    end_a_1: {
        speaker: "",
        text: "多虧了你的提醒，伊吹發現自己大暈船，還打算去跟雪村打探蓮的戀愛史。",
        bgImage: "https://images.plurk.com/5AURk8gJZZcXm7rX0cXZvM.png",
        nextId: "end_a" 
    },


    end_a: {
        speaker: "",
        text: "【結局 A：那個蛇很難過，他在暈船】",
        bgImage: "https://images.plurk.com/3msTsgcOmpLjznax7ldQmW.png",
        nextId: "resetScene" // 按一下推進到全黑置中幕
    },

    

    end_b_1: {
        speaker: "",
        text: "伊吹在反覆恆跳中導致行事錯誤百出，這讓蓮倍感無趣，很快就叫雪村把他殺掉了。",
        bgImage: "https://images.plurk.com/7faMDR6brBaWnvMB2gamJw.png",
        nextId: "end_b" 
    },

    end_b: {
        speaker: "",
        text: "【結局 B：坦白講暈船比死還難過】",
        bgImage: "https://images.plurk.com/6Yt2jZnHuamvQChdXBssq5.png",
       nextId: "resetScene" // 按一下推進到全黑置中幕
    }
};

// =========================================================================
// 遊戲控制核心邏輯
// =========================================================================
let currentStepId = "intro1";
let isTyping = false;
let typewriterTimer = null;
let currentFullText = "";

const bgImageEl = document.getElementById("bg-image");
const speakerNameEl = document.getElementById("speaker-name");
const dialogueTextEl = document.getElementById("dialogue-text");
const choicesContainerEl = document.getElementById("choices-container");
const nextIndicatorEl = document.getElementById("next-indicator");
const gameContainerEl = document.getElementById("game-container");
const restartBtnEl = document.getElementById("restart-btn");
const dialogueBoxEl = document.getElementById("dialogue-box");

function initGame() {
    loadStep("intro1");
    
    gameContainerEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("choice-button") || e.target.id === "restart-btn") return;
        handleContainerClick();
    });

    restartBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        restartGame();
    });
}

function restartGame() {
    clearInterval(typewriterTimer);
    isTyping = false;
    
    // 點擊重新開始時先淡出，隨後加載第一幕
    dialogueBoxEl.classList.add("fade-out");
    setTimeout(() => {
        dialogueBoxEl.classList.remove("slow-fade-in");
        loadStep("intro1");
        dialogueBoxEl.classList.remove("fade-out");
    }, 500);
}

function loadStep(stepId) {
    currentStepId = stepId;
    const currentData = storyData[stepId];

    if (!currentData) return;

    // 清除先前的對話框動畫類別
    dialogueBoxEl.classList.remove("slow-fade-in");

    // 重置隱藏「重新開始」按鈕
    restartBtnEl.classList.add("hidden");

    // 版面置中切換
    if (currentData.isCentered) {
        gameContainerEl.classList.add("center-mode");
    } else {
        gameContainerEl.classList.remove("center-mode");
    }

    // 觸發緩慢淡入動畫
    if (currentData.isSlowFadeIn) {
        // 強制重繪觸發動畫重新播放
        void dialogueBoxEl.offsetWidth;
        dialogueBoxEl.classList.add("slow-fade-in");
    }

    // ===================================================
    // 背景圖片處理 (支援特定圖片淡入淡出 fadeBg)
    // ===================================================
    if (currentData.bgImage) {
        // 先移除背景的淡入動畫類別
        bgImageEl.classList.remove("fade-transition");

        // 當圖片網址與目前不同時才進行更換
        if (bgImageEl.src !== currentData.bgImage) {
            bgImageEl.src = currentData.bgImage;

            // 檢查此步驟是否需要背景淡入淡出
            if (currentData.fadeBg) {
                // 強制重繪 (Reflow) 以重置 CSS 動畫
                void bgImageEl.offsetWidth;
                bgImageEl.classList.add("fade-transition");
            }
        }
        bgImageEl.style.opacity = "1";
    } else {
        bgImageEl.classList.remove("fade-transition");
        bgImageEl.style.opacity = "0";
    }

    // 角色名字框處理
    if (currentData.speaker && currentData.speaker.trim() !== "") {
        speakerNameEl.textContent = currentData.speaker;
        speakerNameEl.style.display = "inline-block";
    } else {
        speakerNameEl.style.display = "none";
    }
    

    // 清除選項與指示燈
    choicesContainerEl.innerHTML = "";
    choicesContainerEl.classList.add("hidden");
    nextIndicatorEl.classList.add("hidden");

    // 不採用打字效果的情境（如 resetScene）
    if (currentData.noTyping) {
        isTyping = false;
        dialogueTextEl.textContent = currentData.text;
        if (currentData.showRestartBtn) {
            restartBtnEl.classList.remove("hidden");
        }
    } else {
        // 一般情境：執行打字效果
        startTypewriter(currentData.text, 40, () => {
            if (currentData.choices && currentData.choices.length > 0) {
                renderChoices(currentData.choices);
            } else if (currentData.nextId) {
                nextIndicatorEl.classList.remove("hidden");
            }
        });
    }
}

function startTypewriter(text, speed, onComplete) {
    isTyping = true;
    currentFullText = text;
    dialogueTextEl.textContent = "";
    let index = 0;

    clearInterval(typewriterTimer);

    typewriterTimer = setInterval(() => {
        dialogueTextEl.textContent += text[index];
        index++;

        if (index >= text.length) {
            completeTypewriter();
            if (onComplete) onComplete();
        }
    }, speed);
}

function completeTypewriter() {
    clearInterval(typewriterTimer);
    dialogueTextEl.textContent = currentFullText;
    isTyping = false;
}

function renderChoices(choices) {
    choicesContainerEl.innerHTML = "";
    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "choice-button";
        btn.textContent = choice.text;
        btn.onclick = (e) => {
            e.stopPropagation();
            loadStep(choice.nextId);
        };
        choicesContainerEl.appendChild(btn);
    });
    choicesContainerEl.classList.remove("hidden");
}

function handleContainerClick() {
    const currentData = storyData[currentStepId];

    if (isTyping) {
        completeTypewriter();
        if (currentData.choices && currentData.choices.length > 0) {
            renderChoices(currentData.choices);
        } else if (currentData.nextId) {
            nextIndicatorEl.classList.remove("hidden");
        }
        return;
    }

    if (!isTyping && (!currentData.choices || currentData.choices.length === 0)) {
        if (currentData.nextId) {
            loadStep(currentData.nextId);
        }
    }
}

window.onload = initGame;
