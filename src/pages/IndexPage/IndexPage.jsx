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
      toast.error("请连接钱包");
    } else {
      window.location.href = `/目标页面路径?address=${userFriendlyAddress}`;
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
    <div style={{ backgroundColor: '', minHeight: '100vh' }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <TonConnectButton />
    </div>
    <div>
    <img src={BEBO} alt="描述" style={{ width: '100%', height: '160px' }} />
    </div>
    <div style={{ position: 'relative' }}>
    <img src={Play} alt="描述" style={{width: '50%', height: '100px',position: 'absolute', top: '275px', left: '95px', zIndex: 1 }} 
      onClick={debouncedHandleClick}  />
   <img src={TP1Image} alt="描述" style={{ maxWidth: '100%', height: 'auto' }} />
    </div>
    </div>
    </>
  );
}
