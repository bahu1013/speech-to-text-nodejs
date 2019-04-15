import React from 'react';
import PropTypes from 'prop-types';
const hStyle = { color: 'black' };

const highlight = (input, regexes) => {
        if (!regexes.length) {
            return input;
        }
        let split = input.split(regexes[0]);
        let replacements = input.match(regexes[0]);
        let result = [];
        for (let i = 0; i < split.length - 1; i++) {
            result.push(highlight(split[i], regexes.slice(1)));
            result.push(<b style={ hStyle } key={i}>{replacements[i]}</b>);
        }
        result.push(highlight(split[split.length - 1], regexes.slice(1)));
        return result;
    }
export default function Transcript(props) {
  let regexes = props.keywords.map(word => new RegExp(`\\b${word}\\b`, 'ig'));	
  try {
    // When resultsBySpeaker is enabled, each msg.results array may contain multiple results.
    // The result_index is for the first result in the message,
    // so we need to count up from there to calculate the key.
    const results = props.messages.map(msg => msg.results.map((result, i) => (
      <span key={`result-${msg.result_index + i}`}>{highlight(result.alternatives[0].transcript, regexes)}</span>
    ))).reduce((a, b) => a.concat(b), []); // the reduce() call flattens the array
    return (
      <div>
        {results}
      </div>
    );
  } catch (ex) {
    console.log(ex);
    return <div>{ex.message}</div>;
  }
}

Transcript.propTypes = {
  messages: PropTypes.array.isRequired, // eslint-disable-line
};
