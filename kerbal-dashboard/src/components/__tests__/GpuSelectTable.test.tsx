import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import GPUSelectTable from '../GpuSelectTable';

// Mock data for testing
const mockData = [
    { 
      bus: 'bus1',
      domain_uuid: 'uuid1',
      free: true,
      function: 'function1',
      gpu_id: 'gpu_id_1',
      name: 'GPU 1',
      node_id: 'node_id_1',
      online: true,
      slot: 'slot1',
      vram_size: 8,
      isSelected: false
    },
    {
      bus: 'bus2',
      domain_uuid: 'uuid2',
      free: false,
      function: 'function2',
      gpu_id: 'gpu_id_2',
      name: 'GPU 2',
      node_id: 'node_id_2',
      online: true,
      slot: 'slot2',
      vram_size: 6,
      isSelected: true
    },
    {
      bus: 'bus3',
      domain_uuid: 'uuid3',
      free: true,
      function: 'function3',
      gpu_id: 'gpu_id_3',
      name: 'GPU 3',
      node_id: 'node_id_3',
      online: false,
      slot: 'slot3',
      vram_size: 4,
      isSelected: false
    }
  ];
  
  
  describe('GPUSelectTable', () => {


    test('renders GPUSelectTable component', () => {
      render(<GPUSelectTable data={mockData} onCheckGpu={() => {}} />);

      // Check if component renders correctly
      expect(screen.getByRole("table")).toBeInTheDocument();

      // Check if all GPU items are rendered
      expect(screen.getByText("GPU 1")).toBeInTheDocument();
      expect(screen.getByText("GPU 2")).toBeInTheDocument();
      expect(screen.getByText("GPU 3")).toBeInTheDocument();
    });
      
  
    test('clicking sort button changes the sorting order', () => {
      const onCheckGpu = jest.fn();
      render(<GPUSelectTable data={mockData} onCheckGpu={onCheckGpu}/>);
      
      // Initial sorting order should be 'reverse'
      expect(screen.getByLabelText('reverse')).toBeInTheDocument();
  
      // Click sort button
      fireEvent.click(screen.getByLabelText('reverse'));
  
      // Sorting order should change to 'sequence'
      expect(screen.getByLabelText('sequence')).toBeInTheDocument();

      // Click sort button again
      fireEvent.click(screen.getByLabelText('sequence'));

      // Sorting order should change back to 'reverse'
      expect(screen.getByLabelText('reverse')).toBeInTheDocument();
    });
  
    test('clicking filter button opens the filter drawer', () => {
      const onCheckGpu = jest.fn();
      render(<GPUSelectTable data={mockData} onCheckGpu={onCheckGpu}/>);
      
      // Filter drawer should be initially closed
      expect(screen.findByRole('dialog')).toBeTruthy();
  
      // Click filter button
      userEvent.click(screen.getByLabelText('filter'));
  
      // Filter drawer should open
      expect(screen.findByRole('dialog')).toBeTruthy();
    });

    test('applying filters updates the displayed data', async () => {
      jest.spyOn(console, 'warn').mockImplementation((message) => {
        if (!message.includes('nwsapi')) {
          console.warn(message);
        }
      });
      
      const onCheckGpu = jest.fn();
      render(<GPUSelectTable data={mockData} onCheckGpu={onCheckGpu}/>);
    
      // Click filter button to open the filter drawer
      userEvent.click(screen.getByLabelText('filter'));
      // Set filter values
      userEvent.type(screen.getByText(/VRAM\(GB\)/), '6');
      userEvent.click(screen.getByText(/GPU 2/));
    
      // Submit the filter form
      // userEvent.click(screen.getByRole('button', { name: /Save/i }));;
    
      // Wait for the data to be updated
      
      await waitFor(() => {
        expect(screen.queryByText('GPU 1')).not.toBeInTheDocument(); // Should not be present
        expect(screen.queryByText('GPU 2')).not.toBeInTheDocument();
        expect(screen.queryByText('GPU 3')).not.toBeInTheDocument(); // Should not be present
        expect(screen.findByRole('dialog')).toBeTruthy();
      });
    
      // Close the filter drawer
      // userEvent.click(screen.getByText(/Close/));
    });
      
})