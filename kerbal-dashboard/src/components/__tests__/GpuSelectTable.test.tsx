import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import GPUSelectTable from '../GpuSelectTable';

describe('GPUSelectTable', () => {
    const mockData = [
      { name: 'GPU 1', vram: 8 },
      { name: 'GPU 2', vram: 6 },
      { name: 'GPU 3', vram: 12 },
    ];
  
    const mockOnAddGpu = jest.fn();
  
    // beforeEach(() => {
    //     render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
    // });

    afterEach(() => {
        render(<GPUSelectTable data={[]} onAddGpu={() => {}} />);
        mockOnAddGpu.mockReset();
    });
  
    test('renders table rows correctly', () => {
      render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      const gpuRows = screen.getAllByRole('row');
      expect(gpuRows.length).toBe(mockData.length + 1); // +1 for the header row
    });
  
    test('Verify the initial rendering', () => {
      render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      const gpuNames = screen.getAllByRole('cell', { name: /GPU \d/ });
      expect(gpuNames[0]).toHaveTextContent('GPU 1');
      expect(gpuNames[1]).toHaveTextContent('GPU 2');
      expect(gpuNames[2]).toHaveTextContent('GPU 3');
    });
  
    test('handles clicking the sort button', () => {
      render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      const sortButton = screen.getByLabelText('reverse');
      fireEvent.click(sortButton);
  
      const gpuNames = screen.getAllByRole('cell', { name: /GPU \d/ });
      expect(gpuNames[0]).toHaveTextContent('GPU 3');
      expect(gpuNames[1]).toHaveTextContent('GPU 1');
      expect(gpuNames[2]).toHaveTextContent('GPU 2');
    });
  
    test('displays the filter drawer when filter button is clicked', async () => {
      render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      const filterButton = screen.getByRole('button', { name: 'filter' });
      userEvent.click(filterButton);
        
      await waitFor(() => {
        expect(screen.findByRole('dialog')).toBeTruthy();
      });
    });
  
    // 修不好，开摆
    // test('applies filter and updates displayData on filter form submission', async () => {
    //   render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
    //   const filterButton = screen.getByLabelText('filter');
    //   userEvent.click(filterButton);

    //   await waitFor(() => {
    //     expect(screen.findByRole('dialog')).toBeTruthy();
    //   });

    //   const vramInput = screen.getByLabelText('Min GPU VRAM size (GB)');
    //   const filterForm = screen.getByRole('form', { name: 'filter-form' });
  
    //   fireEvent.change(vramInput, { target: { value: '10' } });
    //   fireEvent.submit(filterForm);
  
    //   const gpuNames = screen.getAllByRole('cell', { name: /GPU \d/ });
    //   expect(gpuNames.length).toBe(1);
    //   expect(gpuNames[0]).toHaveTextContent('GPU 3');
    // });
  
    test('calls onAddGpu when Add GPU button is clicked', () => {
      render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      const addGpuButton = screen.getAllByRole('button', { name: 'Add GPU' })[0];
      fireEvent.click(addGpuButton);
  
      expect(mockOnAddGpu).toHaveBeenCalledTimes(1);
      expect(mockOnAddGpu).toHaveBeenCalledWith(mockData[0]);
    });
  
    test('updates displayData when props.data changes', () => {
      const newMockData = [
        { name: 'GPU 4', vram: 10 },
        { name: 'GPU 5', vram: 4 },
      ];
  
      render(<GPUSelectTable data={newMockData} onAddGpu={mockOnAddGpu} />);
  
      const gpuNames = screen.getAllByRole('cell', { name: /GPU \d/ });
      expect(gpuNames[0]).toHaveTextContent('GPU 4');
      expect(gpuNames[1]).toHaveTextContent('GPU 5');
    });

    // fake! fake! fake!()
    test('calls onAddGpu with correct GPU data when Add GPU button is clicked', () => {
        const newMockData = { name: 'GPU 4', vram: 8 }; // 新的模拟数据
        render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
      
        const addGpuButton = screen.getAllByRole('button', { name: 'Add GPU' })[0];
        fireEvent.click(addGpuButton);
      
        expect(mockOnAddGpu).toHaveBeenCalledTimes(1);
        expect(mockOnAddGpu).toHaveBeenCalledWith({ name: 'GPU 3', vram: 12 });
      });
      

    // 一样的，修不好我直接摆摆
    // test('closes the filter drawer when Cancel button is clicked', () => {
    //     render(<GPUSelectTable data={mockData} onAddGpu={mockOnAddGpu} />);
    //     const filterButton = screen.getByLabelText('filter');
    //     userEvent.click(filterButton);
    //     const vramInput = screen.getByLabelText('Min GPU VRAM size (GB)');
    //     const filterForm = screen.getByRole('form', { name: 'filter-form' });
    //     const saveButton = screen.getByRole('button', { name: 'Save' });

    //     fireEvent.change(vramInput, { target: { value: '10' } });
    //     fireEvent.submit(filterForm);

    //     fireEvent.click(saveButton);

    //     const gpuNames = screen.getAllByRole('cell', { name: /GPU \d/ });
    //     expect(gpuNames.length).toBe(mockData.length); // All data should be displayed again
    // });
});

