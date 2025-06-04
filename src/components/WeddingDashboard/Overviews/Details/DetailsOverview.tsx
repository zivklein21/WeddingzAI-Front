import React from 'react';
import './DetailsOverview.css';

const DetailsOverview = () => (
  <div className="miniDetailsWrapper">
    <div className="miniGrid">
      <div className="miniCard">
        <div className="miniTitle">Song Suggestions</div>
        <div className="miniList">
          <div><span className="bold">Adore You</span> <span className="sep">|</span> Harry Styles</div>
          <div><span className="bold">Perfect</span> <span className="sep">|</span> Ed Sheeran</div>
          <div><span className="bold">Memories</span> <span className="sep">|</span> Maroon 5</div>
        </div>
      </div>
    </div>
  </div>
);

export default DetailsOverview;