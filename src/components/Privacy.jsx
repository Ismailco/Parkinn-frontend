import React from 'react';

const Privacy = () => {
  return (
    <div className="text-white bg-gray-400/50 w-full flex flex-col justify-start items-center">
      <h1 className="text-2xl mt-4 font-bold">Privacy Policy for ParkInn</h1>
      <hr className="w-96 my-4 border-2 border-gray-100" />
      <div className="mx-4">
        <p className="text-lg">
          Last updated: [19/05/2023]
          <br />
          <br />
          Welcome to ParkInn, a service provided by [Your Company Name] (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
          <br />
          <br />
          Our Privacy Policy explains how we treat your personal data and protect your privacy when you use our services. By using our services, you agree to the terms of this Privacy Policy and your continued use signifies your acceptance of this policy. If you do not agree with this policy, you should not use our services.
        </p>
        <h2 className="text-xl mt-10 mb-2 font-bold">1.Information We Do Not Collect</h2>
        <p className="text-lg">ParkInn is committed to protecting your privacy and has been designed with the intention of providing you with a service, without collecting any personal data. We do not collect, store, process, or share any personal data while you use our service.</p>
        <ul className="list-disc list-inside mt-4">
          This includes:
          <br />
          <br />
          <li>Personal identification information</li>
          <li>Contact information</li>
          <li>Location data</li>
          <li>Device information</li>
          <li>Usage data</li>
        </ul>
        <h2 className="text-xl mt-10 mb-2 font-bold">2. Third-Party Services</h2>
        <p className="text-lg">Our service may include links to third-party websites or services, such as third-party integrations, within our service. We do not control these third-party services, and we encourage you to read the privacy policy of every website you visit or service you use.</p>
        <h2 className="text-xl mt-10 mb-2 font-bold">3. Changes to This Privacy Policy</h2>
        <p className="text-lg">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        <h2 className="text-xl mt-10 mb-2 font-bold">4. Contact Us</h2>
        <p className="text-lg">If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
        <p className="text-lg my-10">This Privacy Policy was created for ParkInn.</p>
      </div>
    </div>
  );
};

export default Privacy;
