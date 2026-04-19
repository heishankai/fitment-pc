import React, { useRef, useState, useEffect } from 'react';

// - 页面展示从开始计时到当下多少秒。从零开始计时，每秒更新一次 0, 1, 2, 3, 4
// - 添加三个 button 控制计时器的 启动、暂停 、清空
// - 添加第四个 button 进行存储，
//   每次点击存储当前计数，最多存储并展示最近的五条记录

const Child2 = () => {
  let timeRef = useRef<ReturnType<typeof setInterval> | any>(null);
  const [count, setCount] = useState<number>(0);
  const [isGoFlag, setIsGoFlag] = useState<boolean>(false);
  const [countList, setCountList] = useState<number[]>([]);

  const handleSotre = () => {
    const resultCountList = [];

    // 循环 5 次，存入当前 count 的前 5 个数字
    for (let i = 1; i <= 5; i++) {
      // 确保数字不小于 0（如果 count 小于 5）
      const num = count - i;
      if (num >= 0) {
        resultCountList.push(num);
      }
    }

    // 只保留最近的 5 条记录
    setCountList([...resultCountList]);
  };

  useEffect(() => {
    if (isGoFlag) {
      timeRef.current = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
    }

    if (!isGoFlag) {
      clearInterval(timeRef.current);
      timeRef.current = null;
    }
  }, [isGoFlag]);

  return (
    <div>
      {count}
      <button type="button" onClick={() => setIsGoFlag(true)}>
        启动
      </button>
      <button type="button" onClick={() => setIsGoFlag(false)}>
        暂停
      </button>
      <button type="button" onClick={() => setCountList([])}>
        清空
      </button>
      <button type="button" onClick={handleSotre}>
        存储
      </button>
      {countList.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </div>
  );
};

export default Child2;
