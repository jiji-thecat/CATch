import { AppRegistry } from 'react-native';
import App from './src/component/App';

AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', { rootTag: document.getElementById('app') });
