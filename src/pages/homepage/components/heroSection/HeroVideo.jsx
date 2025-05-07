import { ContainerScroll } from "@/components/ui/container-scroll-animation";

const HeroVideo = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Unlock the Potential of <br />
              <span className="text-4xl md:text-[4rem]  mt-1 leading-none">
                Smart Bidding with <span className="font-bold">Novabids</span>
              </span>
            </h1>
          </>
        }
      >
        <img
          src={`https://img.freepik.com/free-vector/bid-design-landing-page_52683-76083.jpg?semt=ais_hybrid&w=740`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
};

export default HeroVideo;
