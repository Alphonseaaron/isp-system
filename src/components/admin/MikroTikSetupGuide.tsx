
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const MikroTikSetupGuide = () => {
  const handleDownloadPDF = () => {
    toast({
      title: "Guide Downloaded",
      description: "MikroTik setup guide has been downloaded as PDF",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">MikroTik Setup Guide</h2>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step MikroTik Winbox Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Access MikroTik via Winbox</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect your PC to the router via Ethernet.</li>
              <li>Open Winbox, go to the Neighbors tab, and connect using MAC address or IP.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. Set Up a Hotspot</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Go to IP → Hotspot and click "Hotspot Setup".</li>
              <li>Select the WiFi interface (e.g., wlan1).</li>
              <li>Set the local hotspot IP (e.g., 192.168.88.1/24).</li>
              <li>Enable DHCP server (so devices get IP addresses automatically).</li>
              <li>Set the DNS name (e.g., breamtwifi.local).</li>
              <li>Configure login method: Choose MAC + HTTP CHAP (for user authentication).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3. Create a Walled Garden (Allow Payment Page Access)</h3>
            <p>Go to IP → Hotspot → Walled Garden.</p>
            <p>Add rules to allow access to payment page before login:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              /ip hotspot walled-garden add dst-host=breamtwifi.web.app<br />
              /ip hotspot walled-garden add dst-host=www.sasapay.co.ke
            </div>
            <p className="text-sm text-gray-600">This ensures users can only access the payment page before paying.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">4. Configure Firewall Rules</h3>
            <p>Block unpaid users from accessing the internet:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              /ip firewall filter add chain=forward src-address=192.168.88.0/24 hotspot=!auth action=reject
            </div>
            <p className="text-sm text-gray-600">This ensures only paid users get internet access.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">5. Enable MikroTik API for Firebase Backend</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Go to IP → Services and enable API (port 8728).</li>
              <li>In IP → Firewall → Filter Rules, allow API access:</li>
            </ul>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              /ip firewall filter add chain=input protocol=tcp dst-port=8728 action=accept
            </div>
            <p>Add API user for Firebase backend:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              /user add name=apiuser password=securepass group=full
            </div>
            <p className="text-sm text-gray-600">The Firebase backend will use this API to create/delete hotspot users when payments are verified.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">6. Set Up User Profiles (Time-based Access)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Go to IP → Hotspot → User Profiles.</li>
              <li>Create a profile for 3-hour access:</li>
              <ul className="list-disc pl-5">
                <li>Name: 3hr</li>
                <li>Limit Uptime: 3h</li>
                <li>Rate Limit: 5M/5M (optional)</li>
              </ul>
              <li>Repeat for 6-hour access (6hr).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">7. Test the Hotspot & Payment Flow</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect a phone/laptop to BREAMT WiFi.</li>
              <li>Check if it redirects to the payment page.</li>
              <li>Pay using SasaPay.</li>
              <li>Confirm that the user gets internet access for the correct time.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Final Notes</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>You must manually configure MikroTik via Winbox before integrating with Firebase.</li>
              <li>Your Firebase backend will use the MikroTik API to automate user access based on payments.</li>
              <li>If needed, contact support for guidance through the SasaPay API setup and how to link it with MikroTik.</li>
            </ul>
          </div>

          <div className="bg-amber-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Firebase Configuration Reference</h3>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
              {`// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCN9FD6-5H-tsB1tDICBHJO7K8CK_SbP8",
  authDomain: "breamtwifi.firebaseapp.com",
  projectId: "breamtwifi",
  storageBucket: "breamtwifi.firebasestorage.app",
  messagingSenderId: "834262227586",
  appId: "1:834262227586:web:9a8247bf51b60a7a4cb29b",
  measurementId: "G-D3TDS7PX0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MikroTikSetupGuide;
