import "../Components/Card.css";
import "./Plans.css";
import Button from "../Components/Button";
import BackButton from "../Components/BackButton";

function Plans() {
  const makePayment = async () => {
    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }
      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="plans-page">
      <BackButton />
      <h1 className="page-title">Pricing Plans</h1>
      <p className="page-description">
        The <strong>DEV@Deakin</strong> platform helps students and professionals connect, share
        knowledge, and grow together. Choose the plan that fits your needs — stay on the
        <b> Free plan</b> to explore and contribute, or upgrade to <b>Premium</b> for advanced
        features, customization options, and exclusive insights.
      </p>

      <div className="plans-container">
        <div className="Card">
          <h2>Free Plan</h2>
          <p>Perfect for students and casual users who just want to participate and learn.</p>
          <ul>
            <li>✅ Access to all public questions and posts</li>
            <li>✅ Ability to post questions and answers</li>
            <li>✅ Join community discussions and threads</li>
            <li>✅ Basic profile view and post history</li>
            <li>✅ Save or bookmark up to 10 posts</li>
            <li>✅ Limited upload support (images only)</li>
            <li>❌ No banner or theme customization</li>
            <li>❌ No analytics or admin insights</li>
          </ul>
          <Button text="Current Plan" type="button" disabled />
        </div>

        <div className="Card premium">
          <h2>Premium Plan</h2>
          <p>
            Designed for creators, mentors, and admins who want complete control, insights, and
            personalization tools.
          </p>
          <ul>
            <li>✨ Custom banners and profile themes</li>
            <li>✨ Advanced post customization (fonts, layouts, highlights)</li>
            <li>✨ In-app messaging with attachments and reactions</li>
            <li>✨ Private groups and community moderation tools</li>
            <li>✨ Detailed analytics dashboard (post views, engagement, growth)</li>
            <li>✨ Admin tools for content review and reports</li>
            <li>✨ Schedule posts and announcements</li>
            <li>✨ AI-powered content suggestions</li>
            <li>✨ Ad-free and distraction-free experience</li>
            <li>✨ Early access to beta features and updates</li>
            <li>✨ Dedicated support and feedback channel</li>
          </ul>
          <Button type="submit" onClick={makePayment} text="Buy Premium" />
        </div>
      </div>
    </div>
  );
}

export default Plans;
