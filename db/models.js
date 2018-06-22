import Sequelize from "sequelize";
import db from './db';
// import Melody from '../pitchAnalysis';
const levenshtein = require('fast-levenshtein');

export const Song = db.define('song', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tonic: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    genre: {
        type: Sequelize.STRING,
        defaultValue: 'uncategorized'
    },
    fingerprints: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
    },
    similarity: {
        type: Sequelize.VIRTUAL,
        get() {
            this.compare(query)
        }
    }
});

Song.prototype.compare = (query) => { //query is an array of fingerprints
    let maxSimilarity = 0;
    for (let i = 0; i <= this.fingerprints.length - query.length; i++) {
        console.log(chalk.red('PASS: ', i + 1))
        let snippet = this.fingerprints.slice(i, i + query.measures.length);
        let similarity = snippet.reduce((total, fingerprint, index) => {
            let distance = levenshtein.get(fingeprint, query[index]);
            return (1 - distance / (fingerprint.length + query[index].length)) + total;
        }, 0) / snippet.length;
        console.log(chalk.blue(similarity));
        if (similarity > maxSimilarity) maxSimilarity = similarity;
        console.log(chalk.green(maxSimilarity))
        if (maxSimilarity === 1) break;
    }
    return maxSimilarity;
}