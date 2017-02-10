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

function main()
{

}
function find_symbol(symbol)
{
	var token;
	switch (symbol)
	{
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

	if (array_charact == "var"){
		token = 29;
	}
	else if (array_charact == "const"){
		token = 28;
	}
	else if (array_charact == "procedure"){
		token = 30;
	}
	else if (array_charact == "call"){
		token = 27;
	}
	else if (array_charact == "begin"){
		token = 21;
	}
	else if (array_charact == "end"){
		token = 22;
	}
	else if (array_charact == "if"){
		token = 23;
	}
	else if (array_charact == "then"){
		token = 24;
	}
	else if (array_charact == "else"){
		token = 33;
	}
	else if (array_charact == "while"){
		token = 25;
	}
	else if (array_charact == "do"){
		token = 26;
	}
	else if (array_charact == "read"){
		token = 32;
	}
	else if (array_charact == "write"){
		token = 31;
	}
	else if (array_charact == "odd"){
		token = 8;
	}
	else{
		token = 2;
	}

	return token;
}//end of find_token function
