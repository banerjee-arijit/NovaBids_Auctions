import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabSwitcher = ({ contentText }) => {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList className="inline-flex md:w-[200px] gap-2">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabSwitcher;
