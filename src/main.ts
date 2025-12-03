import Phaser from 'phaser';
import { gameConfig } from './config';

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Extended ScreenOrientation interface for lock method (not in all TS libs)
interface ExtendedScreenOrientation extends ScreenOrientation {
  lock?: (orientation: 'landscape' | 'portrait' | 'landscape-primary' | 'landscape-secondary' | 'portrait-primary' | 'portrait-secondary' | 'any' | 'natural') => Promise<void>;
}

// Try to lock screen orientation to landscape
const lockOrientation = async () => {
  try {
    // Modern Screen Orientation API
    const orientation = screen.orientation as ExtendedScreenOrientation;
    if (orientation && orientation.lock) {
      await orientation.lock('landscape');
      console.log('Screen orientation locked to landscape');
    }
  } catch (error) {
    // Orientation lock may not be supported or allowed
    // This is expected on iOS Safari - orientation is controlled by device rotation
    console.log('Orientation lock not available:', error);
  }
};

// Create the Phaser game instance
const game = new Phaser.Game(gameConfig);

// Handle window resize - ensure game fits properly
window.addEventListener('resize', () => {
  // Trigger Phaser's scale manager to recalculate
  if (game.scale) {
    game.scale.refresh();
  }
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
  // Small delay to let the browser finish orientation change
  setTimeout(() => {
    if (game.scale) {
      game.scale.refresh();
    }
  }, 100);
});

// Prevent spacebar from scrolling the page
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});

// Prevent default touch behaviors that interfere with gameplay
document.addEventListener('touchmove', (e) => {
  if (e.target === document.body || (e.target as HTMLElement)?.id === 'game-container') {
    e.preventDefault();
  }
}, { passive: false });

// Handle visibility change - pause/resume game
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.sound.pauseAll();
    // Trigger hidden event for pause handling
    game.events.emit('hidden');
  } else {
    game.sound.resumeAll();
    game.events.emit('visible');
  }
});

// Try to lock orientation and go fullscreen on first user interaction
let hasInteracted = false;
const onFirstInteraction = () => {
  if (hasInteracted) return;
  hasInteracted = true;

  lockOrientation();
  // Don't auto-fullscreen as it can be jarring - let user control this
  // requestFullscreen();

  document.removeEventListener('touchstart', onFirstInteraction);
  document.removeEventListener('click', onFirstInteraction);
};

document.addEventListener('touchstart', onFirstInteraction, { once: true });
document.addEventListener('click', onFirstInteraction, { once: true });

// Export game instance for debugging
(window as any).__PHASER_GAME__ = game;
