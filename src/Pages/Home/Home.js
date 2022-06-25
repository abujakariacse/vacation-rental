import React from 'react';
import ApartmentRooms from './ApartmentRooms';
import Banner from './Banner';
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
        </div>
    );
};

export default Home;



