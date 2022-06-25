import React from 'react';
import ApartmentRooms from './ApartmentRooms';
import Banner from './Banner';
import Reviews from './Reviews';
import Services from './Services';

const Home = () => {
    return (
        <div>
            <Banner />
            <Services />
            <ApartmentRooms />
            <Reviews />
        </div>
    );
};

export default Home;



