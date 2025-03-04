import { Section, Cell, Image, List } from '@telegram-apps/telegram-ui';
import { useCallback } from 'react';

import { Link } from '@/components/Link/Link.jsx';
import {TonConnectButton} from "@tonconnect/ui-react";
import { useTonAddress } from '@tonconnect/ui-react';
import tonSvg from './ton.svg';
import TP1Image from '../../../assets/TP1.png';
import BEBO from '../../../assets/WZ4.png';
import Play from "../../../assets/WZ5.png"
import './IndexPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/**
 * @returns {JSX.Element}
 */
export function IndexPage() {
  const userFriendlyAddress = useTonAddress();
  console.log(userFriendlyAddress == "")

  const handleClick = useCallback(() => {
    if (userFriendlyAddress == "") {
      toast.error("Connect Your Wallet");
    } else {
      window.location.href = `/playgame`;
    }
  }, [userFriendlyAddress]);

  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const debouncedHandleClick = debounce(handleClick, 500);

  return (
    <>
      <ToastContainer />
      <div style={{ backgroundColor: '', minHeight: '100vh', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TonConnectButton />
        </div>
        <div>
          <img src={BEBO} alt="描述" style={{ width: '100%', height: 'auto' }} />
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <img src={TP1Image} alt="描述" style={{ maxWidth: '100%', height: 'auto' }} />
          <img 
            src={Play} 
            alt="描述" 
            style={{ 
              position: 'absolute', 
              width: '50%', 
              height: 'auto', 
              top: '50%',
              left: '48%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer' 
            }} 
            onClick={debouncedHandleClick} 
          />
        </div>
      </div>
    </>
  );
}
