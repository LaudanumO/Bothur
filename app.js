'use strict';
var fs = require('fs');
var path = require('path');
var myFiles = [];
var moveFrom = '../Pratchett';
var text;
//var book = readContents(moveFrom);
var counter = 0;
var dict = {};//dict is an object
//getMyDict(200, 'Captain Carrot');
//step 1: read text file into string
//step 2: split the words into an array of words
//step 3: create an object for each unique word and a probability to be after each unique trio, pair, and word
//step 4: create an object for each unique pair and a probability to be after each unique trio, pair, and word
//step 5: create an object for each unique trio and a probability to be after each unique trio, pair, and word
/*{
   word1:{worda:0.8,wordb:0.1,...,wordn:0.005},
   word2:{worda:02,wordb:0.3,...,wordn:0.1},
    ...,
    wordx:{worda:0.5,wordb:0.1,...,wordn:0.04}
} 
*/
function readContents(rootDir) {
    // Loop through all the files in the temp directory
    fs.readdir(rootDir,
        function (err, files) {
            if (err) {//error message
                console.error("Could not list the directory.", err);
                process.exitCode = 1;
            }
            counter = files.length;
            files.forEach(function (file, index) {
                // Make one pass and process all contents
                var fromPath = path.join(rootDir, file);
                fs.stat(fromPath, function (error, stat) {
                    var contents = processFileInfo(error, stat, fromPath);
                    //culmination of everything so far(the words ready to be processed)
                });
            });
        });
    
}
function seperateText() {
    while (counter > 0) {

    };
    text = myFiles.join(' ');//so the words can be specified as 'each word is seperated by a space'
    text = text.replace(/[^\w\s?!.][0-9][.{2}]-|_/g, "").replace(/\s+/g, " ").split(' ');
    getUniqueWords(text);
    findNext();
};

function processFileInfo(error, stat, fromPath) {
    var outstr;
    if (error) { //error message
        console.error("Error stating file.", error);
        return; 
    }
    if (stat.isFile()) {
        var extension = fromPath.split('.');
        if (extension.length > 1 && extension[extension.length - 1] === 'txt') {
            //finding the right files and showing the computer where they are
            fs.readFile(fromPath,
                function (err, buf) {
                    counter--;
                    var outstr = buf.toString();//converting the 10s to legible words
                    myFiles.push(outstr);//adding the words to myFiles
                    if (counter === 0) {
                        seperateText();
                    }
                });
        }
    }
}

function getUniqueWords(wordList) {
    var lastWord = '';
    wordList.forEach(function (word, index) {
        var twoWord = [lastWord, word].join(' ').trim();
        if (dict.hasOwnProperty(twoWord)) {
            dict[twoWord].this_count++
        }
        else {
            dict[twoWord] = {this_count : 1};   
        }
        lastWord = word;
     });    
    return dict;
};

//-------------------------------------------------------------

function findNext() {
    var bigNumber = text.length;
    for (var index = 0; index < bigNumber - 3; index++) {
        var word = text[index] + ' ' + text[index + 1];
        var wordObj = dict[word];
        var next = text[index + 2] + ' ' + text[index + 3];
        if (next.length !== 0){
            if (wordObj.hasOwnProperty(next)) {
                wordObj[next]++
            }
            else {
                wordObj[next] = 1 ;
            }
            if (wordObj.hasOwnProperty('All_of_it_')) {
                wordObj['All_of_it_']++
            }
            else {
                wordObj['All_of_it_'] =  1 ;
            }
        }
    }
    for (var word in dict) {
        if (dict.hasOwnProperty(word)) {
            var wordObj = dict[word];
            var cumulative = 0;
            for (var next in wordObj) {
                if (next !== 'All_of_it_' && next !== 'this_count') {
                    if (wordObj.hasOwnProperty(next)) {
                        cumulative += wordObj[next];
                        wordObj[next] = cumulative / wordObj['All_of_it_'];
                    }
                }
            }
            delete wordObj['All_of_it_'];
            delete wordObj['this_count'];

        }
    }
    fs.writeFile('../ForgottenSheep.txt',
        JSON.stringify(dict, null, 4),
        function (err, data) {
            if (err) console.log(err);
            console.log("Success: '%s' ", '../ForgottenSheep.txt');
            process.exitCode = 0;
        });
};
function getNext(word) {
    var wordObj = dict[word];
    console.log(word);
    var p = Math.random(0, 1);
    for (var next in wordObj) {
        if (wordObj.hasOwnProperty(next) && wordObj[next] >= p) {
            return next;
        }
    }
};
function getMyDict(totalLength, initialWord) {
    fs.readFile('../ForgottenSheep.txt',
        function (err, buf) {
            var outstr = buf.toString();//converting the 10s to legible words
            dict = JSON.parse(outstr);
            var belling = boting([initialWord], totalLength);
        });
};

function boting(chapter, totalLength) {
    //chapter should be an array of strings when doing it for real
    if (chapter.length === 0) {
        chapter.push('Perdita');
    }
    var lastWord = chapter[chapter.length - 1];
    var writing = getNext(lastWord);
    if (writing.length === 0) {
        boting(chapter, totalLength);
        return
    }
    chapter.push(writing);
    var lastChar = writing[writing.length - 1];
    if (chapter.length > totalLength && (lastChar === '.' || lastChar === '?' || lastChar === '!')) {
        var draft = chapter.join(' ');
        fs.writeFile('../RememberedShip.txt',
            draft,
            function (err, data) {
                if (err) console.log(err);
                console.log("Success: '%s' ", '../RememberedShip.txt');
                process.exitCode = 0;
            });
    } else {
        boting(chapter,totalLength);
    }
};

//step1 for the first word is an object and every word that comes directly after it is a proprety of the first word
//step2 each time that a property comes up increase it by one
//step3 add the property values together and divide the total by each individual property
//step4 convert the numbers from step3 into decimals
//step5 then do this for every word
