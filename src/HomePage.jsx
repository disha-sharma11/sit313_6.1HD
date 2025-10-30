import Navbar from './Components/Navbar.jsx';
import Image from './Components/Image.jsx';
import Heading from './Components/Heading.jsx';
import FeaturedArticles from './Components/FeaturedArticles.jsx';
// import SeeAll from './Components/SeeAll.jsx';
import FeaturedTutorials from './Components/FeaturedTutorials.jsx';
import SignUp from './Components/SignUp.jsx';
import Footer from './Components/Footer.jsx';

function HomePage() { 
  return (
    <div >
      <Navbar />
      <Image />
      <div className="uniform-section">
        <Heading title="Featured Articles" />
        <FeaturedArticles />
        {/* <SeeAll category="Articles" /> */}
      </div>
      <div className="uniform-section">
        <Heading title="Featured Tutorials" />
        <FeaturedTutorials />
        {/* <SeeAll category="Tutorials" /> */}
      </div>
      <div className="uniform-section">
        <SignUp />
      </div>
      <div className="uniform-section">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;