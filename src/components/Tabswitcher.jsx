import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabSwitcher = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mb-8">
      <TabsList className="inline-flex md:w-[200px] gap-2">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabSwitcher;
