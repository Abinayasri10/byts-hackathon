import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const TermsModal = ({ isOpen, onClose, accepted, onAcceptChange }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e) => {
    const element = e.target;
    const threshold = 10; // pixels from bottom
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-secondary">
          <h2 className="text-2xl font-bold text-white">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Scroll Indicator */}
        {!hasScrolledToBottom && (
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
            <p className="text-sm text-yellow-800 text-center font-medium">
              📜 Please scroll down to read all terms and conditions
            </p>
          </div>
        )}

        {/* Content */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="overflow-y-auto p-6 flex-1"
        >
          <div className="prose prose-sm max-w-none text-gray-700">
            
            {/* Section 1 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">1. Acceptance of Terms</h3>
              <p className="mb-2">By registering, logging in, or using this platform, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You are providing true and accurate information</li>
                <li>You agree to comply with these Terms and Conditions</li>
                <li>You accept all platform rules, policies, and updates</li>
              </ul>
              <p className="mt-2 font-semibold">If you do not agree, please do not use the platform.</p>
            </section>

            {/* Section 2 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">2. Purpose of the Platform</h3>
              <p className="mb-2">This platform is designed to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Collect and share interview questions and experiences</li>
                <li>Organize interview data company-wise</li>
                <li>Enable anonymous community discussions</li>
                <li>Maintain structured records of placed students</li>
                <li>Help juniors prepare using real interview insights</li>
              </ul>
              <p className="mt-2">The platform is strictly for educational and informational purposes.</p>
            </section>

            {/* Section 3 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">3. User Accounts</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Each user must register with a valid email address</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>Any activity performed using your account is your responsibility</li>
                <li>Creating multiple or fake accounts is prohibited</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">4. User Conduct</h3>
              <p className="mb-2">Users must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Post false, misleading, or fabricated interview information</li>
                <li>Share abusive, offensive, hateful, or inappropriate content</li>
                <li>Harass, threaten, or impersonate other users</li>
                <li>Attempt to reveal the identity of anonymous users</li>
                <li>Upload copyrighted or confidential company materials</li>
              </ul>
              <p className="mt-2 text-red-600 font-semibold">
                Violation of these rules may lead to account suspension or permanent removal.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">5. Anonymous Community Guidelines</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Anonymous chats are meant for healthy discussions and knowledge sharing</li>
                <li>Identity misuse, trolling, or harmful behavior is strictly prohibited</li>
                <li>Admins reserve the right to monitor and moderate content for safety</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">6. Interview Content Responsibility</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Users are responsible for the interview questions and experiences they share</li>
                <li>Content should be based on personal experience</li>
                <li>The platform does not guarantee accuracy of shared content</li>
                <li>Companies mentioned are not affiliated with this platform</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">7. Placed Student Information</h3>
              <p className="mb-2">Placed students may share:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Company name</li>
                <li>Role/designation</li>
                <li>Interview experience</li>
              </ul>
              <p className="mt-2">This data is used to help other students prepare better.</p>
              <p className="font-semibold">Sensitive personal information should not be shared publicly.</p>
            </section>

            {/* Section 8 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">8. Admin Rights</h3>
              <p className="mb-2">The admin has the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>View user data for moderation and analytics</li>
                <li>Remove users or content that violate terms</li>
                <li>Send email notifications regarding account actions</li>
                <li>Update platform policies when required</li>
              </ul>
              <p className="mt-2">Admins will act fairly and responsibly.</p>
            </section>

            {/* Section 9 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">9. Content Removal</h3>
              <p className="mb-2">Admins may remove:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Users</li>
                <li>Interview problems</li>
                <li>Posts or comments</li>
              </ul>
              <p className="mt-2">
                Removal actions may be accompanied by an email notification to the registered email ID.
              </p>
            </section>

            {/* Section 10 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">10. Data Privacy</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>User data is stored securely</li>
                <li>Personal data will not be shared with third parties without consent</li>
                <li>Anonymous chats do not display personal identity</li>
                <li>Email IDs are used only for authentication and notifications</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">11. Limitation of Liability</h3>
              <p className="mb-2">The platform is not responsible for:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Job offers or interview outcomes</li>
                <li>Decisions made based on shared content</li>
              </ul>
              <p className="mt-2 font-semibold">Use the information at your own discretion.</p>
            </section>

            {/* Section 12 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">12. Changes to Terms</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Terms and Conditions may be updated at any time</li>
                <li>Continued use of the platform means acceptance of updated terms</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section className="mb-6">
              <h3 className="text-lg font-bold text-primary mb-3">13. Contact</h3>
              <p>For any concerns, queries, or reports, please contact:</p>
              <p className="mt-2">
                📧 <a href="mailto:support@placehub.com" className="text-primary hover:underline font-semibold">
                  support@placehub.com
                </a>
              </p>
            </section>

            {/* Agreement */}
            <section className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-bold text-green-700 mb-2">✅ Agreement</h3>
              <p className="text-gray-700">
                By clicking "I Agree" or signing in, you confirm that you have read, understood, and accepted these Terms and Conditions.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="mb-4 flex items-start">
            <input
              type="checkbox"
              id="acceptTermsModal"
              checked={accepted}
              onChange={(e) => onAcceptChange(e.target.checked)}
              disabled={!hasScrolledToBottom}
              className="w-5 h-5 mt-1 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label 
              htmlFor="acceptTermsModal" 
              className={`ml-3 text-sm font-medium ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-700'}`}
            >
              I have read and agree to all the Terms and Conditions
            </label>
          </div>
          
          {!hasScrolledToBottom && (
            <p className="text-xs text-red-600 mb-3 text-center">
              ⚠️ Please scroll to the bottom to enable the checkbox
            </p>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            {accepted ? 'Continue' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
