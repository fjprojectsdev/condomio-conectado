import React from 'react';
import { Link } from 'react-router-dom';
import { Chat } from '../components/Chat';
import { ThemeToggleButton } from '../components/ThemeToggleButton'; // 1. Importar o botão
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.headerNav}>
        {/* 2. Adicionar o botão de tema ao lado do link de configurações */}
        <ThemeToggleButton />
        <Link to="/settings" className={styles.headerLink}>
          Ir para Configurações
        </Link>
      </nav>

      <div className={styles.mainContent}>
        <h1>Página Inicial</h1>
        <p>Funcionalidades principais do condomínio aqui.</p>

        <div className={styles.quickActionsSection}>
          {/* Comentário da versão anterior:
          <h2>Ações Rápidas</h2> */}
          <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
          <div className={styles.actionsContainer}>
            <button className={styles.actionButton}>Agendar Salão</button>
            <button className={styles.actionButton}>Novo Comunicado</button>
          </div>
        </div>

        {/* 3. Aplicar o estilo correto ao título do chat */}
        <h2 className={styles.sectionTitle}>Mural de Comunicação (Chat Geral)</h2>
        <Chat roomId="geral" />
      </div>
    </div>
  );
};