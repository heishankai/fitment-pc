import { routes } from '@/routers';

export interface RouteItem {
  name: string;
  path: string;
  fullPath: string;
  parentName?: string;
}

/**
 * 扁平化路由配置，用于搜索
 */
export const flattenRoutes = (
  routesList: any[],
  parentPath = '',
  parentName = '',
): RouteItem[] => {
  const result: RouteItem[] = [];

  routesList.forEach((route) => {
    // 跳过重定向和登录页
    if (route.redirect || route.layout === false) {
      return;
    }

    // 构建当前路径
    let currentPath = route.path;
    if (parentPath) {
      // 如果父路径存在，拼接路径
      if (route.path.startsWith('/')) {
        currentPath = route.path;
      } else {
        currentPath = `${parentPath}/${route.path}`;
      }
    }

    // 确保路径以 / 开头
    const fullPath = currentPath.startsWith('/')
      ? currentPath
      : `/${currentPath}`;

    // 如果有子路由，递归处理
    if (route.routes && route.routes.length > 0) {
      result.push(...flattenRoutes(route.routes, fullPath, route.name));
    } else if (route.name && route.path && !route.redirect) {
      // 只添加有名称和路径的路由，排除重定向
      result.push({
        name: route.name,
        path: route.path,
        fullPath,
        parentName: parentName || undefined,
      });
    }
  });

  return result;
};

/**
 * 获取所有可搜索的路由
 */
export const getAllSearchableRoutes = (): RouteItem[] => {
  return flattenRoutes(routes);
};

/**
 * 搜索路由
 */
export const searchRoutes = (keyword: string): RouteItem[] => {
  if (!keyword.trim()) {
    return [];
  }

  const allRoutes = getAllSearchableRoutes();
  const lowerKeyword = keyword.toLowerCase();

  return allRoutes.filter((route) => {
    const name = route.name.toLowerCase();
    const path = route.path.toLowerCase();
    const parentName = route.parentName?.toLowerCase() || '';

    return (
      name.includes(lowerKeyword) ||
      path.includes(lowerKeyword) ||
      parentName.includes(lowerKeyword)
    );
  });
};
