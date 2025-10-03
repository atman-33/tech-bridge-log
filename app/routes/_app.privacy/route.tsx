import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "Privacy Policy - Tech Bridge Log" },
    {
      name: "description",
      content:
        "Privacy policy for Tech Bridge Log - technical blog and insights platform.",
    },
  ];
}

const PrivacyPage = () => (
  <div className="min-h-screen px-4 py-12">
    <div className="container mx-auto max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-bold text-4xl">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              When you use Tech Bridge Log, we may collect the following
              information:
            </p>
            <ul>
              <li>
                <strong>Reading Analytics:</strong> We collect information about
                which articles you read, search queries, and time spent on pages
                to improve content recommendations.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect information about
                how you navigate our blog, including pages visited, links
                clicked, and features used.
              </li>
              <li>
                <strong>Technical Data:</strong> We automatically collect
                certain technical information, including your IP address,
                browser type, device information, and referrer URLs.
              </li>
              <li>
                <strong>Search Data:</strong> Search queries and results to
                improve our search functionality and content discovery.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide and maintain our technical blog platform</li>
              <li>
                To improve content recommendations and search functionality
              </li>
              <li>
                To analyze reading patterns and optimize our content strategy
              </li>
              <li>To enhance user experience and site performance</li>
              <li>To ensure the security and integrity of our platform</li>
              <li>To generate anonymous analytics and usage statistics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Your data is stored securely using Cloudflare's infrastructure:
            </p>
            <ul>
              <li>All data is encrypted in transit and at rest</li>
              <li>
                We use Cloudflare D1 database with built-in security features
              </li>
              <li>Access to your data is strictly controlled and monitored</li>
              <li>We implement industry-standard security practices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Our blog platform integrates with the following third-party
              services:
            </p>
            <ul>
              <li>
                <strong>Cloudflare:</strong> For hosting, CDN, analytics, and
                security services
              </li>
              <li>
                <strong>GitHub:</strong> For content management and version
                control of articles
              </li>
            </ul>
            <p>
              These services have their own privacy policies, and we encourage
              you to review them.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li>
                <strong>Access:</strong> You can request access to your personal
                data
              </li>
              <li>
                <strong>Correction:</strong> You can request correction of
                inaccurate data
              </li>
              <li>
                <strong>Deletion:</strong> You can request deletion of your
                personal data
              </li>
              <li>
                <strong>Portability:</strong> You can request a copy of your
                data in a portable format
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default PrivacyPage;
