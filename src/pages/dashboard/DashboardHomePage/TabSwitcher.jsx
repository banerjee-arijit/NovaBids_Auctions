import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabSwitcher = () => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="grid grid-cols-4 lg:w-[400px]">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
        <TabsTrigger value="ending">Ending Soon</TabsTrigger>
        <TabsTrigger value="new">New</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabSwitcher;
