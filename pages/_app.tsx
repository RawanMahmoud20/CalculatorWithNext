// import '../styles/style.css';
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import store from '../redux/store';
import 'antd/dist/reset.css';

export default function App({ Component, pageProps }:AppProps) {
  return (
    <Provider store={store}>
  <Component {...pageProps} />;
    </Provider>
  )
}
