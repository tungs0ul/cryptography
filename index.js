const input = document.getElementById('userInput');
const output = document.getElementById('output');
const encode = document.getElementById('encode');
const decode = document.getElementById('decode');
const ascii = document.getElementById('ascii');
const caesar = document.getElementById('caesar');
const base64 = document.getElementById('base64');
const morse = document.getElementById('morse');
const lowers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase();
const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const morseAlphabet = uppers + "0123456789,. ";
const morseCode = ".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --.. ----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----. --..-- .-.-.- /".split(' ');
const alphabet = uppers + lowers + "0123456789+/";
var key = parseInt(document.getElementById('key').value, 10);

document.getElementById('key').addEventListener("input", function(){
    key = parseInt(document.getElementById('key').value, 10);
})

document.getElementById("key").disabled = true;
document.getElementById("key").hidden = true;
document.getElementById("morse-sound").hidden = true;


document.getElementById("algoDiv").onclick = function () {
    $(".algo").removeClass("btn-primary").addClass("btn-secondary");
    document.getElementById("morse-sound").disabled = true;
    document.getElementById("morse-sound").hidden = true;
    document.getElementById("key").hidden = true;
    if(caesar.checked) {
        document.getElementById("key").disabled = false;
        document.getElementById("key").hidden = false;
        $("#labelCaesar").addClass("btn-primary").removeClass("btn-secondary");
    }else {
        document.getElementById("key").disabled = true;
    }
    if(morse.checked){
        $("#labelMorse").addClass("btn-primary").removeClass("btn-secondary");
        document.getElementById("morse-sound").disabled = false;
        document.getElementById("morse-sound").hidden = false;
    }
    if(ascii.checked){
        $("#labelAscii").addClass("btn-primary").removeClass("btn-secondary");
    }
    if(base64.checked){
        $("#labelBase64").addClass("btn-primary").removeClass("btn-secondary");
    }
    if(encode.checked){
        output.value = encodeStr(input.value);
    }
    else {
        output.value = decodeStr(input.value);
    }
}

$(".code").click(function (){
    $(".code").prop("checked", false);
    this.checked = true;
    if(encode.checked){
        output.value = encodeStr(input.value);
        document.getElementById("edcode").innerHTML = "Encode";
    }
    else {
        output.value = decodeStr(input.value);
        document.getElementById("edcode").innerHTML = "Decode";
    }
})

function initWindow(){
    let width = window.innerWidth - 100;
    
    if(window.innerWidth <= 500){
        input.cols = 60;
        output.cols = 60;
    }
    else {
        input.cols = 50 + Math.floor(width/25);
        output.cols = 50  + Math.floor(width/25);
    }
}

initWindow();

$(window).resize(function() {
    initWindow();
});

function encodeAscii(str){
    let result = ""
    for (let i=0; i<str.length; ++i){
        let x = str.charCodeAt(i).toString(16);
        if(x.length < 2){
            x = "0" + x;
        }
        result += x;
        result += " ";
    }
    return result;
}

function encodeCaesar(str){
    let result = ""
    for (let i=0; i<str.length; ++i){
        if(lowers.includes(str[i])){
            result += lowers[(lowers.indexOf(str[i]) + key) % lowers.length];
        }
        else if(uppers.includes(str[i])){
            result += uppers[(uppers.indexOf(str[i]) + key) % uppers.length];
        }
        else {
            result += str[i];
        }
    }
    return result;
}

function encodeBase64(str){
    let result = "";
    let bin = "";
    for (let i=0; i<str.length; ++i){
        let charBin = str.charCodeAt(i).toString(2);
        while(charBin.length < 8){
            charBin = "0" + charBin;
        }
        bin += charBin;
    }
    let realLength = Math.floor(bin.length/6) + 1;
    while(bin.length % 24 !==0){
        bin += "0";
    }
    bin = bin.match(/.{1,6}/g);
    for(let i=0; i<bin.length; ++i){
        if(i < realLength){
            result += alphabet[parseInt(bin[i], 2)];
        }
        else {
            result += "=";
        }
    }
    return result;
}

function encodeMorse(str){
    let result = "";
    let x = str.toUpperCase();
    for(let i=0; i<x.length; ++i){
        if(x[i] === ' '){
            result += "/ ";
        }
        else {
            if(morseAlphabet.includes(x[i])){
                result += morseCode[morseAlphabet.indexOf(x[i])] + ' ';
            }
        }
    }
    return result;
}

function encodeStr(str){
    if(str){
        if(ascii.checked){
            return encodeAscii(str);
        }
        else if(caesar.checked){
            return encodeCaesar(str);
        }
        else if(base64.checked){
            return encodeBase64(str);
        }
        else if(morse.checked){
            return encodeMorse(str);
        }
    }
    else {
        return "";
    }
}

function decodeAscii(str){
    let result = str.split(" ");
    let bin = true;
    for(let i=0; i<str.length; ++i){
        if(!(str[i] === ' ' || str[i] === '0' || str[i] === '1' || str[i] === '\n')){
            console.log(i, str[i]);
            bin = false;
            break;
        }
    }
    if(bin){
        result = result.map(x => String.fromCharCode(parseInt(x, 2)));
    }
    else {
        result = result.map(x => String.fromCharCode(parseInt(x, 16)));
    }
    return result.join("");
}

function decodeCaesar(str){
    let result = ""
    for (let i=0; i<str.length; ++i){
        if(lowers.includes(str[i])){
            let x = lowers.indexOf(str[i]) - key;
            if(x<0){
                x += lowers.length
            }
            result += lowers[x % lowers.length];
        }
        else if(uppers.includes(str[i])){
            let x = uppers.indexOf(str[i]) - key;
            if(x<0){
                x += uppers.length;
            }
            result += uppers[x % uppers.length];
        }
        else {
            result += str[i];
        }
    }
    return result;
}

function decodeBase64(str){
    let result = "";
    let counter = 0;
    for(let i=0; i<str.length; ++i){
        let x = ""
        if(str[i] === "="){
            x = "000000";
            counter += 1;
        }
        else {
            x = alphabet.indexOf(str[i]).toString(2);
        }
        while(x.length < 6){
            x = "0" + x;
        }
        result += x;
    }
    result = result.match(/.{1,8}/g);
    result = result.slice(0, result.length - counter);
    result = result.map(x => String.fromCharCode(parseInt(x, 2)));
    return result.join('');
}

function decodeMorse(str){
    let result = str.split(" ");
    result = result.map(x => morseAlphabet[morseCode.indexOf(x)]);
    return result.join("");
}

function decodeStr(str){
    if(str){
        if(ascii.checked){
            return decodeAscii(str);
        }
        else if(caesar.checked){
            return decodeCaesar(str);
        }
        else if(base64.checked){
            return decodeBase64(str);
        }
        else if(morse.checked){
            return decodeMorse(str);
        }
    }
    else {
        return "";
    }
}

input.addEventListener("input", function(){
    if(encode.checked){
        output.value = encodeStr(input.value);
    }
    else {
        output.value = decodeStr(input.value);
    }
})

const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();
const dot = 0.05;

document.getElementById("morse-sound").onclick = function() {
    let t = ctx.currentTime;

    let oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 600;

    let gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, t);
    
    let texts = output.value.split("");
    if(decode.checked){
        texts = input.value.split("");
    }

    texts.forEach(function(letter) {
        switch(letter) {
            case ".":
                gainNode.gain.setValueAtTime(1, t);
                t += dot;
                gainNode.gain.setValueAtTime(0, t);
                t += dot;
                break;
            case "-":
                gainNode.gain.setValueAtTime(1, t);
                t += 3 * dot;
                gainNode.gain.setValueAtTime(0, t);
                t += dot;
                break;
            case " ":
                t += 7 * dot;
                break;
            default:
                t += 10 * dot;
                break;
        }
    });

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();

    return false;
}
