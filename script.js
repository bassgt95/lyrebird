const { Melody, Note, Measure, pitchValues, songs } = require('./pitchAnalysis');

$(document).ready(function () {
    // const { Melody, songs } = require('./pitchAnalysis');

    const Tone = require('tone');
    var keyToPitch = { "a":"B2", "s":"C3", "e":"C#3", "d":"D3", "r":"D#3", "f":"E3", "g":"F3", "y":"F#3", "h":"G3", "u":"G#3", "j":"A3", "i":"A#3", "k":"B3", "l":"C4" }

    var synth = new Tone.PolySynth(6, Tone.Synth, {
        "oscillator" : {
            "type": "triangle",
            "partials" : [0, 2, 3, 4],
        }
    }).toMaster();

    let song = [[]], beat = 0;;

    // let metronomeOn = false;

    $('#clear-btn').on('click', (e) => {
        song = [[]];
        beat = 0;
        $('#query-display').text('');
        $('#subtitle').text('Play us the tune that\'s been stuck in your head and we\'ll identify it for you!')
    });

    const skipBeat = (amt) => {
        beat += amt;
        if (beat >= 4) {
            beat = beat % 4;
            song.push([]);
        }
        $('#beat').text(beat);
    }

    const undo = () => {
        if (song[song.length - 1].length) song[song.length - 1].pop();
        else song.pop();
        beat = song[song.length - 1].length ?
            Number(song[song.length - 1][song[song.length - 1].length - 1].split(':')[2]) + 0.25
            : 0;
        $('#query-display').text(song.map(measure => '[' + measure.join(', ') + ']').join(',\n'));
        $('#beat').text(beat);
    }

    const handleNote = function (e) {
        // if (metronomeOn) {
            e.preventDefault();
            let pitch = this.firstElementChild.innerText;
            console.log(pitch);
            let note = pitch + ':' + this.firstElementChild.id;
            pitch += this.firstElementChild.id;
            console.log(note);
            note += ':' + beat;
            beat += 0.25;
            if (beat >= 4) {
                beat = 0;
                song.push([]);
            }
            $('#beat').text(beat);
            song[song.length - 1].push(note);
            console.log(pitch);
        // }
        Tone.context.resume().then(() => {
            synth.triggerAttack(pitch, Tone.context.currentTime)
        }).then(() => {
            synth.triggerRelease(pitch)
        });
        // this.addClass('.active');
        $('#query-display').text(song.map(measure => '[' + measure.join(', ') + ']').join(',\n'));
    }

    $('.white-key').on('click', handleNote);
    $('.black-key').on('click', handleNote);

    $(document).on('keypress', function(e) {
        console.log(e.keyCode)
        const key = $('#' + e.keyCode);
        if (key) {
            key.trigger('click');
        }
        if (e.keyCode === 49) skipBeat(0.25);
        if (e.keyCode === 50) skipBeat(0.5);
        if (e.keyCode === 51) skipBeat(0.75);
        if (e.keyCode === 52) skipBeat(1);
        if (e.keyCode === 45) undo();
    });

    $('metronome-btn').on('click', function(e) {
        $('metronome-btn').addClass('.active');
    });

    $('#submit-btn').on('click', function(e) {
        const query = new Melody(
            '_query', '_user', song, $('#key').innerText || 'C', $('#time-signature').innerText || '4/4'
        );
        while (query.measures[query.measures.length -1].length === 0) query.measures.pop();
        console.log(query.measures)
        const output = query.match(songs);
        $('#subtitle').text(output);
    })
});