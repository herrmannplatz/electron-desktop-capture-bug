import React from 'react';
import { desktopCapturer } from 'electron'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      src: '',
      sources: []
    }
  }

  componentDidMount() {
    desktopCapturer.getSources({types: ['screen']}, (error, sources) => {
      if (error) throw error
      
      this.setState({ sources })
    })
  }

  _handleSourceClick(source) {
    console.log('_handleSourceClick')
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    }).then((stream) => {
      this.setState({ src: URL.createObjectURL(stream) })
    }).catch((err) => {
      alert('Failed to get source')
    });
  }

  render() {
    return (<div>
      <ul>
        {this.state.sources.map((source) => <li key={source.id} onClick={() => this._handleSourceClick(source)}>
          <img src={source.thumbnail.toDataURL()}/>
        </li>)}
      </ul>
      <video autoPlay="true" src={this.state.src}></video>
    </div>);
  }
}
