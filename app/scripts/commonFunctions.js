function isdigit(str){
    return !isNaN(parseFloat(str)) && isFinite(str); 
}

function isalpha(str){
    return /^[a-zA-Z()]+$/.test(str);
}

function isspace(str){
    return str.indexOf(' ') >= 0;
}

function feof(str){
    return (!str || 0 === str.length);
}

function ispunct(str){
    return /[,.?\-:%$^&*()@#!<>{};=]/.test(str);
}