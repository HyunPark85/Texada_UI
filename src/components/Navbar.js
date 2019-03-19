import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="ui inverted segment" style={{ marginTop: '2%' }}>
      <div className="ui inverted secondary menu">
        <Link to="/" className="item">
          Products
        </Link>
        <Link to="/reports" className="item">
          Report
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
