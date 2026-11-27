import { initShell } from './shell';
import './styles.css';

const appContainer = document.querySelector<HTMLElement>('#app');

if (appContainer) {
  initShell(appContainer);
}
