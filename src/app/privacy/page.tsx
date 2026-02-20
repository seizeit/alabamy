import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Privacy Policy | Alabamy",
  description: "Privacy policy for Alabamy, Alabama's news aggregator.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: February 20, 2026
          </p>

          <div className="prose prose-gray max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                What Alabamy Is
              </h2>
              <p>
                Alabamy (<a href="https://alabamy.com" className="text-crimson-500 hover:text-crimson-600">alabamy.com</a>) is
                a news aggregator for the state of Alabama. We collect and display headlines from
                80+ publicly available news sources — newspapers, TV stations, public radio, Reddit
                communities, and YouTube channels — and link directly to the original articles on
                their publishers&apos; websites. We do not host, reproduce, or modify any news content.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Information We Collect
              </h2>
              <p>
                Alabamy does not require user accounts, logins, or registration of any kind.
                We do not collect your name, email address, or any personally identifiable
                information through the use of this site.
              </p>
              <p className="mt-3">
                We may collect standard, anonymous analytics data through Google Analytics,
                which may include:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Pages visited and time spent on the site</li>
                <li>Referring website or search engine</li>
                <li>General geographic region (city/state level, not precise location)</li>
                <li>Device type, browser, and operating system</li>
                <li>Aggregate traffic patterns and usage trends</li>
              </ul>
              <p className="mt-3">
                This data is collected in aggregate form to help us understand how people use
                Alabamy and to improve the site. It is not used to identify individual visitors.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Cookies
              </h2>
              <p>
                Alabamy itself does not set cookies. However, Google Analytics uses cookies to
                distinguish unique visitors and track sessions. These are standard analytics
                cookies used by millions of websites. You can opt out of Google Analytics
                tracking by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener"
                  className="text-crimson-500 hover:text-crimson-600"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                , or by adjusting your browser&apos;s cookie settings.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                External Links
              </h2>
              <p>
                Alabamy is, by design, a collection of links to external websites. When you
                click on a headline, you leave Alabamy and are directed to the original
                publisher&apos;s website. Each of those websites has its own privacy policy and
                data collection practices, which we do not control and are not responsible for.
                We encourage you to review the privacy policies of any site you visit through
                our links.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                How We Use Information
              </h2>
              <p>
                Any analytics data we collect is used solely for the following purposes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Understanding which topics and regions are most popular</li>
                <li>Improving the layout, design, and usability of the site</li>
                <li>Identifying technical issues or broken features</li>
                <li>Making decisions about which news sources to add or prioritize</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share any data with third parties for marketing
                purposes. We do not serve advertising on this site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Data Retention
              </h2>
              <p>
                Headlines displayed on Alabamy are automatically pruned on a rolling basis.
                We retain a maximum of 20 headlines per source at any given time. Older
                headlines are permanently deleted during each daily update cycle. We do not
                maintain an archive of past news content.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Children&apos;s Privacy
              </h2>
              <p>
                Alabamy is a general-audience news aggregator. We do not knowingly collect
                any information from children under the age of 13. Since we do not collect
                personal information from any visitors, this concern is inherently mitigated
                by the design of the site.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Do Not Track
              </h2>
              <p>
                Some web browsers transmit &ldquo;Do Not Track&rdquo; signals. Because Alabamy does not
                collect personal information or track individual users beyond anonymous
                analytics, the site&apos;s behavior does not change in response to Do Not Track
                signals.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time as the site evolves.
                Any changes will be posted on this page with an updated revision date.
                Continued use of Alabamy after changes are posted constitutes acceptance
                of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Contact
              </h2>
              <p>
                If you have questions about this privacy policy or how Alabamy handles data,
                you can reach us at{" "}
                <a
                  href="mailto:hello@alabamy.com"
                  className="text-crimson-500 hover:text-crimson-600"
                >
                  hello@alabamy.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Governing Law
              </h2>
              <p>
                This privacy policy is governed by the laws of the State of Alabama.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
