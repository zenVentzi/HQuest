import React from 'react';

const RatingUnit = (props) => {
  let classes = 'rating-unit';

  if (props.active) {
    classes += ' active';
  }

  return (
    <div className="tooltip">
      <button
        className={classes}
        onClick={() => { props.clickHandler(props.id); }}
      />
      <span className="tooltiptext">Tooltip text</span>
    </div>
  );
};

export default RatingUnit;
