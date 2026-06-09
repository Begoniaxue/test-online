import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { config } from '@vue/test-utils'

expect.extend(matchers)

config.global.plugins = [ElementPlus]

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
