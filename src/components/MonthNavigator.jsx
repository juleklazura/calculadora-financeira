import React from 'react';
import './MonthNavigator.css';

const MonthNavigator = ({ label, onPrevious, onNext }) => {
  return (
    <div className="month-navigator">
      <button
        type="button"
        onClick={onPrevious}
        className="month-nav-btn"
        title="Mês anterior"
        aria-label="Mês anterior"
      >
        ‹
      </button>
      <h2 className="month-label">{label}</h2>
      <button
        type="button"
        onClick={onNext}
        className="month-nav-btn"
        title="Próximo mês"
        aria-label="Próximo mês"
      >
        ›
      </button>
    </div>
  );
};

export default MonthNavigator;
