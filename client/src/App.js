import Phaser from 'phaser';
import { socket } from './socket/index'
import { MainScene, Scene1, Scene2, Scene3, Scene4, Scene5, LoadingScene, ControlsScene, AboutScene, GuideScene, ScreenshotScene } from './scenes';

// window["GD_OPTIONS"] = {
//   "debug": false,
//   "gameId": "ce66a6ade0ac4ff4b62d518fc0a9f22f",
//   "advertisementSettings": {
//     debug: false, // Enable IMA SDK debugging.
//     //"locale": "en", // Locale used in IMA SDK, this will localize the "Skip ad after x seconds" phrases.
//   },
//   "onEvent": function(event) {
//       switch (event.name) {
//           case "SDK_READY":
//             //console.log('sdk ready')
//             //window.gdsdk.preloadAd()
//             break;
//           case "SDK_GAME_START":
//               if (window.game) {
//                 window.game.sound.mute = false
//                 window.game.loop.wake()
//               }
//               break;
//           case "SDK_GAME_PAUSE":
//               if (window.game) {
//                 window.game.sound.mute = true
//                 window.game.loop.sleep()
//               }
//               break;
//           case "SDK_GDPR_TRACKING":
//               // this event is triggered when your user doesn't want to be tracked
//               break;
//           case "SDK_GDPR_TARGETING":
//               // this event is triggered when your user doesn't want personalised targeting of ads and such
//               break;
//           case "SDK_REWARDED_WATCH_COMPLETE":
//               // reward
//           default:
//               break;
//       }
//   }
// };
// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s);
//   js.id = id;
//   js.src = 'https://html5.api.gamedistribution.com/main.min.js';
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'gamedistribution-jssdk')); 




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
      debug:false
    },
    fps: 60
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
  fps: {
    target: 60,
    //forceSetTimeOut: true
  },
  dom: {
    createContainer: true,
  },
  // plugins: {
  //   global: [{
  //       key: 'rexYoutubePlayer',
  //       plugin: YoutubePlayerPlugin,
  //       start: true
  //   }]
  // },
  scene: [LoadingScene, ControlsScene, AboutScene, GuideScene, ScreenshotScene, Scene1, Scene2, Scene3, Scene4, Scene5, MainScene],
};

//window.sdk = 'crazygames'
//window.sdk = 'gdsdk'
window.sdk = ''

window.socket = socket
window.game = new Phaser.Game(gameConfig);

window.addEventListener("wheel", (event) => event.preventDefault(), {
  passive: false,
});

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
    event.preventDefault();
  }
});


// const openFullscreen = () => {
//   var elem = document.getElementsByTagName('canvas')[0];
//   //console.log(elem)
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }

// window.addEventListener('touchstart', () => {
//   if (navigator.userAgent.match(/Android/i) ||navigator.userAgent.match(/iPhone/i)) {
//     //openFullscreen()
//   } 
// })



function App() {
  return (
    null
  );
}

export default App;
