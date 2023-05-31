import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import Sidebar from '../Sidebar'

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
      ...originalModule,
      useLocation: jest.fn(),
      useNavigate: jest.fn(),
    };
  });
  

  describe('Sidebar', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.resetAllMocks();
    });
  
    test('renders sidebar component', () => {
        const mockLocation = {
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            assign: jest.fn(),
          };
          jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);
  
      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      );
  
      const sidebarElement = screen.getByText('KERBAL');
      expect(sidebarElement).toBeInTheDocument();
    });
  
    test('renders correct sidebar buttons', () => {
        const mockLocation = {
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            assign: jest.fn(),
          };
          jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);

      render(
        <MemoryRouter>
          <Sidebar />
        </MemoryRouter>
      );
  
      const domainButton = screen.getByRole('button', { name: 'Domains' });
      const accountButton = screen.getByRole('button', { name: 'Account' });
      const boardButton = screen.getByRole('button', { name: 'Board' });
  
      expect(domainButton).toBeInTheDocument();
      expect(accountButton).toBeInTheDocument();
      expect(boardButton).toBeInTheDocument();
    });
  
    test('changes selected sidebar link on button click', () => {
        const mockLocation = {
            pathname: '/account',
          };
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockLocation);
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
          
        render(
            <MemoryRouter>
            <Sidebar />
            </MemoryRouter>
        );

        const accountButton = screen.getByRole('button', { name: 'Account' });
        fireEvent.click(accountButton);

        expect(mockNavigate).toHaveBeenCalledTimes(0);
      });
      
      test('logs out on logout button click', () => {
        const mockUseNavigate = jest.fn();
        const mockUseLocation = {
        pathname: '/',
        };

        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockUseNavigate);
        jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue(mockUseLocation);
      
        render(
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        );
      
        const logoutButton = screen.getByRole('button', { name: 'Log out' });
        fireEvent.click(logoutButton);
      
        expect(mockUseNavigate).toHaveBeenCalled();
    });
  });
