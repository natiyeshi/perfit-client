"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import React from "react";

// Components
import InventoryCards from "../../_modules/inventory/InventoryCards";
import TopCompetitorsByQuantity from "../../_modules/reports/TopCompetitorsByQuantity";
import TransactionsPieChart from "../../_modules/reports/TransactionGraph";
import Incomes from "../../_modules/reports/Incomes";
import Reports from "../../_modules/reports/Reports";

// Icons
import { BarChart2, LineChart, Box, Users, FileText } from "lucide-react";

const tabData = [
  { id: "all", label: "All", icon: <BarChart2 className="w-4 h-4 mr-2" /> },
  { id: "sales", label: "Sales", icon: <LineChart className="w-4 h-4 mr-2" /> },
  { id: "inventory", label: "Inventory", icon: <Box className="w-4 h-4 mr-2" /> },
  { id: "competitors", label: "Competitors", icon: <Users className="w-4 h-4 mr-2" /> },
  { id: "reports", label: "Reports", icon: <FileText className="w-4 h-4 mr-2" /> },
];

const Page = () => {
  const [currentTab, setCurrentTab] = useState("all");

  const renderTabContent = () => {
    switch (currentTab) {
      case "reports":
        return <Reports />;
      case "all":
        return (
          <>
            <div className="col-span-1 md:col-span-2">
              <Card className="h-full border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground/90">
                    Sales Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Incomes />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="h-full border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground/90">
                    Transaction Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionsPieChart />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 md:col-span-3">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground/90">
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InventoryCards />
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 md:col-span-3">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground/90">
                    Top Competitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TopCompetitorsByQuantity />
                </CardContent>
              </Card>
            </div>
          </>
        );
      default:
        return (
          <div className="col-span-1 md:col-span-3">
            {currentTab === "sales" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground/90">
                    Sales Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <Incomes />
                    </div>
                    <div>
                      <TransactionsPieChart />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {currentTab === "inventory" && <InventoryCards />}
            {currentTab === "competitors" && <TopCompetitorsByQuantity />}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex-1  from-background to-muted/20  p-4 sm:p-6 md:p-8 md:ps-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Track and analyze your business performance
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6 sm:mb-8 h-fit bg-ed-900 py-12">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-1.5 bg-muted/20 rounded-xl">
            {tabData.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center justify-center py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=active]:border"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;
