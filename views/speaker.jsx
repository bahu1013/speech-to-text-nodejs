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
export default function SpeakersView(props) {
  let regexes = props.keywords.map(word => new RegExp(`\\b${word}\\b`, 'ig'));	
  try {
	    const results = props.messages.map(msg =>
      // When resultsBySpeaker is enabled, each msg.results array may contain multiple results.
      // The result_index is for the first result in the message,
      // so we need to count up from there to calculate the key.

      // resultsBySpeaker/SpeakerStream sets each results.speaker value once it is known,
      // but can also return results without any speaker set if the speakerlessInterim flag
      // is set (for faster UI updates).
      msg.results.map((result, i) => (
        <div key={`result-${msg.result_index + i}`}>
          <dt>{typeof result.speaker === 'number'
            ? `Speaker ${result.speaker}: `
            : '(Detecting speakers): '}</dt>
          <dd>{highlight(result.alternatives[0].transcript, regexes)}</dd>
        </div>
      ))).reduce((a, b) => a.concat(b), []); // the reduce() call flattens the array
    return (
      <dialog className="speaker-labels">
        {results}
      </dialog>
    );
  } catch (ex) {
    console.log(ex);
    return (
      <span>{ex.message}</span>
    );
  }
}

SpeakersView.propTypes = {
  messages: PropTypes.array.isRequired, // eslint-disable-line
};
