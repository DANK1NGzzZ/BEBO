import ReactDOM from 'react-dom/client';

import { Root } from '@/components/Root.jsx';
import { Buffer } from 'buffer';
window.Buffer = Buffer; // 将 Buffer 设置为全局变量
import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
