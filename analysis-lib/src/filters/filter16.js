// filter: Invalid Capitalization
'use strict';

const { getTextBetweenParentheses } = require('../scripts/string-utils');
const { stringToTitleCase } = require('../scripts/string-utils');
const { capitalize } = require('../scripts/string-utils');
const { isTitleCase } = require('../scripts/string-utils');
const { isSentenceCase } = require('../scripts/string-utils');

// Converts value inside parens to title case
const parensValToTitleCase = function(string) {

  // capitalizes first and last words wrapped in parens
  const parenthesesValue = getTextBetweenParentheses(string) || [];

  parenthesesValue.forEach((sentence, i) => {

    const words = sentence.split(" ");
    let _sentence = "";

    words.forEach((word, j) => {

      // if first or last word, capitalize
      if(j === 0 || j === words.length - 1){
        word = word.replace(/(\(|\[|\{|\)|\]|\})/g, '');
        word = capitalize(word);
      }

      _sentence += word + " ";

    });

    // wrap val in parentheses
    _sentence = "(" + _sentence.trim() + ")";

    string = string.replace(sentence, _sentence);

  });

  return string;

};

// Converts value inside parens to sentence case
const parensValToSentenceCase = function(string) {

  // capitalizes first and last words wrapped in parens
  const parenthesesValue = getTextBetweenParentheses(string) || [];

  parenthesesValue.forEach((sentence, i) => {

    sentence = sentence.replace(/(\(|\[|\{|\)|\]|\})/g, '');
    const _sentence = capitalize(sentence);
    string = string.replace(sentence, _sentence);

  });

  return string;

};

module.exports = function(dataset) {

  const filterName = 'filter16';
  const filterMeta = require('./filters-meta')[filterName];

  const defaultErrorType = filterMeta['type'];
  const defaultExplanationId = 'default';

  let { stopWords } = require('../scripts/string-utils');

  const fields = ['release_name', 'track_name'];

  const occurrences = [];

  // here we assume the album has only one release language
  let language = dataset[0]['release_meta_language'];
  language = language ? language.trim().toLowerCase() : 'english';

  // language not supported
  if(!(language in stopWords)) { return false; }

  stopWords = stopWords[language];

  // keeps track of the last case found
  let lastCase = '';

  dataset.forEach((row, idx) => {

    const occurrence = {
      'row_id': idx + 1,
      'field': [],
      'value': [],
      'explanation_id': [],
      'error_type': [],
    };

    // release_name and track_name
    fields.forEach(field => {

      // builds valid string
      let value = row[field];

      // rules for english language
      if(language === 'english') {

        value = stringToTitleCase(value);

        // explodes string
        value = value.split(' ');

        // converts stopwords to lowercase
        value.forEach((word, j) => {

          const _word = word.toLowerCase();

          // if word is on stopwords list
          if(stopWords.indexOf(_word) !== -1) {

            const previousWord = value[j - 1];
            const nextWord = value[j + 1];

            // If
            //   * next/previous word is "-"
            //   * next/previous word is "/"
            //   * previous word ends in ":"
            //   * current word ends in ":"
            // then keeps it capitalized. Otherwise, lowercases it
            if(previousWord && (
              previousWord !== '-'
            && previousWord !== '/'
            && previousWord[previousWord.length -1] !== ':'
            && _word[_word.length - 1] !== ':'
            && nextWord !== '-'
            && nextWord !== '/')
              ){ value[j] = _word; }

          }

        });

        // capitalizes first and last words of string
        value[0] = capitalize(value[0]);
        value[value.length - 1] = capitalize(value[value.length - 1]);

        // joins string again
        value = value.join(" ");
        value = parensValToTitleCase(value);

        // tests if original value is equals valid string. Reports if it's not
        if(value !== row[field]) {

          occurrence.field.push(field);
          occurrence.value.push(row[field]);
          occurrence.explanation_id.push(defaultExplanationId);
          occurrence.error_type.push(defaultErrorType);

        }

      }

      // rules for portuguese/spanish
      if(language === 'portuguese' || language === 'spanish') {

        let _case;

        // checks if value is medley
        const isMedley = value.split(" ")[0].match(/medley|series|pot\-pourri|potpourri|popurrí/i);

        // creates a valid sentence case of this title
        let expectedSentenceCase = capitalize(value.toLowerCase());
        expectedSentenceCase = expectedSentenceCase.split(" ");

        // converts stopwords to lowercase
        expectedSentenceCase.forEach((word, j) => {

          const previousWord = expectedSentenceCase[j - 1];
          const _word = word.toLowerCase();

          // if word is after a '/', a '-' or a ':' and it's a medley
          if(
            previousWord
            && ((previousWord[previousWord.length -1] === ':' && isMedley)
            || previousWord === "/"
            || previousWord === "-")
          ) { expectedSentenceCase[j] = capitalize(word); }

          // if it's not medley, lowercase it
          else if(
            previousWord
            && (previousWord[previousWord.length -1] === ':' && !isMedley)
          ) { expectedSentenceCase[j] = _word; }

        });

        expectedSentenceCase = expectedSentenceCase.join(" ");
        expectedSentenceCase = parensValToSentenceCase(expectedSentenceCase);

        // if value is sentence case
        if(value === expectedSentenceCase) {

          _case = 'sentence';

          // first run, stashes it
          if(!lastCase) {
            lastCase = _case;
          }

          // current case style is different from the previous one
          else if(lastCase !== _case) {
            occurrence.field.push(field);
            occurrence.value.push(row[field]);
            occurrence.explanation_id.push('inconsistent');
            occurrence.error_type.push(defaultErrorType);
          }

        }

        // if it's not sentence case, tries title case
        if(!_case) {

          let expectedTitleCase = stringToTitleCase(value);
          expectedTitleCase = expectedTitleCase.split(" ");

          // converts stopwords to lowercase
          expectedTitleCase.forEach((word, j) => {

            const _word = word.toLowerCase();
            const previousWord = value[j - 1];
            const nextWord = value[j + 1];

            // if word is on stopwords list
            if(stopWords.indexOf(_word) !== -1) {

              // If
              //   * next/previous word is "-"
              //   * next/previous word is "/"
              //   * previous word ends in ":"
              //   * current word ends in ":"
              // then keeps it capitalized. Otherwise, lowercases it
              if(
                  previousWord
                  && (previousWord !== '-'
                  && previousWord !== '/'
                  && previousWord[previousWord.length -1] !== ':'
                  && _word[_word.length - 1] !== ':'
                  && nextWord !== '-'
                  && nextWord !== '/')
              ){ expectedTitleCase[j] = _word; }

            }

            // if word is after a '/', a '-' or a ':' and it's a medley
            if(
                previousWord
                && ((previousWord[previousWord.length -1] === ':' && isMedley)
                || previousWord === "/"
                || previousWord === "-")
            ) { expectedTitleCase[j] = capitalize(word); }

            // if it's not medley, lowercase it
            else if(
              previousWord
              && (previousWord[previousWord.length -1] === ':' && !isMedley)
            ) { expectedTitleCase[j] = _word; }

          });

          expectedTitleCase = expectedTitleCase.join(" ");
          expectedTitleCase = parensValToTitleCase(expectedTitleCase);

          if(value === expectedTitleCase) {

            _case = 'title';

            // first run
            if(!lastCase) {
              lastCase = _case;
            }

            // inconsistent case
            else if(lastCase !== _case) {
              occurrence.field.push(field);
              occurrence.value.push(row[field]);
              occurrence.explanation_id.push('inconsistent');
              occurrence.error_type.push(defaultErrorType);
            }

          }

        }

        // neither title nor sentence case
        if(!_case) {

          occurrence.field.push(field);
          occurrence.value.push(row[field]);
          occurrence.explanation_id.push(defaultExplanationId);
          occurrence.error_type.push(defaultErrorType);

        }

      }

    });

    // if there's an occurrence, saves it
    if(occurrence.field.length > 0) { occurrences.push(occurrence); }

  });

  return occurrences;

};
