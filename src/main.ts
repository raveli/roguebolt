import Phaser from 'phaser';
import { gameConfig } from './config';

// Create the Phaser game instance
new Phaser.Game(gameConfig);

// Handle window resize (optional)
window.addEventListener('resize', () => {
  // Game maintains fixed resolution, but container can be styled via CSS
});

// Prevent spacebar from scrolling the page
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});
