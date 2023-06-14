import React from "react";
import OurServices from "./Shared/OurServices";
import ServicesBanner from "../images/service-1.webp";
import { Parallax } from "react-parallax";
import Amenities from "./Shared/Amenities";

const Services = () => {
  const styles = {
    display: "lg:grid",
    gridCols: "grid-cols-4",
    marginX: "lg:mx-24 mx-8",
    paddingY: "lg:py-6",
  };
  return (
    <div className="min-h-screen bg-accent">
      <Parallax
        bgImage={ServicesBanner}
        strength={500}
        bgImageStyle={{ height: "600px", width: "100%" }}
        bgClassName="parallax-image"
      >
        <div className="parallex-gradient h-96 flex justify-center items-center">
          <div>
            <p className="text-lg text-white text-center mt-14 lg:mt-0">
              Home <i className="fa-solid fa-angle-right text-xs"></i> Services{" "}
              <i className="fa-solid fa-angle-right text-xs"></i>
            </p>
            <h1 className="lg:text-6xl text-4xl font-serif text-white font-semibold lg:mt-16">
              Services
            </h1>
          </div>
        </div>
      </Parallax>
      <OurServices></OurServices>
      <div>
        <h1 className="text-5xl text-center my-6 font-serif">Amenities</h1>
        <Amenities styles={styles}></Amenities>
      </div>
    </div>
  );
};

export default Services;
