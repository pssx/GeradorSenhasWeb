document.addEventListener("DOMContentLoaded", () => {
    const passwordDisplay = document.getElementById("password-display");
    const generateButton = document.getElementById("generate-button");
    const copyButton = document.getElementById("copy-button");
    const lengthSlider = document.getElementById("length-slider");
    const lengthDisplay = document.getElementById("length-display");
    const uppercaseCheckbox = document.getElementById("uppercase");
    const lowercaseCheckbox = document.getElementById("lowercase");
    const numbersCheckbox = document.getElementById("numbers");
    const symbolsCheckbox = document.getElementById("symbols");
    const passwordScore = document.getElementById("password-score");

    const options = {
        length: 53,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
    };

    const generatePassword = () => {
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const symbols = "!@#$%&*";
        
        let charset = "";
        if (options.includeUppercase) charset += uppercase;
        if (options.includeLowercase) charset += lowercase;
        if (options.includeNumbers) charset += numbers;
        if (options.includeSymbols) charset += symbols;
        
        if (charset === "") {
            passwordDisplay.textContent = "Selecione pelo menos uma opção.";
            return;
        }

        let result = "";
        for (let i = 0; i < options.length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        passwordDisplay.textContent = result;
        updatePasswordScore(result);
    };

    const calculatePasswordScore = (pwd) => {
        if (!pwd) return { score: "Nenhuma", color: "hsl(214.3, 31.8%, 91.4%)", className: "score-none" };

        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (pwd.length >= 16) score += 1;
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 2) return { score: "Fraca", className: "score-weak" };
        if (score <= 4) return { score: "Média", className: "score-fair" };
        if (score <= 6) return { score: "Forte", className: "score-strong" };
        return { score: "Muito Forte", className: "score-strong" };
    };
    
    const updatePasswordScore = (pwd) => {
        const scoreInfo = calculatePasswordScore(pwd);
        passwordScore.textContent = scoreInfo.score;
        passwordScore.className = `score-text ${scoreInfo.className}`;
    };

    const copyToClipboard = () => {
        const password = passwordDisplay.textContent;
        if (password && password !== "Selecione pelo menos uma opção.") {
            navigator.clipboard.writeText(password).then(() => {
                alert("Senha copiada para a área de transferência!");
            }).catch(err => {
                console.error("Erro ao copiar senha: ", err);
                alert("Falha ao copiar a senha.");
            });
        }
    };

    // Evento Listeners
    generateButton.addEventListener("click", generatePassword);
    copyButton.addEventListener("click", copyToClipboard);

    lengthSlider.addEventListener("input", (e) => {
        options.length = parseInt(e.target.value, 10);
        lengthDisplay.textContent = options.length;
        generatePassword();
    });

    [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            options[e.target.id === 'uppercase' ? 'includeUppercase' : 
                    e.target.id === 'lowercase' ? 'includeLowercase' :
                    e.target.id === 'numbers' ? 'includeNumbers' : 'includeSymbols'] = e.target.checked;
            generatePassword();
        });
    });

    // Geração de senha inicial
    generatePassword();
});