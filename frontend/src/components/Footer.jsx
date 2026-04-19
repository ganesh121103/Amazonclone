import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-amazon-blue-dark text-gray-300 mt-auto">
      {/* Back to top */}
      <div
        className="bg-amazon-blue text-white text-center py-3 text-sm cursor-pointer hover:bg-amazon-blue-light transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </div>

      {/* Footer links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-sm">
            {['Careers', 'Blog', 'About Amazon', 'Investor Relations', 'Amazon Devices'].map((l) => (
              <li key={l}><a href="#" className="hover:text-amazon hover:underline transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-sm">
            {['Sell on Amazon', 'Affiliate Program', 'Advertise Your Products', 'Self-Publish'].map((l) => (
              <li key={l}><a href="#" className="hover:text-amazon hover:underline transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Amazon Payment</h3>
          <ul className="space-y-2 text-sm">
            {['Amazon Pay', 'Amazon Visa Card', 'Gift Cards', 'Reload Balance', 'Currency Converter'].map((l) => (
              <li key={l}><a href="#" className="hover:text-amazon hover:underline transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-sm">
            {['Your Account', 'Your Orders', 'Shipping Rates', 'Returns & Replacements', 'Help'].map((l) => (
              <li key={l}><a href="#" className="hover:text-amazon hover:underline transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-xl font-extrabold">
            <span className="text-white">amazon</span><span className="text-amazon">.in</span>
          </Link>
          <div className="flex gap-4">
            {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-amazon transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Amazon Clone. Built with MERN Stack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
