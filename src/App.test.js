import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// ✅ FIX: Valid test that checks for actual content in the app
describe('Silver Calculator App', () => {
    test('renders silver calculator header', () => {
        render(<App />);
        const headerElement = screen.getByText(/Silver Calculator/i);
        expect(headerElement).toBeInTheDocument();
    });

    test('renders silver price input fields', () => {
        render(<App />);
        const silverPrice999Input = screen.getByPlaceholderText(/Enter 999k silver price/i);
        const silverPrice925Input = screen.getByPlaceholderText(/Auto-calculated 925k price/i);
        
        expect(silverPrice999Input).toBeInTheDocument();
        expect(silverPrice925Input).toBeInTheDocument();
    });

    test('renders transaction type selector', () => {
        render(<App />);
        const saleRadio = screen.getByLabelText(/Sale/i);
        const returnRadio = screen.getByLabelText(/Return/i);
        
        expect(saleRadio).toBeInTheDocument();
        expect(returnRadio).toBeInTheDocument();
    });

    test('renders product table', () => {
        render(<App />);
        const productHeader = screen.getByText(/Product/i);
        const qtyHeader = screen.getByText(/Qty/i);
        
        expect(productHeader).toBeInTheDocument();
        expect(qtyHeader).toBeInTheDocument();
    });

    test('renders add row button', () => {
        render(<App />);
        const addButton = screen.getByText(/Add Row/i);
        expect(addButton).toBeInTheDocument();
    });

    test('calculates 925K silver price when 999K price is entered', async () => {
        render(<App />);
        const silverPrice999Input = screen.getByPlaceholderText(/Enter 999k silver price/i);
        
        // Enter a 999K price
        fireEvent.change(silverPrice999Input, { target: { value: '3500' } });
        
        await waitFor(() => {
            const silverPrice925Input = screen.getByPlaceholderText(/Auto-calculated 925k price/i);
            // 925K price = 999K price * (925 / 999)
            // 3500 * 0.92... ≈ 3220
            expect(silverPrice925Input.value).not.toBe('');
        });
    });

    test('adds new row when add button is clicked', () => {
        render(<App />);
        const addButton = screen.getByText(/Add Row/i);
        
        // Initially should have 1 row (tbody has 1 tr)
        const initialRows = document.querySelectorAll('#productTableBody tr');
        const initialCount = initialRows.length;
        
        // Click add row
        fireEvent.click(addButton);
        
        // Should now have 2 rows
        const newRows = document.querySelectorAll('#productTableBody tr');
        expect(newRows.length).toBe(initialCount + 1);
    });

    test('displays copyright notice', () => {
        render(<App />);
        const copyrightText = screen.getByText(/Mohamed Hassan Elsawsany/i);
        expect(copyrightText).toBeInTheDocument();
    });

    test('opens license modal when clicking license info', async () => {
        render(<App />);
        const licenseButton = screen.getByText(/View License/i);
        
        fireEvent.click(licenseButton);
        
        await waitFor(() => {
            const modalTitle = screen.getByText(/Software License Agreement/i);
            expect(modalTitle).toBeInTheDocument();
        });
    });
});