import React, { Component } from 'react';
import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends Component {
  render() {
    return (
      <div className='TrackList'>
        {this.props.tracks.map(track =>
          <Track
            track={track}
            key={track.id}
            isRemoval={this.props.isRemoval}
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}/>)};
      </div>
    );
  }
}

export default TrackList;
