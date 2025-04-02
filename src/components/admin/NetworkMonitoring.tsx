
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "@/contexts/PackagesContext";
import NetworkDeviceStats from "./NetworkDeviceStats";
import MikroTikSetupGuide from "./MikroTikSetupGuide";

interface NetworkMonitoringProps {
  activeUsers: any[];
  packages: Package[];
}

const NetworkMonitoring = ({ activeUsers, packages }: NetworkMonitoringProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Network Stats</TabsTrigger>
          <TabsTrigger value="setup">MikroTik Setup Guide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <NetworkDeviceStats />
        </TabsContent>
        
        <TabsContent value="setup">
          <MikroTikSetupGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkMonitoring;
