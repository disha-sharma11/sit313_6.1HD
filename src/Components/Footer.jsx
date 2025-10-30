import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-column">
          <h3>Explore</h3>
          <ul>
            <li>Home</li>
            <li>Questions</li>
            <li>Articles</li>
            <li>Tutorials</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li>FAQs</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Stay connected</h3>
          <div className="social-icons">
            <img src="/Images/facebook.png" alt="Facebook" />
            <img src="/Images/twitter.png" alt="Twitter" />
            <img src="/Images/instagram.png" alt="Instagram" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-brand">DEV@Deakin 2022</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Code of Conduct</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;