import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/profile.css';

const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Mon Profil</h1>
        <p className="profile-subtitle">
          Gérez vos informations personnelles et préférences
        </p>
      </div>

      <div className="profile-content">
        {/* Section Profil Principal */}
        <div className="profile-card main-profile">
          <div className="profile-card-header">
            <h2>Informations personnelles</h2>
            {!isEditing && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Modifier
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="avatar-section">
              <div className="avatar-container">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="user-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-initials">
                      {formData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <button className="btn btn-outline">
                  Changer l&apos;avatar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Nom d&apos;utilisateur
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Nom d&apos;utilisateur</span>
                  <span className="detail-value">{user?.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Adresse email</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ID utilisateur</span>
                  <span className="detail-value">{user?.id}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Statistiques */}
        <div className="profile-card stats-card">
          <h2>Statistiques d&apos;utilisation</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">12</span>
                <span className="stat-label">Automatisations créées</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">5</span>
                <span className="stat-label">Intégrations connectées</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="stat-content">
                <span className="stat-number">1,247</span>
                <span className="stat-label">Actions exécutées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Sécurité */}
        <div className="profile-card security-card">
          <h2>Sécurité</h2>
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <h3>Mot de passe</h3>
                <p>Dernière modification il y a 2 mois</p>
              </div>
              <button className="btn btn-outline">
                Changer le mot de passe
              </button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h3>Authentification à deux facteurs</h3>
                <p>Sécurisez votre compte avec 2FA</p>
              </div>
              <button className="btn btn-outline">Configurer</button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h3>Sessions actives</h3>
                <p>Gérez vos connexions actives</p>
              </div>
              <button className="btn btn-outline">Voir les sessions</button>
            </div>
          </div>
        </div>

        {/* Section Actions */}
        <div className="profile-card actions-card">
          <h2>Actions du compte</h2>
          <div className="account-actions">
            <button
              className="btn btn-danger logout-btn"
              onClick={handleLogout}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Se déconnecter
            </button>
            <button className="btn btn-outline-danger">
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
