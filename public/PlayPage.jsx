import AN8 from "../assets/AN8.png"
import TP3 from "../assets/TP3.png"
//import { TonClient } from '@ton/ton';
//import { Address } from '@ton/core';
// import {
//     Contract,
//     ContractProvider,
//     Sender,
//     Address,
//     Cell,
//     contractAddress,
//     beginCell,
//     toNano,
//   } from "ton-core";
import React, { useState, useEffect} from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { ToastContainer, toast } from 'react-toastify';
import { useTonAddress } from '@tonconnect/ui-react';
import 'react-toastify/dist/ReactToastify.css';
//import { forwardPayload } from '../../../get.js';
export function PlayPage() {
    // useEffect(() => {
    //     import('@ton/ton').then(({ beginCell, Address }) => {
    //       // 在此处执行 TON 操作
    //       const cell = beginCell()
    //       .storeUint(0, 32) // 0 opcode means we have a comment
    //       .storeStringTail('Add ClickDays')
    //       .endCell();
    //     });
    //   }, []);
    const [progress, setProgress] = useState(0); // 进度状态
    const [clickCount, setClickCount] = useState(0); // 点击计数

    const [currentClicks,setCurrentClicks] = useState(0);

    const [tonConnectUI, setOptions] = useTonConnectUI();

    const userFriendlyAddress = useTonAddress();

    const [countdown, setCountdown] = useState(0); // 初始化为86400秒


    const getData = async () => { // 提取 getData 函数
      const { beginCell, toNano, Address, TonClient  } = await import('@ton/ton');
  
    try {
      const client = new TonClient({ endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC" });
      const contractAddress = Address.parse("EQA-8Rt9HFQAjC-L-_74lVHWUtDfuP9S7saiMJLlHL9Zbiyp");
      // 原始地址字符串（支持用户友好格式）
      const userAddress =  Address.parse(userFriendlyAddress);
      console.log(userFriendlyAddress);
      const params = [
          {
            type: "slice", // 明确指定类型为 slice
            cell: beginCell()
              .storeAddress(userAddress) // 地址会被自动编码为 slice
              .endCell()
          }
        ];
      // Call get method
      const result = await client.runMethod(
          contractAddress,
          'currentClickTimes',
          params
      );
      const result2 = await client.runMethod(
        contractAddress,
        'currentLastTime',
        params
    );
  
      const total = result.stack.readNumber();
      const lastTime = result2.stack.readNumber();
      
      setCurrentClicks(total);
      setCountdown(lastTime + 86400)
      console.log('Total:', lastTime);

    } catch (error) {
        if (error.message === 'Reject request') {
            console.log('Cancle');
        } else {
            console.error('error:', error);
            setCurrentClicks(0);
            setCountdown(0);
        }
    }
  };
  
  useEffect(() => {
      getData(); // 在 useEffect 中调用 getData
  }, [userFriendlyAddress]);

    const Claim = async () => {
        const { beginCell, toNano } = await import('@ton/ton');
        const cell = beginCell().storeUint(0, 32).storeStringTail('Claim').endCell()
        const transaction = { 
            validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
            messages: [
              {
                address:
                  "EQA-8Rt9HFQAjC-L-_74lVHWUtDfuP9S7saiMJLlHL9Zbiyp", // message destination in user-friendly format
                amount: toNano("0.05").toString(),// Toncoin in nanotons
                payload: cell.toBoc().toString("base64")
              }
            
            ],
          };
      try {
          await tonConnectUI.sendTransaction(transaction);
      } catch (error) {
          if (error.message === 'Reject request') {
              console.log('Cancle');
          } else {
              console.error('error:', error);
          }
      }
  };

  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  
    const handleTP3Click = () => {
      if (new Date().getTime() < countdown * 1000) { // 检查当前时间戳是否小于 countdown
        toast.warning(`Please click again after ${new Date(countdown * 1000).toLocaleString()}`)
        return; // 如果条件满足，返回不执行后续代码
    }
      setClickCount((prev) => prev + 1); // 增加点击计数
      setProgress((prev) => Math.min(prev + 1, 100)); // 每次点击增加1%的进度
     console.log(clickCount)
    };

    
 const addClickTimes = debounce(async () => {
  if(clickCount < 100){
    toast.error("The number of clicks has not reached 100");
    return;
  }
    const { beginCell, toNano } = await import('@ton/ton');
    const cell = beginCell().storeUint(0, 32).storeStringTail('Add ClickDays').endCell()
    const transaction = { 
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
        messages: [
          {
            address:
              "EQA-8Rt9HFQAjC-L-_74lVHWUtDfuP9S7saiMJLlHL9Zbiyp", // message destination in user-friendly format
            amount: toNano("0.05").toString(),// Toncoin in nanotons
            payload: cell.toBoc().toString("base64")
          }
        
        ],
      };
  try {
      await tonConnectUI.sendTransaction(transaction);
      setClickCount(0);
      setProgress(0);
      getData(); 
  } catch (error) {
      if (error.message === 'Reject request') {
          console.log('Cancle');
      } else {
          console.error('error:', error);
      }
  }
 }, 500);


  return (
    <>
     <ToastContainer />
      <div style={{ backgroundColor: '', minHeight: '100vh', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '100%', height: '10%', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={AN8} 
            alt="" 
            style={{
                position: 'absolute',
                left: "1%",
                width: '10%',
                height: 'auto' 
            }} 
            onClick={() => window.location.href = '/'} // 点击返回首页
          />
        </div>
        
        {/* 角色图 */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
          <img onClick={handleTP3Click} src={TP3} alt="角色图" style={{ width: '80%', height: 'auto' }} />
        </div>
        <div style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', color: 'purple', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          Click BEBO To Get Points
        </div>
        <div style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', color: 'purple', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        One Point Is Equal To 10000 $Bebo
        </div>
        <div style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'center', color: 'purple', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Your Points:{currentClicks}
        </div>
        <div style={{ width: '80%' }}>
          <button style={{
              backgroundColor: 'green', // 按钮背景颜色
              color: 'white', // 字体颜色
              fontSize: '40px', // 字体大小
              padding: '10px 20px', // 内边距
              border: 'none', // 去掉边框
              borderRadius: '10px', // 圆角
              cursor: 'pointer', // 鼠标悬停时显示手型
              transition: 'background-color 0.3s ease', // 添加过渡效果
              width: '100%', // 设置按钮宽度为100%
              height: '100%' // 设置按钮高度为100%（可选）
            }}
            onClick={Claim}
          >
            Claim
          </button>
        </div>
        <div 
            onClick={addClickTimes}
            style={{
            
                        width: '80%',
                        height: '100px', // 设置高度
                        backgroundColor: 'lightgray', // 背景颜色
                        borderRadius: '20px', // 设置圆角
                        overflow: 'hidden', // 确保内部内容不超出边界
                        position: 'relative'
                    }}>
            <div style={{
                        width: `${progress}%`, // 根据进度调整宽度
                        height: '100%',
                        backgroundColor: 'green', // 进度条颜色
                        borderRadius: '40px', // 设置圆角
                        transition: 'width 0.3s ease' // 添加过渡效果
                    }} />
            <span
            
            style={{
                fontSize:'50px',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'black', // 占位符颜色
                        pointerEvents: 'none' // 禁止事件
                    }}>
                       Get points 
                    </span>
        </div>
        <div style={{ fontSize: '24px', textAlign: 'center', margin: '10px 0' }}>
            下一次: {countdown > 0 ? new Date(countdown * 1000).toLocaleString() : '0'} {/* 如果 countdown 为 0，显示 0 */}
        </div>
      </div>
    </>
  );
}
  