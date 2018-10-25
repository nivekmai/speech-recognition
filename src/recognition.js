// Only works in Chrome!!!
/* global webkitSpeechRecognition */

const buildStartListener = (continuous, log) => () => {
    if (log) {
        console.log('Listening for speech' + (continuous ? ' continuously' : ''));
    }
}

const buildEndNotify = (endCallback, log) => () => {
    if (typeof endCallback === 'function') {
        endCallback();
    }
    if (log) {
        console.log('Done listening for speech, call start() to start listening again');
    }
}

const buildResultParser = (interimCallback, finalCallback, continuous, log) => (event) => {
    // results will store past results in the same recognition, 
    // make sure we're only working with results from the latest recogntion
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = res[0] ? res[0].transcript : '';
        if (!transcript) {
            continue;
        }
        if (res.isFinal) {
            finalCallback(transcript);
            if (continuous && log) {
                console.log('Still listening for next speech');
            }
        } else {
            interimCallback(transcript);
        }
    }
}

export const setup = ({
    interimCallback,
    finalCallback,
    endCallback,
    continuous = false,
    log = false,
}) => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = continuous;
    recognition.interimResults = typeof interimCallback === 'function';
    recognition.onresult = buildResultParser(interimCallback, finalCallback, continuous);
    recognition.onstart = buildStartListener(continuous, log);
    recognition.onend = buildEndNotify(endCallback, log);
    return recognition;
}