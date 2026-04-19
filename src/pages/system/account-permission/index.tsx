import React from 'react';
import styled from 'styled-components';
import { outer } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-components';
import Child from './components/Child';
import Child2 from './components/Child2';

const AccountPermissionStyled = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AccountPermission = () => {
  /**
   * 闭包
   */
  // const fn = outer();

  // fn(); // 1
  // fn(); // 2
  // fn(); // 3
  const fn1 = outer(); // 创建时 count = 0
  const fn2 = outer(); // 又创建一个 count = 0

  fn1(); // 0
  fn2(); // 0

  // 防抖函数
  // const handleChange = debounce((value: any) => {
  //   console.log('value---', value?.target?.value);
  // }, 1000);

  // // 节流函数
  // const handleClick = throttle(() => {
  //   console.log('点击');
  // }, 1500);

  // const createTask = (
  //   id: number,
  //   delay: number | undefined,
  //   shouldFail = false,
  // ) => {
  //   return () =>
  //     new Promise((resolve, reject) => {
  //       console.log(`任务${id}开始`);

  //       setTimeout(() => {
  //         if (shouldFail) {
  //           console.log(`任务${id}失败`);
  //           reject(`error-${id}`);
  //         } else {
  //           console.log(`任务${id}完成`);
  //           resolve(`result-${id}`);
  //         }
  //       }, delay);
  //     });
  // };

  // // 并发控制
  // const tasks = [
  //   createTask(1, 1000),
  //   createTask(2, 2000),
  //   createTask(3, 3000),
  //   createTask(4, 4000),
  //   createTask(5, 1000, true), // 失败
  //   createTask(6, 6000), // 会超时
  // ];

  // limitConcurrency(tasks, 3).then((res) => {
  //   console.log('最终结果:', res);
  // });

  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1);
    }, 1000);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <AccountPermissionStyled>
      {/* <Input onChange={handleChange} /> */}
      {/* <Button onClick={handleClick}>点击</Button> */}
      <p>Count: {count}</p>
      <button type="button" onClick={handleClick}>
        Increment
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
      <Child header={<div>header</div>} footer={<div>footer</div>}>
        <div>1</div>
        <div>2</div>
      </Child>
      <Child2 />
    </AccountPermissionStyled>
  );
};

export default AccountPermission;
