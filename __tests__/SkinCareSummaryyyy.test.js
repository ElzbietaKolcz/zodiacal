import React from 'react';
import { render } from '@testing-library/react-native';
import Summary from '../scr/screens/skinCare/Summary'; // Podaj prawidłową ścieżkę do komponentu

describe('Summary Component', () => {

 it('renders the PieChart', () => {
    const { getByTestId } = render(<Summary />);
    
    const pieChart = getByTestId('pie-chart'); 
    expect(pieChart).toBeTruthy();
  });

  it('calculates percentages correctly', () => {
    const { getByTestId } = render(<Summary />);
    
    const data = [
      { amount: 8 },
      { amount: 5 },
      { amount: 10 },
      { amount: 7 },
    ];

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    
    const expectedPercentages = data.map(item => ((item.amount / total) * 100).toFixed(2));

    expectedPercentages.forEach((expectedPercentage, index) => {
      const percentageCell = getByTestId(`percentage-cell-${index}`);
      expect(percentageCell.textContent).toBe(expectedPercentage);
    });
  });

  it('renders correct amounts in the DataTable', () => {
    const { getAllByText } = render(<Summary />);

    expect(getAllByText('8')).toHaveLength(1);
    expect(getAllByText('5')).toHaveLength(1);
    expect(getAllByText('10')).toHaveLength(1);
    expect(getAllByText('7')).toHaveLength(1);
  });
});
