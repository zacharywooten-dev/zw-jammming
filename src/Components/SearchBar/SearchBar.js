import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'term': ''
    };
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search() {
    console.log('Search Button clicked...');
    console.log('Searching for term: ' + this.state.term);
    this.props.onSearch(this.state.term);
  }

  handleTermChange(event) {
    this.setState({'term': event.target.value});
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          onChange={this.handleTermChange}
          placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
