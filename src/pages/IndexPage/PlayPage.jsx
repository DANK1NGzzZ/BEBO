import AN8 from "../../../assets/AN8.png"
import TP3 from "../../../assets/TP3.png"
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

    const [poopPosition, setPoopPosition] = useState(null); // 新增状态来记录大便图标的位置

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

  
    
  const handleTP3Click = (event) => {
    if (new Date().getTime() < countdown * 1000) {
        toast.warning(`Please click again after ${new Date(countdown * 1000).toLocaleString()}`);
        return;
    }
    setClickCount((prev) => prev + 1);
    setProgress((prev) => Math.min(prev + 1, 100));
    console.log(clickCount);

    // 获取点击位置相对于角色图的 x 坐标和 y 坐标
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; // 计算相对于角色图的 x 坐标
    const y = event.clientY - rect.top;  // 计算相对于角色图的 y 坐标
    setPoopPosition({ x, y }); // 更新大便图标的位置
    console.log(x, y);
    // 设置定时器在一段时间后清除大便图标
    setTimeout(() => {
        setPoopPosition(null);
    }, 1000); // 1秒后清除
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
    <div style={{
      backgroundColor: '#f0f0f0', // 背景颜色
      minHeight: '100vh',
      padding: '10px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      
      {/* 顶部Logo */}
      <div style={{
        width: '100%',
        height: '10%',
        display: 'flex',
        justifyContent: 'flex-start',
        position: 'relative',
      }}>
        <img 
          src={AN8} 
          alt="" 
          style={{
            width: '10%',
            maxWidth: '100px', // 最大宽度限制
            height: 'auto',
            cursor: 'pointer',
          }} 
          onClick={() => window.location.href = '/'} // 点击返回首页
        />
      </div>
      {/* 角色图 */}
      <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative', // 设置为相对定位
            }}>
                <img 
                    onClick={handleTP3Click} 
                    src={TP3} 
                    alt="角色图" 
                    style={{
                        width: '80%',
                        maxWidth: '300px',
                        height: 'auto',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                    }}
                    id="characterImage"
                />
                {poopPosition && ( // 如果有位置则渲染大便图标
                    <svg
                  t="1741074994782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2996" width="25" height="25"
                        style={{
                            position: 'absolute',
                            left: `${poopPosition.x}`, // 设置 x 坐标
                            top: `${poopPosition.y}`, // 设置 y 坐标
                            animation: 'float 1s forwards', // 添加动画
                        }}
                    >
                     <path d="M896.530908 696.193094c25.330068-28.451552 40.579281-66.011694 40.579281-106.642147a162.419469 162.419469 0 0 0-121.840188-157.404627c13.202339-22.310929 20.315227-48.715606 20.315227-76.143721a152.133926 152.133926 0 0 0-149.319474-152.338614 832.668432 832.668432 0 0 0-53.78162-60.894508C592.877118 103.060117 586.787667 0.56289 530.908001 0.56289 475.079506 0.56289 428.359602 103.111289 388.752586 142.718305A644.765379 644.765379 0 0 0 334.919794 203.715157a152.133926 152.133926 0 0 0-149.268302 152.338613c0 27.428115 7.112888 53.832792 20.315226 76.143721a162.419469 162.419469 0 0 0-121.891359 157.404628c0 40.630453 15.249213 78.190595 40.630453 106.642147A163.289391 163.289391 0 0 0 2.865624 853.597721a162.98236 162.98236 0 0 0 162.470641 162.470641h690.513018a162.98236 162.98236 0 0 0 162.521813-162.470641 163.289391 163.289391 0 0 0-121.89136-157.404627z" fill="#895A37" p-id="2997"></path><path d="M645.635301 163.033532h6.08945a392.99985 392.99985 0 0 0-20.315226-21.338664c-37.560142-37.560142-44.67303-129.976513-92.416371-141.131978 16.27265 33.517565 28.451552 77.167158 51.785918 100.552696 23.385538 23.334366 40.630453 43.649593 54.856229 61.917946z" fill="#895A37" p-id="2998"></path><path d="M811.176253 975.437909c83.307781 0 156.38119-61.917945 165.540953-145.225726 2.046874-21.287492 0-42.626156-5.117186-61.917945a104.185898 104.185898 0 0 0-74.096847-72.152316h-1.023437c4.093748-5.014842-21.338664-35.513268-40.630453-40.579281 25.432412-28.451552 40.630453-66.011694 40.630453-106.642147 0-14.225776-2.046874-27.376943-5.066014-40.630454a106.949178 106.949178 0 0 0-76.143721-76.14372h-1.023437c3.070311-6.089451-22.362101-35.513268-40.630453-40.630454 13.202339-22.310929 20.315227-48.715606 20.315227-76.143721 0-31.470691-10.183199-60.894508-26.404678-85.303483a152.287442 152.287442 0 0 0-82.284343-26.404677c-9.10859-12.178902-73.07341-79.214032-94.412074-101.524961-23.385538-23.385538-34.541002-67.035131-51.785917-100.552696-2.046874-1.023437-5.117186-1.023437-8.136325-1.023438-55.828494 0-102.548398 102.548398-142.155415 142.155415A644.765379 644.765379 0 0 0 334.919794 203.715157a152.133926 152.133926 0 0 0-149.268302 152.338613c0 27.428115 7.112888 53.832792 20.315226 76.143721a162.419469 162.419469 0 0 0-121.891359 157.404628c0 40.630453 15.249213 78.190595 40.630453 106.642147A163.289391 163.289391 0 0 0 2.865624 853.597721v1.023437a121.789016 121.789016 0 0 0 120.816751 120.816751h687.493878z" fill="#93653D" p-id="2999"></path><path d="M165.285093 611.913048c0 21.389836 19.394133 41.142172 50.813653 51.837089 31.419519 10.74609 70.105442 10.74609 101.524961 0 31.419519-10.694918 50.762481-30.447254 50.762481-51.837089 0-33.10819-45.440608-59.922243-101.524962-59.922243s-101.576133 26.814052-101.576133 59.871071z m487.463095-1.023437c0 33.057019 45.49178 59.871071 101.576134 59.871071s101.524961-26.814052 101.524961-59.871071c0-33.10819-45.440608-59.922243-101.524961-59.922243s-101.576133 26.814052-101.576134 59.871071z" fill="#F48C8C" p-id="3000"></path><path d="M500.460747 528.656439q0 6.447654-0.665235 12.895308-0.614062 6.447654-1.893358 12.792963-1.228125 6.396482-3.121483 12.588277t-4.40078 12.178901q-2.456249 5.987107-5.52656 11.769527-3.070311 5.680076-6.652342 11.053121-3.58203 5.424217-7.675778 10.439059-4.14492 5.014842-8.699215 9.569136-4.605467 4.605467-9.620309 8.699216-5.014842 4.093748-10.439059 7.72695-5.373045 3.58203-11.104292 6.652341t-11.718355 5.577733q-5.987107 2.456249-12.178902 4.349607-6.191795 1.893359-12.588276 3.121483-6.34531 1.279296-12.792964 1.944531-6.447654 0.614062-12.94648 0.614062t-12.946479-0.614062q-6.447654-0.665234-12.792964-1.944531-6.396482-1.228125-12.588276-3.121483t-12.178902-4.349607q-5.987107-2.507421-11.769527-5.577733-5.628904-3.070311-11.05312-6.652341t-10.439059-7.675778q-5.014842-4.14492-9.569137-8.699216-4.605467-4.605467-8.699215-9.620308-4.093748-5.014842-7.726951-10.439059-3.58203-5.373045-6.652341-11.104293t-5.577732-11.718355q-2.456249-5.987107-4.349608-12.178901-1.893359-6.191795-3.121483-12.588277-1.279296-6.34531-1.893359-12.792963-0.665234-6.447654-0.665234-12.94648t0.665234-12.946479q0.614062-6.447654 1.893359-12.792964 1.228125-6.396482 3.121483-12.588277t4.349608-12.178901q2.507421-5.987107 5.577732-11.718355t6.652341-11.104293q3.58203-5.424217 7.675779-10.439058 4.14492-5.014842 8.699215-9.569137 4.605467-4.605467 9.620309-8.699216 5.014842-4.093748 10.439059-7.72695 5.373045-3.58203 11.104292-6.652341t11.718355-5.526561q5.987107-2.507421 12.178902-4.400779 6.191795-1.842187 12.588276-3.121483 6.34531-1.279296 12.792964-1.893359 6.447654-0.665234 12.946479-0.665234t12.94648 0.665234q6.447654 0.614062 12.792964 1.893359 6.396482 1.279296 12.588276 3.121483 6.191795 1.893359 12.178902 4.400779 5.987107 2.456249 11.769527 5.526561 5.628904 3.070311 11.05312 6.652341t10.439059 7.675778q5.014842 4.14492 9.569137 8.699216 4.605467 4.605467 8.699215 9.620309 4.093748 5.014842 7.72695 10.439058 3.58203 5.373045 6.652342 11.104293t5.52656 11.718355q2.507421 5.987107 4.40078 12.178901 1.893359 6.191795 3.121483 12.588277 1.279296 6.34531 1.893358 12.792964 0.665234 6.447654 0.665235 12.946479z" fill="#FFFFFF" p-id="3001"></path><path d="M368.437359 457.52756a70.617161 70.617161 0 0 0-71.128879 71.128879c0 39.607016 31.521863 71.077707 71.128879 71.077707a70.617161 70.617161 0 0 0 71.077708-71.128879 70.617161 70.617161 0 0 0-71.128879-71.026535z" fill="#5E4027" p-id="3002"></path><path d="M784.771576 528.656439q0 6.447654-0.614063 12.895308t-1.893358 12.792963q-1.279296 6.396482-3.172655 12.588277-1.842187 6.191795-4.349608 12.178901-2.456249 5.987107-5.52656 11.769527-3.070311 5.680076-6.652342 11.053121-3.58203 5.424217-7.72695 10.439059-4.093748 5.014842-8.699215 9.569136-4.605467 4.605467-9.620309 8.699216-5.014842 4.093748-10.387887 7.72695-5.373045 3.58203-11.104292 6.652341t-11.769527 5.577733q-5.935935 2.456249-12.178902 4.349607-6.140623 1.893359-12.537104 3.121483-6.34531 1.279296-12.792964 1.944531-6.498826 0.614062-12.94648 0.614062-6.498826 0-12.946479-0.614062-6.447654-0.665234-12.792964-1.944531-6.396482-1.228125-12.588276-3.121483-6.242966-1.893359-12.230074-4.349607-5.987107-2.507421-11.718355-5.577733-5.680076-3.070311-11.104292-6.652341-5.373045-3.58203-10.387887-7.675778-5.014842-4.14492-9.620309-8.699216-4.605467-4.605467-8.699215-9.620308-4.093748-5.014842-7.675779-10.439059-3.58203-5.373045-6.652341-11.104293t-5.577732-11.718355q-2.456249-5.987107-4.349608-12.178901-1.893359-6.191795-3.172655-12.588277-1.228125-6.34531-1.893359-12.792963-0.614062-6.447654-0.614062-12.94648t0.614062-12.946479q0.665234-6.447654 1.893359-12.792964 1.279296-6.396482 3.172655-12.588277t4.349608-12.178901q2.507421-5.987107 5.52656-11.718355 3.070311-5.731248 6.652341-11.104293 3.633202-5.424217 7.726951-10.439058 4.093748-5.014842 8.699215-9.569137 4.605467-4.605467 9.620309-8.699216 5.014842-4.093748 10.387887-7.72695 5.424217-3.58203 11.104292-6.652341 5.731248-3.070311 11.769527-5.526561 5.935935-2.507421 12.178902-4.400779 6.191795-1.842187 12.537104-3.121483 6.396482-1.279296 12.792964-1.893359 6.498826-0.665234 12.997651-0.665234 6.447654 0 12.895308 0.665234 6.498826 0.614062 12.792964 1.893359 6.396482 1.279296 12.588276 3.121483 6.242966 1.893359 12.230074 4.400779 5.987107 2.456249 11.718355 5.526561t11.104292 6.652341q5.373045 3.58203 10.387887 7.675778 5.014842 4.14492 9.620309 8.699216 4.605467 4.605467 8.699215 9.620309 4.093748 5.014842 7.675778 10.439058 3.633202 5.373045 6.652342 11.104293 3.070311 5.731248 5.628904 11.718355 2.456249 5.987107 4.298436 12.178901 1.893359 6.191795 3.172655 12.588277 1.279296 6.34531 1.893358 12.792964 0.614062 6.447654 0.614063 12.946479z" fill="#FFFFFF" p-id="3003"></path><path d="M652.79936 457.52756a70.617161 70.617161 0 0 0-71.128879 71.128879c0 39.607016 31.521863 71.077707 71.128879 71.077707a70.617161 70.617161 0 0 0 71.077708-71.128879 70.617161 70.617161 0 0 0-71.12888-71.026535z m-2.046874 239.688971c-9.159762-2.046874-19.29179 3.070311-22.362101 11.155464a80.851532 80.851532 0 0 1-49.739043 46.719904 205.301484 205.301484 0 0 1-135.093699 0 86.685123 86.685123 0 0 1-49.739043-46.719904 19.240618 19.240618 0 0 0-22.310929-11.155464c-12.230073 2.046874-19.342961 15.249213-15.249213 27.428114a126.189796 126.189796 0 0 0 74.148018 70.105442 244.601469 244.601469 0 0 0 161.447204 0 123.324172 123.324172 0 0 0 74.148019-70.105442c4.042577-12.178902-3.070311-25.38124-15.249213-27.428114z" fill="#5E4027" p-id="3004"></path>
                      </svg>
                )}
            </div>
      
      {/* 标题 */}
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'purple',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        margin: '10px 0',
      }}>
        Click BEBO To Get Points
      </div>
      
      {/* 副标题 */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'purple',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        margin: '5px 0',
      }}>
        One Point Is Equal To 10000 $Bebo
      </div>
      
      {/* 当前积分 */}
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'purple',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        margin: '10px 0',
      }}>
        Your Points: {currentClicks}
      </div>
      
      {/* Claim按钮 */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '300px',
      }}>
        <button style={{
          backgroundColor: 'green',
          color: 'white',
          fontSize: '1.5rem',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
        onClick={Claim}>
          Claim
        </button>
      </div>
      
      {/* 进度条 */}
      <div 
        onClick={addClickTimes}
        style={{
          width: '80%',
          maxWidth: '300px', // 最大宽度限制
          height: '100px',
          backgroundColor: 'lightgray',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          margin: '20px 0',
          cursor: 'pointer',
        }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: 'green',
          borderRadius: '40px',
          transition: 'width 0.3s ease',
        }} />
        <span style={{
          fontSize: '1.2rem',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'black',
          pointerEvents: 'none',
        }}>
          Get points
        </span>
      </div>
      
      {/* 倒计时 */}
      <div style={{
        fontSize: '1.2rem',
        textAlign: 'center',
        margin: '10px 0',
      }}>
        Next Time: {countdown > 0 ? new Date(countdown * 1000).toLocaleString() : '0'}
      </div>
    </div>
    <style>
            {`
                @keyframes float {
                    0% {
                        transform: translateY(0); /* 初始位置 */
                        opacity: 1; /* 初始透明度 */
                    }
                    100% {
                        transform: translateY(-50px); /* 向上移动50px */
                        opacity: 0; /* 逐渐消失 */
                    }
                }
            `}
        </style>
  </>
  );
}
  