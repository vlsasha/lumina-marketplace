const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingCart.tsx', 'utf8');

// Remove the early return
code = code.replace("if (items.length === 0) return null;", "// Floating cart is now always visible");

// Update the modal to show 'Cart is empty' if items is 0
const modalContentOld = `<div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (`;
const modalContentNew = `<div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4 opacity-50"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <p>Your cart is empty</p>
                </div>
              ) : items.map((item) => (`;

code = code.replace(modalContentOld, modalContentNew);
fs.writeFileSync('src/components/FloatingCart.tsx', code);
