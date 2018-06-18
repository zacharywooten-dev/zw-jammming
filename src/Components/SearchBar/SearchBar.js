import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(searchTerm) {
    this.props.onSearch = searchTerm;
  }

  handleTermChange(event) {

  }

  render() {
    return (
      <div className="SearchBar">
        <input 
          onChange={this.handleTermChange}
          placeholder="Enter A Song, Album, or Artist" />
        <a>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
