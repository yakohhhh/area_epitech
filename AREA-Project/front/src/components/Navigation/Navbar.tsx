import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-brand">
          <a href="/" className="brand-link">
            <span className="brand-text">AREA</span>
          </a>
        </div>

        {/* Navigation Desktop */}
        <div className="navbar-menu">
          <a href="#features" className="nav-link" onClick={handleNavLinkClick}>
            Fonctionnalités
          </a>
          <a
            href="#how-it-works"
            className="nav-link"
            onClick={handleNavLinkClick}
          >
            Comment ça marche
          </a>
          <a href="#pricing" className="nav-link" onClick={handleNavLinkClick}>
            Tarifs
          </a>
          <a href="#support" className="nav-link" onClick={handleNavLinkClick}>
            Support
          </a>
        </div>

        {/* Boutons d'action */}
        <div className="navbar-actions">
          <button type="button" className="btn btn-ghost">
            Connexion
          </button>
          <button type="button" className="btn btn-primary">
            S&apos;inscrire
          </button>
        </div>

        {/* Menu mobile button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-links">
          <a
            href="#features"
            className="mobile-nav-link"
            onClick={handleNavLinkClick}
          >
            Fonctionnalités
          </a>
          <a
            href="#how-it-works"
            className="mobile-nav-link"
            onClick={handleNavLinkClick}
          >
            Comment ça marche
          </a>
          <a
            href="#pricing"
            className="mobile-nav-link"
            onClick={handleNavLinkClick}
          >
            Tarifs
          </a>
          <a
            href="#support"
            className="mobile-nav-link"
            onClick={handleNavLinkClick}
          >
            Support
          </a>
        </div>
        <div className="mobile-menu-actions">
          <button type="button" className="btn btn-ghost mobile-btn">
            Connexion
          </button>
          <button type="button" className="btn btn-primary mobile-btn">
            S&apos;inscrire
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
