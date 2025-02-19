import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Terminal,
  Database,
  Shield,
} from "lucide-react";
import Stars from "./Stars";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Pricing", href: "/pricing" },
    ],
    Resources: [
      { name: "Getting Started", href: "/getting-started" },
      { name: "Examples", href: "/examples" },
      { name: "Blog", href: "/blog" },
      { name: "Support", href: "/support" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "Email", icon: Mail, href: "mailto:contact@example.com" },
  ];

  const features = [
    {
      icon: Terminal,
      text: "RESTful API endpoints",
    },
    {
      icon: Database,
      text: "Realistic mock data",
    },
    {
      icon: Shield,
      text: "Secure by default",
    },
  ];

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      {/* Stars Background */}
      <Stars />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/50 dark:from-transparent dark:via-gray-900/50 dark:to-gray-900/70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Terminal className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MockAPI
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md backdrop-blur-sm">
              Create and manage realistic mock APIs for testing and prototyping.
              No coding required.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors backdrop-blur-sm"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6 backdrop-blur-sm">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors backdrop-blur-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-center md:justify-start gap-3 text-gray-600 dark:text-gray-300 backdrop-blur-sm"
            >
              <feature.icon className="h-5 w-5 text-blue-600" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200/20 dark:border-gray-700/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm backdrop-blur-sm">
              © {currentYear} MockAPI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/terms"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors backdrop-blur-sm"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors backdrop-blur-sm"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors backdrop-blur-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
