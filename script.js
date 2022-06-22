const selectors = {
    copy: 'copy',
    checkbox: 'checkbox',
    slider: 'slider',
    button: 'generate',
    mainContainer: document.querySelector('.password-generator'),
    sliderValue: document.querySelector('.password-generator__title-length'),
    viewBox: document.querySelector('.password-generator__viewbox'),
    copyBtn: document.querySelector('.password-generator__copy'),
    settings: document.querySelectorAll('.password-generator__setting'),
    checkboxes: document.querySelectorAll('.password-generator__setting input[type="checkbox"]'),
}

const flags = {
    lowercase: true,
    uppercase: false,
    numbers: false,
    symbols: false,
    length: 8,
};

const randomFunc = {
    lowercase: getRandomLower,
    uppercase: getRandomUppercase,
    numbers: getRandomNumber,
    symbols: getRandomSymbol,
};

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
};

function getRandomUppercase() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
};

function getRandomSymbol() {
    const symbols = '~!@#$%^&*()_+{}":?><;.,';
    return symbols[Math.floor(Math.random() * symbols.length)];
};

function generatePassword() {
    let generatedPassword = "";
    const typesCount = flags.lowercase + flags.uppercase + flags.numbers + flags.symbols;
    const { lowercase, uppercase, numbers, symbols } = flags;
    const typesArr = [{ lowercase }, { uppercase }, { numbers }, { symbols }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return "";
    }
    for (let i = 0; i < flags.length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }

    return generatedPassword.slice(0, flags.length)
        .split('').sort(() => Math.random() - 0.5)
        .join('');
};

function copyPassword() {
    const textarea = document.createElement('textarea');
    const password = selectors.viewBox.value;
    textarea.innerText = password;

    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();

    const notification = '<div class="password-generator__notification">password copied!</div>';
    selectors.mainContainer.insertAdjacentHTML('beforeend', notification);
    setTimeout(() => {
        selectors.mainContainer.querySelector('.password-generator__notification').remove();
    }, 1000);
};

function setDisabledCheckbox() {
    let active = [];
    selectors.checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            active.push(checkbox);
        }
        checkbox.disabled = false;
        checkbox.parentNode.classList.remove('disabled');
    });
    if (active.length === 1) {
        active[0].disabled = true;
        active[0].parentNode.classList.add('disabled');
    }
};

selectors.settings.forEach(setting => {
    setting.addEventListener('click', setDisabledCheckbox);
});

document.addEventListener('input', e => {
    if (e.target.dataset.action == selectors.slider) {
        selectors.sliderValue.dataset.length = flags.length = e.target.value;
    }
});

document.addEventListener('click', e => {
    const target = e.target;
    const targetAction = target.dataset.action;
    if (!targetAction) return;

    switch (targetAction) {

        case (selectors.copy):
            copyPassword();
            break;

        case (selectors.checkbox):
            const targetSetting = target.dataset.setting;
            flags[targetSetting] = target.checked;
            break;

        case (selectors.button):
            selectors.viewBox.value = generatePassword();
            selectors.copyBtn.hidden = false;
            break;
    }
});