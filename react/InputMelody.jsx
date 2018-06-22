const React = require('react');
const BlackKey = require('./BlackKey.jsx');
const WhiteKey = require('./WhiteKey.jsx');

class InputMelody extends React.Component {

    constructor() {
        this.state = {
            
        }
    }

    handleClick(evt) {
        
    }

    render() {
        <div id="keyboard">
            <WhiteKey pitch="C" />
            <WhiteKey pitch="D" />
            <WhiteKey pitch="E" />
            <WhiteKey pitch="F" />
            <WhiteKey pitch="G" />
            <WhiteKey pitch="A" />
            <WhiteKey pitch="B" />
            <WhiteKey pitch="C" />
        </div>
    }

}

module.exports = InputMelody;