'use client';

import './globals.css';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store'; // Path to your Redux store
import LayoutWithNav from '../components/signup/layoutwithnav'; // Your client-side layout component
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body className="bg-bg">
        {/* Wrap everything with Redux Provider */}
        <Provider store={store}>
          <LayoutWithNav>{children}</LayoutWithNav>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
