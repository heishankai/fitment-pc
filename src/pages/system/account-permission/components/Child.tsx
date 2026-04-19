import React from 'react';
import { Input, Button } from 'antd';

// 数组：重复的数据
const arr = [1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9];

// 数组：对象去重
const arrObj = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 1, name: '张三' },
  { id: 3, name: '王五' },
  { id: 4, name: '赵六' },
];

/**
 * 防抖函数 在一段时间内只执行最后一次
 * @param fn 函数
 * @param delay 时间
 * @returns  fn 函数
 */
export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
  // args 是传进来的事件隐式参数，需要传出去
  // 比如 onChange 事件，会传进来一个事件对象，需要传出去
  // 1. 先定义一个判断是否需要执行的函数标识，用于判断是否需要执行函数
  // 2. 设置定时器，将定时器赋值给 标识变量是，设置传入的事件
  // 3. 在定时器中执行函数，并传入事件

  // 第一次执行  timer 不存在，不清空，设置定时器，执行函数，并传入事件
  // 第二次执行  timer 存在，第二次进来后如果存在先清空，再设置，第三次也是一样，循环往复对吗

  let timer: any = null;

  return (...args: any[]) => {
    console.log(args, 'args --- ');
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const Child = (props: any) => {
  console.log(props, 'props --- ');

  // 方法一：使用Set
  const newArr = [...new Set(arr)];
  console.log('set去重后', newArr);

  // 循环
  const newArr1: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (!newArr1?.includes(arr[i])) {
      newArr1.push(arr[i]);
    }
  }
  console.log('使用循环和includes去重后', newArr1);

  // 对象去重
  /**
   * @description 数组对象去重
   * @param arrObj 数组对象
   * @returns 去重后的数组对象
   */
  let newArrObj: any[] = [];

  for (let i = 0; i < arrObj.length; i++) {
    const isExist = newArrObj?.some((s) => s?.id === arrObj[i]?.id);
    if (!isExist) {
      newArrObj.push(arrObj[i]);
    }
  }
  console.log('数组对象使用循环和some去重后', newArrObj);

  // reduce
  const newArrObj2: any[] = arrObj?.reduce((prev: any[], curr: any) => {
    const isExist = prev?.some((s) => s?.id === curr?.id);
    if (!isExist) {
      prev.push(curr);
    }
    return prev;
  }, []);

  console.log('使用reduce去重后', newArrObj2);

  // 防抖
  const handleChange = debounce((e: any) => {
    console.log(e?.target?.value, 'e?.target?.value');
  }, 800);

  // 节流
  const handleClick = () => {
    console.log('点击');
  };

  return (
    <div>
      {props?.header}
      <Input onChange={handleChange} />
      <Button onClick={handleClick}>点击</Button>
      {props?.footer}
    </div>
  );
};

export default Child;
