const pitchValues = {

    'C': { step: 0 },
    'D': { step: 2 },
    'E': { step: 4 },
    'F': { step: 5 },
    'G': { step: 7 },
    'A': { step: 9 },
    'B': { step: 11 },

    'C#': { step: 1 },
    'D#': { step: 3 },
    'E#': { get() { this['F'] } },
    'F#': { step: 6 },
    'G#': { step: 8 },
    'A#': { step: 10 },
    'B#': { get() { this['C'] } },

    'Cb': { get() { this['B'] } },
    'Db': { get() { this['C#'] } },
    'Eb': { get() { this['D#'] } },
    'Fb': { get() { this['E'] } },
    'Gb': { get() { this['F#'] } },
    'Ab': { get() { this['G#'] } },
    'Bb': { get() { this['A#'] } },

}

module.exports = pitchValues;