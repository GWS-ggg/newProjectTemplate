/**
 * 根据图片名称查找对应的完整路径
 * @param name 图片名称，如 "bg.png"
 * @param pathArray 图片路径数组
 * @returns 匹配的图片路径或默认路径
 */

import { getPGImg } from '@/utils'

export function findImagePath(name: string, pathArray: string[] | undefined): string {
  if (!pathArray)
    return ''
  // 在数组中查找包含该名称的路径
  const foundPath = pathArray.find(path => path.includes(name))
  // 如果找到则返回，否则返回数组第一项作为默认值
  return getPGImg(foundPath) || ''
}

/**
 * 将相对路径转换为图片URL
 * @param path 图片相对路径
 * @param basePath 基础路径，默认为gifts目录
 * @returns 完整的图片URL
 */
export function getImageUrl(path: string, basePath: string = 'gifts'): string {
  if (!path)
    return ''
  return new URL(`../assets/images/${basePath}/${path}`, import.meta.url).href
}
