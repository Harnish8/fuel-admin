import './globals.css';

export const metadata = {
  title: 'Nabh Petroleum',
  description: 'Fuel Management Admin Panel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}