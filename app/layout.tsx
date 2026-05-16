import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tapestry NoCode",
  description: "Building a Hotel Booking app with Apache Tapestry 5.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <header>
            <nav>
              <a href="/books/tapestry-nocode">Tapestry NoCode</a>
            </nav>
          </header>
          <main className="site-content">{children}</main>
          <footer>
            <p>
              &copy; 2016 Barry Books &mdash;{" "}
              <a href="https://thetube.today">thetube.today</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
