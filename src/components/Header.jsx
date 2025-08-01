import React, { useEffect, useRef } from 'react';
import './Header.css';

const Header = () => {
  const titleRef = useRef(null);
  const underlineRef = useRef(null);

  useEffect(() => {
    const updateUnderlineWidth = () => {
      if (titleRef.current && underlineRef.current) {
        const titleWidth = titleRef.current.offsetWidth;
        underlineRef.current.style.width = `${titleWidth}px`;
      }
    };

    updateUnderlineWidth();
    window.addEventListener('resize', updateUnderlineWidth);

    return () => {
      window.removeEventListener('resize', updateUnderlineWidth);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-ornament top-ornament">
        <div className="ornament-line"></div>
        <div className="ornament-diamond">◆</div>
        <div className="ornament-line"></div>
      </div>
      
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-inner">
              <span className="logo-icon">£</span>
            </div>
            <div className="logo-ring"></div>
          </div>
          <div className="title-section">
            <h1 className="title">
              <span ref={titleRef} className="title-main">Calculadora Financeira</span>
            </h1>
            <div className="title-underline">
              <div ref={underlineRef} className="underline-ornament"></div>
            </div>
          </div>
        </div>
        <p className="subtitle">
          <span className="subtitle-text">Gerencie seus gastos com elegância e distinção</span>
          <span className="subtitle-motto">— Tradição em controle financeiro —</span>
        </p>
      </div>
      
      <div className="header-ornament bottom-ornament">
        <div className="ornament-pattern">
          <span>◊</span>
          <span>◆</span>
          <span>◊</span>
          <span>◆</span>
          <span>◊</span>
        </div>
      </div>
      
      <div className="decorative-line">
        <div className="line-segment"></div>
        <div className="line-ornament">❖</div>
        <div className="line-segment"></div>
      </div>
    </header>
  );
};

export default Header;
