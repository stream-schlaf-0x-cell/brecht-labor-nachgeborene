import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brecht-Labor · An die Nachgeborenen',
  description: 'Ein interaktives Lern- und Analyselabor zu Bertolt Brechts An die Nachgeborenen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
