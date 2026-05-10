// import { AppRegistry } from 'react-native';
// import React, { useState, useLayoutEffect } from 'react';
// import Home from './IGoHome'
// import Detail from './IGoDetail'

// // 注册根组件（与移动端相同）
// AppRegistry.registerComponent('Home', () => Home);
// AppRegistry.registerComponent('Detail', () => Detail);

// // 启动应用
// function Router() {
//     const [Component, setComponent] = useState(() => Home);

//     useLayoutEffect(() => {
//         const handleRouteChange = () => {
//             const path = window.location.pathname;
//             switch (path) {
//                 case '/home': setComponent(() => Home); break;
//                 case '/detail': setComponent(() => Detail); break;
//                 default: setComponent(() => Home);
//             }
//         };
//         handleRouteChange();
//         window.addEventListener('popstate', handleRouteChange);
//         return () => window.removeEventListener('popstate', handleRouteChange);
//     }, []);

//     return React.createElement(Component);
// }

// // 将路由器注册为默认入口
// AppRegistry.registerComponent('MainApp', () => Router);
// AppRegistry.runApplication('MainApp', {
//     rootTag: document.getElementById('root')
// });