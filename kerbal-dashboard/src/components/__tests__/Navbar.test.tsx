import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar', () => {
  test('renders Navbar component', () => {
    render(
      <Router>
        <Navbar />
      </Router>  
    );
    
    // 断言Navbar组件中的元素是否存在
    expect(screen.getByText('Kerbal')).toBeInTheDocument();
    expect(screen.getByLabelText('toggleSiderbar')).toBeInTheDocument();
    // ...
  });

  test('clicking toggleSidebar button should update controller state', () => {
    const { container } = render(
        <Router>
          <Navbar />
        </Router>  
      );
    
    // 模拟点击toggleSidebar按钮
    fireEvent.click(screen.getByLabelText('toggleSiderbar'));
    
    // 检查controller状态是否更新
    // ...
  });

  // 编写更多的测试用例...
});
