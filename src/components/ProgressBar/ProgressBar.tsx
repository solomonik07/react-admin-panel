import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar: React.FC = () => {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar} />
    </div>
  );
};

export default ProgressBar;