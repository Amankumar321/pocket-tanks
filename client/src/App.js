import Phaser from 'phaser';
import { socket } from './socket/index'
import { MainScene, Scene1, Scene2, Scene3, Scene4, Scene5 } from './scenes';

const gameConfig = {
	title: 'Pocket Tanks',
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: 'rgba(255,100,100)',
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600 * window.devicePixelRatio,
    height: 400 * window.devicePixelRatio,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
    transparent: true,
  },
  callbacks: {
    postBoot: () => {
    },
  },
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
  scene: [Scene1, Scene2, Scene3, Scene4, Scene5, MainScene],
};

window.socket = socket
window.game = new Phaser.Game(gameConfig);

function App() {
  return (
    null
  );
}

export default App;
