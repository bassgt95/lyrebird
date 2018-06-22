const chalk = require('chalk');
const levenshtein = require('fast-levenshtein');
const pitchValues = require('./pitchValues');
let {
    odeToJoy,
    axelF,
    maryHad,
    hotCrossBuns,
    route1
} = require('./songs');

class Note {

    constructor(note, tonic) {
        note = note.split(':');
        this.relativePitch = note[0];
        // this.octave = Number(note[1]);
        this.beat = Number(note[2]);
        console.log('PITCH VALUES', pitchValues)
        this.exactPitch = (pitchValues[this.relativePitch].step + pitchValues[tonic].step) % 12;
    }

}

class Measure {

    constructor(measure, tonic) {
        this.notes = measure.map(note => new Note(note, tonic));
        this.tune = this.notes.map(note => note.exactPitch);
        this.rhythm = this.notes.map(note => note.beat);
        this.hash = this.notes.map(
            note => String.fromCharCode(note.exactPitch + 100) + String.fromCharCode(Number(note.beat) * 8)
        ).join('');
    }

    compare(query) {
        const distance = levenshtein.get(query.hash, this.hash);
        console.log(distance);
        return 1 - distance / (this.hash.length + query.hash.length);
    }

}

class Melody {

    constructor(name, artist, song, tonic, timeSignature) {
        this.name = name;
        this.artist = artist;
        this.measures = song.map(measure => new Measure(measure, tonic));
        this.tonic = tonic;
        this.timeSignature = timeSignature;
        this.fingerprints = this.measures.map(
            measure => measure.hash
        );
        this.compare = this.compare.bind(this);
    }

    compare(query) {
        let maxSimilarity = 0;
        console.log('this.measures.length: ', this.measures.length);
        console.log('query.measures.length: ', query.measures.length);
        for (let i = 0; i <= this.measures.length - query.measures.length; i++) {
            console.log(chalk.red('PASS: ', i + 1))
            let snippet = this.measures.slice(i, i + query.measures.length);
            let similarity = snippet.reduce((total, measure, index) => {
                return measure.compare(query.measures[index]) + total;
            }, 0) / snippet.length;
            console.log(chalk.blue(similarity));
            if (similarity > maxSimilarity) maxSimilarity = similarity;
            console.log(chalk.green(maxSimilarity))
            if (maxSimilarity === 1) break;
        }
        return maxSimilarity;
    }

    match(db) {
        const similarities = {};
        const matches = db.filter(song => {
            similarities[song.name] = song.compare(this);
            return song.timeSignature === this.timeSignature && similarities[song.name] >= 0.85;
        }).map(song => song.name + ', ' + song.artist + ': ' + Math.floor(similarities[song.name] * 100) + '% match');
        if (!matches.length) return 'No matches found.'
        return matches[0];
    }

}

odeToJoy = new Melody('Ode to Joy (Ninth Symphony)', 'Ludwig Van Beethoven', odeToJoy, 'C', '4/4');
axelF = new Melody('Axel F', 'Crazy Frog', axelF, 'C', '4/4');
maryHad = new Melody('Mary Had A Little Lamb', 'Sarah Joseph Hale and John Rousltone', maryHad, 'C', '4/4');
hotCrossBuns = new Melody('Hot Cross Buns', 'Unknown', hotCrossBuns, 'C', '4/4');
route1 = new Melody('Route 1 (Pokémon)', 'Junichi Masuda', route1, 'C', '4/4');

const songs = [
    odeToJoy,
    axelF,
    maryHad,
    hotCrossBuns,
    route1
]

let route1Alt = [
    ['C:1:3.5', 'D:1:3.75'],

    ['E:1:0', 'E:1:0.5', 'E:1:1', 'C:1:1.5', 'D:1:1.75', 'E:1:2', 'E:1:2.5', 'E:1:3', 'C:1:3.5', 'D:1:3.75'],
    ['E:1:0', 'E:1:0.5', 'F:1:1', 'E:1:1.75', 'D:1:2'],
];
route1Alt = new Melody('query', 'user', route1Alt, 'C', '4/4');

console.log(
    chalk.magenta(
        odeToJoy.match(songs)
    )
);

module.exports = {
    Note, Melody, Measure, songs, pitchValues
}