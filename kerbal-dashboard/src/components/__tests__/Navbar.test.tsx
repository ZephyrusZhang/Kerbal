import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../Navbar';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Navbar', () => {
  it('renders Navbar component correctly', () => {
    render(<Navbar />);
  
    // Assert the presence of certain elements
    expect(screen.getByRole('heading', { name: /Kerbal/i })).toBeInTheDocument();
    expect(screen.getByLabelText('toggleSiderbar')).toBeInTheDocument();
    expect(screen.getByLabelText('toggleSiderbar')).toHaveAttribute('aria-label', 'toggleSiderbar');
    
  });

  it('handles setting correctly', () => {
    // Mocking localStorage methods
    // const removeItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    // removeItemSpy.mockImplementation(() => {});

    // Mocking useNavigate hook
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);
    
    // Render the component
    render(<Navbar />);
  
    // Simulate click event on setting button
    fireEvent.click(screen.getByText('Setting'));
  
    // Assert the correct behavior
    // expect(removeItemSpy).toHaveBeenCalledTimes(0);
    expect(navigateMock).toHaveBeenCalledWith('/account');
  
    // Clean up
    // removeItemSpy.mockRestore();
  });

  // Add more test cases to cover other functionality and edge cases

});

