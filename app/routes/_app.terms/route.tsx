import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Terms of Service - Tech Bridge Log" },
    { name: "description", content: "Terms of service for Tech Bridge Log - technical blog and insights platform." },
  ];
}

const TermsPage = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                By accessing and using Tech Bridge Log ("Service"),
                you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Tech Bridge Log is a technical blog platform that provides:
              </p>
              <ul>
                <li>Technical articles and tutorials on modern web development</li>
                <li>Insights on React, TypeScript, Cloudflare, and other technologies</li>
                <li>Search functionality to discover relevant content</li>
                <li>Tag-based content organization and filtering</li>
                <li>Responsive design optimized for all devices</li>
              </ul>
              <p>
                The Service is provided "as is" and is intended for educational and informational purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Tech Bridge Log is currently a read-only platform that does not require user accounts:
              </p>
              <ul>
                <li>All content is freely accessible without registration</li>
                <li>No personal information is required to read articles</li>
                <li>Search and browsing features are available to all visitors</li>
                <li>We may introduce user accounts in the future for enhanced features</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Use automated tools to scrape or download content excessively</li>
                <li>Redistribute our content without proper attribution</li>
                <li>Use the Service in any way that could damage our reputation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                All articles, tutorials, and original content on Tech Bridge Log are the exclusive
                property of Tech Bridge Log and its authors, unless otherwise stated.
              </p>
              <p>
                The content is protected by copyright laws. You may share links to our articles and
                quote brief excerpts with proper attribution, but you may not reproduce entire articles
                or create derivative works without explicit permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs
                your use of the Service, to understand our practices.
              </p>
              <p>
                By using the Service, you consent to the collection and use of information as outlined
                in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations
                or warranties of any kind, express or implied, as to the operation of the Service or the
                information, content, materials, or products included on the Service.
              </p>
              <p>
                You expressly agree that your use of the Service is at your sole risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                In no event shall the service provider be liable for any indirect, incidental, special,
                consequential, or punitive damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We may terminate or suspend your account and bar access to the Service immediately,
                without prior notice or liability, under our sole discretion, for any reason whatsoever
                and without limitation, including but not limited to a breach of the Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
};

export default TermsPage;