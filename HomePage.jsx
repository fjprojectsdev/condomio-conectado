import React from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../components/Chat';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.headerNav}>
        <Link to="/settings" className={styles.headerLink}>
          Ir para Configurações
        </Link>
      </nav>

      <div className={styles.mainContent}>
        <h1>Página Inicial</h1>
        <p>Funcionalidades principais do condomínio aqui.</p>

        <div className={styles.quickActionsSection}>
          <h2>Ações Rápidas</h2>
          <div className={styles.actionsContainer}>
            <button className={styles.actionButton}>Agendar Salão</button>
            <button className={styles.actionButton}>Novo Comunicado</button>
          </div>
        </div>

        <h2>Mural de Comunicação (Chat Geral)</h2>
        <Chat roomId="geral" />
      </div>
    </div>
  );
};