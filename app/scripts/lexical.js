var tokens = "#tokens", lexemeTable = "#home"; 
var lexicalList; 
var compileOnly = 0; 

function startCompiling(){
	compileOnly = 1; 
	main_Lexical(); 
}

function clearInnerHTML(){
	document.getElementById("console").innerHTML = "";
	document.getElementById("stackPic").innerHTML = "";
	document.getElementById("results").innerHTML = ""; 	 
	document.getElementById("tokens").innerHTML = "";
	document.getElementById("home").innerHTML = "";  
	document.getElementById("mCode").innerHTML = ""; 
}
function main_Lexical(){
	clearInnerHTML(); 
	lexicalList = ""; 
	addToConsole("Starting Lexical Machine"); 
	var array_charact = [CHAR_ARRAY_SIZE];
	var numbers = [];
	var temp;
	var token;
	var i, counter = 0;
	var flag = 0;
	var text = editor.getValue(); 
	while(text != ""){
		temp = text.charAt(0);
		text = text.slice(1, text.length);
		var allowBreak = false; 
		//checks to see if it is a digit
		//If so then it will save it into an array
		if (isdigit(temp)){
			i = 0;
			while (!(ispunct(temp)) && !(isspace(temp)) && temp != '\n' && !feof(temp) && !allowBreak){
				if (i > NUMBER_SIZE){
					addToConsole("Error: The number is too long!\n");
					flag = 1;
					allowBreak = true; 
				}
				else{
					if (isalpha(temp)){
						addToConsole("Error: A variable cannot start with a number!\n");
						flag = 1;
						allowBreak = true; 
					}
					else{
						numbers.push(temp);
						temp = text.charAt(0);
						text = text.slice(1, text.length);
						i++;
					}
				}
			}//end of while loop
			
			allowBreak = false; 
			if (flag == 1)
				break;

			//going back one cursor
			if (!feof(temp)){
				text = temp + text; 
			}
			
			$(lexemeTable).append(numbers.join("") + "\t " + NUM_TOKEN + "\n");
			lexicalList = lexicalList + NUM_TOKEN + " " + numbers.join("") + " ";
			numbers = []; //bring it back to zero			
		}
		//Check to see if the char is a letter
		//-------------------------------------------------------------------------------------------------
		else if (isalpha(temp)) {
			array_charact = []; 
			i = 0;
			while (!(ispunct(temp)) && !(isspace(temp)) && !feof(temp) && temp != '\n' && !allowBreak){
				if (i > CHARAC_SIZE){
					addToConsole("Error: The variable name is too long!\n");
					flag = 1;
					allowBreak = true; 
				}
				else{
					array_charact.push(temp);
					temp = text.charAt(0);
					text = text.slice(1, text.length);
					i++;
				}
			}//end of while statement
			allowBreak = false; 

			if (flag == 1){
				break;
			}
			//going back one cursor
			if (!feof(temp)){
				text = temp + text; 
			}
			token = find_token(array_charact);
			$(lexemeTable).append(array_charact.join("").replace(/\s/g, '') + "\t " + token + "\n");
			if (token == 2){
				lexicalList = lexicalList + token + " " + array_charact.join("").replace(/\s/g, '') + " ";
			}
			else{
				lexicalList = lexicalList + token + " ";
			}
			array_charact = [];
		}
		//Check here for punctuation
		//--------------------------------------------------------------------------------------------
		else if (ispunct(temp))	{
			token = find_symbol(temp);
			if (token == 0)	{//then the char was ':', therefore it needs to check next symbol to
				//see whether it is a '='
				temp = text.charAt(0);
				text = text.slice(1, text.length);
				if (temp == '='){   //20 is the default token for ':='
					$(lexemeTable).append(":=\t 20\n");
					lexicalList = lexicalList + "20 ";
				}
				else{//bring the cursor back one and state that it was an invalid symbol
					addToConsole(':' + " is an invalid symbol");
					break;
				}
			}
			else if (token == -1){ //this was an invalid symbol
				addToConsole(temp + " is an invalid symbol");
				flag = 1;
				break;
			}
			else if (token == 11){
					temp = text.charAt(0);
					text = text.slice(1, text.length);
				if (temp == '>'){
					token = 10;
					$(lexemeTable).append("<>\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
				else if (temp == '='){
					token = 12;
					$(lexemeTable).append("<=\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
				else{
					text = temp + text; 
					$(lexemeTable).append("<\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
			}
			else if (token == 13){
				temp = text.charAt(0);
				text = text.slice(1, text.length);
				if (temp == '='){
					token = 14;
					$(lexemeTable).append(">=\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
				else{
					text = temp + text; 
					$(lexemeTable).append("<\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
			}
			else if (token == 7){
				//scan the next char
				temp = text.charAt(0);
				text = text.slice(1, text.length);
				if (temp == '*'){//there was a comment found

					while (!feof(ifp)){
						if (temp == '*'){
							temp = text.charAt(0);
							text = text.slice(1, text.length);
							if (temp == '/')
								break;
						}
						temp = text.charAt(0);
						text = text.slice(1, text.length);
					}//end of while loop

				}
				else{
					text = temp + text; 
					$(lexemeTable).append("/\t " + token + "\n");
					lexicalList = lexicalList + token + " ";
				}
			}
			else{
				$(lexemeTable).append(temp + "\t " + token + "\n");
				lexicalList = lexicalList + token + " ";
			}
			if (flag == 1)//need to break out of the loop since there was an invalid symbol
				break;
		}
		//This is for any white space or next line, etc.
		else{ }
	}
	$(tokens).append(lexicalList); 
	//Now Call the Parser
	addToConsole("No errors found by the Lexical Machine.");
	console.log("Lexical Analyzer Machine is complete!\n"); 
	
	addToConsole("Starting Syntax Analyzer Machine");  
	main_Parser(); 
}
function find_symbol(symbol)
{
	var token;
	switch (symbol){
	case '+':
		token = 4;
		break;

	case ',':
		token = 17;
		break;

	case '*':
		token = 6;
		break;

	case '/':
		token = 7;
		break;

	case '(':
		token = 15;
		break;

	case ')':
		token = 16;
		break;

	case '=':
		token = 9;
		break;

	case '.':
		token = 19;
		break;

	case '<':
		token = 11;
		break;

	case '>':
		token = 13;
		break;

	case ';':
		token = 18;
		break;

	case '-':
		token = 5;
		break;

	case ':':
		token = 0;
		break;

	default: //in case this is a invalid symbol
		token = -1;
	}//end of switch statement

	return token;

}//end of find_symbol function

function find_token(array_charact)
{
	var token;
	var tempArray = array_charact.join("").replace(/\s/g, ''); 
	if (tempArray == "var"){
		token = 29;
	}
	else if (tempArray == "const"){
		token = 28;
	}
	else if (tempArray == "procedure"){
		token = 30;
	}
	else if (tempArray == "call"){
		token = 27;
	}
	else if (tempArray == "begin"){
		token = 21;
	}
	else if (tempArray == "end"){
		token = 22;
	}
	else if (tempArray == "if"){
		token = 23;
	}
	else if (tempArray == "then"){
		token = 24;
	}
	else if (tempArray == "else"){
		token = 33;
	}
	else if (tempArray == "while"){
		token = 25;
	}
	else if (tempArray == "do"){
		token = 26;
	}
	else if (tempArray == "read"){
		token = 32;
	}
	else if (tempArray == "write"){
		token = 31;
	}
	else if (tempArray == "odd"){
		token = 8;
	}
	else{
		token = 2;
	}
	return token;
}//end of find_token function
