# 前端测试框架完全指南：Jest + React Testing Library

> 🎯 **目标读者**：希望建立完整前端测试体系的开发者
> ⏱️ **预计阅读**：12 分钟
> 📅 **最后更新**：2026-04-09

## 🎪 前端测试全景图

### 测试金字塔
```
        E2E 测试 (10%)
        /           \
  集成测试 (20%)    UI 测试 (20%)
        \           /
       单元测试 (50%)
```

### 各层测试详解
| 测试类型 | 工具示例 | 测试内容 | 执行速度 | 维护成本 |
|----------|----------|----------|----------|----------|
| **单元测试** | Jest, Vitest | 函数、工具类、纯逻辑 | 快 | 低 |
| **组件测试** | React Testing Library, Vue Test Utils | React/Vue 组件 | 中 | 中 |
| **集成测试** | Cypress, Playwright | 多个组件/模块交互 | 慢 | 高 |
| **E2E 测试** | Cypress, Playwright, Selenium | 完整用户流程 | 很慢 | 很高 |

## 🛠️ Jest 单元测试实战

### 环境配置
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ui": "jest --watchAll"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 基础测试示例
```typescript
// math.ts - 被测试的函数
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

export function calculateTax(income: number): number {
  if (income <= 0) return 0;
  if (income <= 50000) return income * 0.1;
  if (income <= 100000) return income * 0.2;
  return income * 0.3;
}
```

```typescript
// math.test.ts - 测试文件
import { add, divide, calculateTax } from './math';

describe('数学运算测试', () => {
  describe('add 函数', () => {
    it('应该正确计算两个正数的和', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('应该正确处理负数', () => {
      expect(add(-2, 3)).toBe(1);
    });

    it('应该正确处理小数', () => {
      expect(add(1.5, 2.5)).toBe(4);
    });
  });

  describe('divide 函数', () => {
    it('应该正确计算除法', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('除以0应该抛出错误', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });

    it('应该正确处理小数', () => {
      expect(divide(5, 2)).toBe(2.5);
    });
  });

  describe('calculateTax 函数', () => {
    it('收入为0应该返回0', () => {
      expect(calculateTax(0)).toBe(0);
    });

    it('收入为负数应该返回0', () => {
      expect(calculateTax(-1000)).toBe(0);
    });

    it('收入在0-50000之间应该按10%计算', () => {
      expect(calculateTax(30000)).toBe(3000);
    });

    it('收入在50001-100000之间应该按20%计算', () => {
      expect(calculateTax(75000)).toBe(15000);
    });

    it('收入超过100000应该按30%计算', () => {
      expect(calculateTax(150000)).toBe(45000);
    });
  });
});
```

### Mock 与 Spy 实战
```typescript
// api.ts
export async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}

// userService.ts
export class UserService {
  constructor(private api: { fetchUser: (id: number) => Promise<any> }) {}

  async getUserInfo(id: number) {
    try {
      const user = await this.api.fetchUser(id);
      return {
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        isAdult: user.age >= 18
      };
    } catch (error) {
      return { error: 'User not found' };
    }
  }
}
```

```typescript
// userService.test.ts
import { UserService } from './userService';

describe('UserService', () => {
  let mockApi: { fetchUser: jest.Mock };
  let userService: UserService;

  beforeEach(() => {
    mockApi = {
      fetchUser: jest.fn()
    };
    userService = new UserService(mockApi);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserInfo', () => {
    it('应该正确格式化用户信息', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 25
      };
      mockApi.fetchUser.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserInfo(1);

      // Assert
      expect(mockApi.fetchUser).toHaveBeenCalledWith(1);
      expect(mockApi.fetchUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        fullName: 'John Doe',
        isAdult: true
      });
    });

    it('当API调用失败时应该返回错误信息', async () => {
      // Arrange
      mockApi.fetchUser.mockRejectedValue(new Error('User not found'));

      // Act
      const result = await userService.getUserInfo(999);

      // Assert
      expect(result).toEqual({ error: 'User not found' });
    });

    it('未成年用户应该标记为未成人', async () => {
      // Arrange
      const mockUser = {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        age: 16
      };
      mockApi.fetchUser.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserInfo(2);

      // Assert
      expect(result.isAdult).toBe(false);
    });
  });
});
```

## 🎭 React Testing Library 组件测试

### 组件测试哲学
> "测试用户如何使用你的应用，而不是实现细节"

### 基础组件测试
```tsx
// Button.tsx
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  children
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      data-testid="button"
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          加载中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
```

```tsx
// Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button 组件', () => {
  it('应该正确渲染按钮文本', () => {
    render(<Button onClick={() => {}}>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('点击按钮应该触发 onClick 事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击</Button>);
    
    fireEvent.click(screen.getByText('点击'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态应该阻止点击事件', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        禁用按钮
      </Button>
    );
    
    fireEvent.click(screen.getByText('禁用按钮'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('加载状态应该显示加载指示器', () => {
    render(
      <Button onClick={() => {}} loading>
        提交
      </Button>
    );
    
    expect(screen.getByText('加载中...')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeDisabled();
  });

  it('应该应用正确的样式类', () => {
    const { rerender } = render(
      <Button onClick={() => {}} variant="primary">
        主要按钮
      </Button>
    );
    const button = screen.getByTestId('button');
    expect(button).toHaveClass('bg-blue-600');
    
    rerender(
      <Button onClick={() => {}} variant="danger">
        危险按钮
      </Button>
    );
    expect(button).toHaveClass('bg-red-600');
  });
});
```

### 表单测试实战
```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
          data-testid="email-input"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2">
          密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full p-2 border rounded"
          data-testid="password-input"
        />
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded" data-testid="error-message">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        data-testid="submit-button"
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
};
```

```tsx
// LoginForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import userEvent from '@testing-library/user-event';

describe('LoginForm 组件', () => {
  const user = userEvent.setup();

  it('应该正确渲染表单', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('应该验证表单输入', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // 测试邮箱验证
    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByTestId('submit-button'));
    
    // 浏览器原生验证会阻止提交
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('提交表单应该调用 onSubmit', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('提交失败应该显示错误信息', async () => {
    const errorMessage = '登录失败，请检查凭据';
    const handleSubmit = jest.fn().mockRejectedValue(new Error(errorMessage));
    render(<LoginForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });

  it('提交期间应该显示加载状态', async () => {
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    
    const handleSubmit = jest.fn().mockImplementation(() => submitPromise);
    render(<LoginForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByTestId('submit-button');
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // 按钮应该显示加载状态并禁用
    expect(submitButton).toHaveTextContent('登录中...');
    expect(submitButton).toBeDisabled();
    
    // 完成提交
    resolveSubmit!();
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('登录');
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

## 🔄 集成测试与 E2E 测试

### Cypress 集成测试
```javascript
// cypress/e2e/login.cy.js
describe('登录流程', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('应该成功登录并跳转到首页', () => {
    // Mock API 响应
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', user: { id: 1, name: '测试用户' } }
    }).as('loginRequest');

    // 填写表单
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();

    // 验证 API 调用
    cy.wait('@loginRequest').its('request.body').should('deep.equal', {
      email: 'test@example.com',
      password: 'password123'
    });

    // 验证跳转和状态
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-name"]').should('contain', '测试用户');
  });

  it('登录失败应该显示错误信息', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: '邮箱或密码错误' }
    }).as('failedLogin');

    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@failedLogin');
    cy.get('[data-testid="error-message"]').should('contain', '邮箱或密码错误');
  });
});
```

### Playwright 组件测试
```typescript
// tests/button.spec.ts
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from '../src/components/Button';

test('按钮应该正确响应点击', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => { clicked = true; }}>
      点击测试
    </Button>
  );

  await component.click();
  expect(clicked).toBeTruthy();
});

test('禁用按钮不应该响应点击', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => { clicked = true; }} disabled>
      禁用按钮
    </Button>
  );

  await component.click({ force: true });
  expect(clicked).toBeFalsy();
  await expect(component).toHaveClass(/opacity-50/);
});
```

## 📊 测试覆盖率与质量保证

### 覆盖率配置
```javascript
// jest.config.js - 扩展
module.exports = {
  // ... 其他配置
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

### 测试报告生成
```json
// package.json
{
  "scripts": {
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:report": "jest --coverage && open coverage/lcov-report/index.html",
    "test:sonar": "jest --coverage --coverageReporters=lcov"
  }
}
```

## 🚀 最佳实践与常见问题

### 最佳实践
1. **测试行为，而非实现**
   ```typescript
   // ❌ 不好：测试实现细节
   expect(component.find('.button').hasClass('primary')).toBe(true);
   
   // ✅ 好：测试用户可见的行为
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
   ```

2. **使用描述性测试名称**
   ```typescript
   // ❌ 不好
   it('test 1', () => {});
   
   // ✅ 好
   it('点击提交按钮应该验证表单并显示错误', () => {});
   ```

3. **遵循 AAA 模式**
   ```typescript
   it('应该正确计算折扣', () => {
     // Arrange - 准备数据
     const price = 100;
     const discount = 20;
     
     // Act - 执行操作
     const finalPrice = calculateFinalPrice(price, discount);
     
     // Assert - 验证结果
     expect(finalPrice).toBe(80);
   });
   ```

4. **避免测试第三方库**
   ```typescript
   // ❌ 不好：测试 React 本身
   it('useState 应该工作', () => {});
   
   // ✅ 好：测试你的组件如何使用 React
   it('组件状态变化应该更新 UI', () => {});
   ```

### 常见问题解决
| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 测试运行缓慢 | Mock 过多外部依赖 | 使用 jest.spyOn 替代完整 Mock |
| 测试不稳定 | 异步操作未正确等待 | 使用 waitFor, findBy* 查询 |
| 覆盖率低 | 条件分支未覆盖 | 添加边界条件测试用例 |
| TypeScript 错误 | 类型定义不匹配 | 安装 @types/jest，配置 ts-jest |
| Mock 失效 | 导入顺序问题 | 使用 jest.mock 在文件顶部 |

### 性能优化技巧
```javascript
// 使用 jest.isolateModules 隔离模块
jest.isolateModules(() => {
  const { MyComponent } = require('./MyComponent');
  // 测试代码
});

// 并行运行测试
// jest.config.js
module.exports = {
  maxWorkers: '50%', // 使用一半 CPU 核心
  testTimeout: 10000, // 设置超时时间
};
```

## 📚 学习资源

### 官方文档
1. [Jest 官方文档](https://jestjs.io/)
2. [Testing Library](https://testing-library.com/)
3. [Cypress 文档](https://docs.cypress.io/)
4. [Playwright 文档](https://playwright.dev/)

### 推荐书籍
1. 《测试驱动的 JavaScript 开发》
2. 《前端自动化测试实战》
3. 《React 测试之道》

### 在线课程
1. [Testing JavaScript with Kent C. Dodds](https://testingjavascript.com/)
2. [Frontend Masters: Testing React](https://frontendmasters.com/courses/testing-react/)
3. [Udemy: React Testing Library](https://www.udemy.com/course/react-testing-library/)

## 🎯 总结

建立完整的前端测试体系需要时间和实践，但投入是值得的。好的测试可以：

1. **提高代码质量**：提前发现 bug，减少生产事故
2. **增强重构信心**：确保修改不会破坏现有功能
3. **提供文档**：测试用例本身就是最好的使用文档
4. **加速开发**：自动化测试比手动测试更快更可靠

**从今天开始**：
1. 为工具函数添加单元测试
2. 为关键组件添加组件测试
3. 为核心用户流程添加 E2E 测试
4. 设置 CI/CD 自动化测试流程

记住：测试不是负担，而是**开发者的超能力**！🚀