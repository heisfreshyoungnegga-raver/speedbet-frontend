import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const siteMapLinks = [
    { path: '/', label: 'Home' },
    { path: '/games', label: 'Games' },
    { path: '/predictions', label: 'Predictions' },
    { path: '/promotions', label: 'Promotions' },
    { path: '/my-bets', label: 'My Bets' },
    { path: '/wallet', label: 'Wallet' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/privacy', label: 'Privacy Policy' },
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://facebook.com/speedbet', label: 'Facebook' },
    { icon: Twitter, url: 'https://twitter.com/speedbet', label: 'Twitter' },
    { icon: Instagram, url: 'https://instagram.com/speedbet', label: 'Instagram' },
    { icon: MessageCircle, url: 'https://t.me/speedbet', label: 'Telegram' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <NavLink 
              to="/" 
              className="font-oswald text-2xl font-bold text-brand-gold mb-4 block"
            >
              SpeedBet
            </NavLink>
            <p className="text-sm">
              The fastest sports betting platform with real-time odds and instant payouts.
            </p>
          </div>

          {/* Site Map */}
          <div>
            <h3 className="text-white font-medium mb-4">Site Map</h3>
            <ul className="space-y-2">
              {siteMapLinks.map((link) => (
                <li key={link.path}>
                  <NavLink 
                    to={link.path} 
                    className="text-sm hover:text-brand-gold transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink 
                  to="/responsible-gambling" 
                  className="text-sm hover:text-brand-gold transition-colors"
                >
                  Responsible Gambling
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:support@speedbet.com" 
                  className="hover:text-brand-gold transition-colors"
                >
                  support@speedbet.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+1234567890" 
                  className="hover:text-brand-gold transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <NavLink 
                  to="/faq" 
                  className="hover:text-brand-gold transition-colors"
                >
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-medium mb-4">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-full hover:bg-brand-green transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Responsible Gambling */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} SpeedBet. All rights reserved. 18+ Only. Gamble Responsibly.
          </p>
          <NavLink 
            to="/responsible-gambling" 
            className="hover:text-brand-gold transition-colors"
          >
            Responsible Gambling Resources
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
