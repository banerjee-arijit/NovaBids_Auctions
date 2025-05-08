import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Book, CheckCircle } from "lucide-react";
import topics from "@/static/TutorialData";

export default function TutorialDemo() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-gray-900">
      <div className="md:w-64 border-b md:border-b-0 md:border-r p-4">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Book className="w-5 h-5" />
          Docs Menu
        </h2>
        <ScrollArea className="md:h-[85vh] md:pr-0 md:py-5">
          <div className="flex md:flex-col gap-2 overflow-auto">
            {topics.map((topic) => (
              <Button
                key={topic.id}
                variant={selectedTopic.id === topic.id ? "default" : "ghost"}
                className="whitespace-nowrap md:w-full justify-start text-left"
                onClick={() => setSelectedTopic(topic)}
              >
                {topic.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Card className="max-w-3xl mx-auto shadow-md border rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {selectedTopic.title}
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                {selectedTopic.content}
              </p>
            </div>

            {/* Process Steps */}
            {selectedTopic.process && selectedTopic.process.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Step-by-step Process
                </h2>
                <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                  {selectedTopic.process.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <div className=" flex flex-col gap-3">
                        <span>{item.step}</span>
                        <img src={item.image} className="rounded-2xl" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
