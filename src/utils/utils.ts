/**
 * 防抖函数
 * 在一段时间内只执行最后一次 (类似于输入框一直输入 debounce 这个函数会执行但是传进来的函数需要判断是否需要执行)
 * @param fn 函数
 * @param delay 时间
 * @returns 返回一个函数，这个函数会在一段时间内只执行最后一次
 * 返回一个函数，这个函数会在一段时间内只执行最后一次
 */
export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
  // 1. 定义定时器
  let timer: any = null;
  return (...args: any[]) => {
    // 2. 如果定时器存在，则清除定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 3. 设置定时器
    timer = setTimeout(() => {
      // 4. 在delay时间后执行函数
      fn(...args);
    }, delay);
  };
};

/**
 * 节流函数
 * 在一段时间内只执行一次 (类似于按钮点击节流这个函数会执行但是传进来的函数需要判断是否需要执行)
 * @param fn 函数
 * @param delay 时间
 * @returns 返回一个函数，这个函数会在一段时间内只执行一次
 * 返回一个函数，这个函数会在一段时间内只执行一次
 */
export const throttle = (fn: (...args: unknown[]) => void, delay: number) => {
  // 1.定义一个lastTime变量
  let lastTime = 0;

  return (...args: any[]) => {
    // 2.获取当前时间
    const now = Date.now();

    // 3.计算时间差：如果当前时间 - 上次执行的时间 >=  间隔时间delay，说明冷却好了，可以执行
    if (now - lastTime >= delay) {
      // 4.执行函数
      fn(...args);

      // 5.更新lastTime
      lastTime = now;
    }
  };
};

/**
 * 实现并发控制
 * 控制“同时执行中的任务数量”，完成一个就补一个
 */
export const limitConcurrency = async (tasks: any[], limit: number) => {
  const results: any = [];
  let i = 0;

  const worker = async () => {
    // 没任务了就结束
    if (i >= tasks.length) return;

    const current = i++;

    try {
      results[current] = await tasks[current]();
    } catch (e) {
      results[current] = e;
    }

    // 继续干下一个任务
    return worker();
  };

  // 启动 limit 个 worker
  await Promise.all(Array.from({ length: limit }, worker));

  return results;
};

/**
 * 手写 useState（简化版）
 */
let state: any;
export const useState = (initial: any) => {
  state = state || initial;

  const setState = (newVal: any) => {
    state = newVal;
    // render(); // 触发更新
  };

  return [state, setState];
};

/**
 * 什么是闭包
 * 闭包是函数会记住它创建时所在的作用域，所以它访问的是当时作用域中的变量，而不是之后变化的值
 */
export const outer = () => {
  let count = 0;

  const inner = () => {
    count++;
    console.log(count);
  };

  return inner;
};
