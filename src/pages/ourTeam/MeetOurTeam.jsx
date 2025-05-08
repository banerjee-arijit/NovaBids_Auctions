import React from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Github, Twitter } from "lucide-react";
import Navbar from "../homepage/components/navbar/Navbar";
import teamMembers from "@/static/MeetOurTeamData";

const MeetOurTeam = () => {
  return (
    <>
      <Navbar />
      <section className="w-full px-4 py-16 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-medium mb-4">Meet Our Team</h2>
          <p className="text-lg mb-10 text-gray-600">
            The people who make the magic happen 🚀
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col items-center bg-white hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{member.role}</p>
                <div className="flex space-x-4 text-xl text-gray-600">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className="hover:text-blue-600" />
                  </a>
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="hover:text-black" />
                  </a>
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter className="hover:text-sky-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button>join our Team</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default MeetOurTeam;
