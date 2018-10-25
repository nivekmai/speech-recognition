import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { setup } from './recognition.js';

class App extends Component {
    recorder = null;
    componentDidMount() {
        this.recorder = setup({
            finalCallback: this.onFinal,
            interimCallback: this.onInterim,
            endCallback: this.onEnd,
            // log: true,
            // continuous: true,
        });
    }
    state = {
        recording: false,
        final_transcript: '',
        interim_transcript: '',
    };
    onRecord = () => {
        const { recording } = this.state;
        if (recording) {
            this.recorder.stop();
            this.setState({ recording: false });
        } else {
            this.recorder.start();
            this.setState({ recording: true });
        }
    }
    onFinal = (final_transcript) => {
        this.setState({ final_transcript, interim_transcript: '' });
    }
    onInterim = (interim_transcript) => {
        this.setState({ interim_transcript, final_transcript: '' });
    }
    onEnd = () => {
        this.setState({ recording: false });
    }
    render() {
        const {
            onRecord,
            state: {
                recording,
                final_transcript,
                interim_transcript
            },
        } = this;
        return (
            <div className="container">
              <button disabled={recording} type="button" onClick={onRecord} className="button" >
                {recording ? 'Recording...' : 'Record'}
              </button>
              {(!!interim_transcript || !!final_transcript) &&
                <div className="speech-bubble output">
                  <div className="muted">
                    {interim_transcript}
                  </div>
                  <div>
                    {final_transcript}
                  </div>
                </div>
              }
          </div>
        );
    }
}

export default App;