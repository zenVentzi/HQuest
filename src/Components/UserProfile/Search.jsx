import React from 'react';
import style from './css/search.css';

const Search = () => (
  <div className="grid-item">
    <div className="search-container">
      <form action="#">
        <input type="text" placeholder="Search.." name="search" />
        {/* <button type="submit">Search</button> */}
      </form>
    </div>
  </div>
);

export default Search;
