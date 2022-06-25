import React from 'react';
import ApartmentRooms from './ApartmentRooms';
import Banner from './Banner';
import Blogs from './Blogs';
import GetReady from './GetReady';
import Offer from './Offer';
import Reviews from './Reviews';
import Services from './Services';

const Home = () => {
    return (
        <div>
            <Banner />
            <Services />
            <ApartmentRooms />
            <Reviews />
            <Offer />
            <GetReady />
            <Blogs />
        </div>
    );
};

export default Home;



