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
    width: 1200,
    height: 800,
  },
  physics: {
    default: 'arcade',
    arcade : {
      debug: false
  }  
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

const openFullscreen = () => {
  var elem = document.getElementsByTagName('canvas')[0];
  console.log(elem)
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

window.addEventListener('touchstart', () => {
  if (navigator.userAgent.match(/Android/i) ||navigator.userAgent.match(/iPhone/i)) {
    //openFullscreen()
  } 
})



function App() {
  return (
    null
  );
}

export default App;
