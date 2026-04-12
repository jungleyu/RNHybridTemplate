/**
 * @format
 */

import { AppRegistry } from 'react-native';
import Home from "./IGoHome";
import Detail from "./IGoDetail";
import { CounterContextProvider } from './CounterContext';

AppRegistry.registerComponent('Home', () => (props) => <CounterContextProvider><Home {...props} /></CounterContextProvider>);
AppRegistry.registerComponent('Detail', (initProps) => (props) => <CounterContextProvider><Detail  {...initProps} {...props} /></CounterContextProvider>);