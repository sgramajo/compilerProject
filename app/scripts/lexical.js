/*
	Stacy Gramajo
	Homework 2: Lexical Analyzer
	Febuary 4, 2017
*/

//Constants there were defined in the requirements
const NUMBER_SIZE = 4; 
const CHARAC_SIZE = 10; 
const NUM_ARRAY_SIZE = 6; 
const CHAR_ARRAY_SIZE = 12; 
const NUM_TOKEN = 3; 
var tokens = "#tokens", lexemeTable = "#home"; 

function main_Lexical()
{
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
		alert(temp + " line 28\nText: " + text); 
		var allowBreak = false; 
		//checks to see if it is a digit
		//If so then it will save it into an array
		if (isdigit(temp)){
			i = 0;
			alert("inside digit"); 
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
						alert(temp + " line 51\nText: " + text); 
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
			$(tokens).append(NUM_TOKEN + " " + numbers.join("") + " ");
			numbers = []; //bring it back to zero			
		}
		//Check to see if the char is a letter
		//-------------------------------------------------------------------------------------------------
		else if (isalpha(temp)) {
			array_charact = []; 
			alert("Here!!! line 71"); 
			i = 0;
			while (!(ispunct(temp)) && !(isspace(temp)) && !feof(temp) && temp != '\n' && !allowBreak){
				alert("Line 75");  
				if (i > CHARAC_SIZE){
					addToConsole("Error: The variable name is too long!\n");
					flag = 1;
					allowBreak = true; 
				}
				else{
					array_charact.push(temp);
					temp = text.charAt(0);
					text = text.slice(1, text.length);
					alert("temp is " + temp + "\nText: " + text); 
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
			alert("Line 100!!!\nArrayCharacter: " + array_charact);
			$(lexemeTable).append(array_charact.join("") + "\t " + token + "\n");
			if (token == 2){
				$(tokens).append(token + " " + array_charact + " ");
			}
			else{
				$(tokens).append(token + " ");
			}
			array_charact = [];
		}
		//Check here for punctuation
		//--------------------------------------------------------------------------------------------
		else if (ispunct(temp))	{
			alert("Line 116"); 
			token = find_symbol(temp);
			if (token == 0)	{//then the char was ':', therefore it needs to check next symbol to
				//see whether it is a '='
				temp = text.charAt(0);
				text = text.slice(1, text.length);
				if (temp == '='){   //20 is the default token for ':='
					$(lexemeTable).append(":=\t 20\n");
					$(tokens).append("20 ");
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
					$(tokens).append(token + " ");
				}
				else if (temp == '='){
					token = 12;
					$(lexemeTable).append("<=\t " + token + "\n");
					$(tokens).append(token + " ");
				}
				else{
					text = temp + text; 
					$(lexemeTable).append("<\t " + token + "\n");
					$(tokens).append(token + " ");
				}
			}
			else if (token == 13){
				temp = text.charAt(0);
				text = text.slice(1, text.length);
				if (temp == '='){
					token = 14;
					$(lexemeTable).append(">=\t " + token + "\n");
					$(tokens).append(token + " ");
				}
				else{
					text = temp + text; 
					$(lexemeTable).append("<\t " + token + "\n");
					$(tokens).append(token + " ");
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
					$(tokens).append(token + " ");
				}
			}
			else{
				$(lexemeTable).append(temp + "\t " + token + "\n");
				$(tokens).append(token + " ");
			}
			if (flag == 1)//need to break out of the loop since there was an invalid symbol
				break;
		}
		//This is for any white space or next line, etc.
		else{ alert("Delete later --- white space detected"); }
	}
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

	if (array_charact.join("") == "var"){
		token = 29;
	}
	else if (array_charact.join("") == "const"){
		token = 28;
	}
	else if (array_charact.join("") == "procedure"){
		token = 30;
	}
	else if (array_charact.join("") == "call"){
		token = 27;
	}
	else if (array_charact.join("") == "begin"){
		token = 21;
	}
	else if (array_charact.join("") == "end"){
		token = 22;
	}
	else if (array_charact.join("") == "if"){
		token = 23;
	}
	else if (array_charact.join("") == "then"){
		token = 24;
	}
	else if (array_charact.join("") == "else"){
		token = 33;
	}
	else if (array_charact.join("") == "while"){
		token = 25;
	}
	else if (array_charact.join("") == "do"){
		token = 26;
	}
	else if (array_charact.join("") == "read"){
		token = 32;
	}
	else if (array_charact.join("") == "write"){
		token = 31;
	}
	else if (array_charact.join("") == "odd"){
		token = 8;
	}
	else{
		token = 2;
	}

	return token;
}//end of find_token function
